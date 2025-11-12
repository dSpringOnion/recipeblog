# ☁️ Cloudflare Media Storage Setup Guide

This guide will help you configure Cloudflare R2 (for images) and Stream (for videos) to handle all media uploads in your Recipe Blog.

## 🚀 Why Cloudflare for Media Storage?

- **💰 Cost Effective**: R2 has no egress fees, Stream is affordable
- **🌍 Global CDN**: Fast delivery worldwide
- **🔒 Secure**: Built-in security and DDoS protection
- **📹 Video Processing**: Stream handles video transcoding automatically
- **🎯 Developer Friendly**: S3-compatible API for R2

## 📋 Prerequisites

1. **Cloudflare Account** with billing enabled
2. **Domain** (optional, but recommended for custom CDN URLs)

## 🔧 Step 1: Set Up Cloudflare R2

### Create R2 Bucket

1. **Login to Cloudflare Dashboard**
2. **Navigate to R2 Object Storage**
3. **Create bucket** named `recipe-images` (or your preferred name)
4. **Configure public access** if needed

### Generate API Credentials

1. **Go to R2 → Manage R2 API tokens**
2. **Create token** with these permissions:
   - Object Read
   - Object Write
   - Object Delete
3. **Note down**:
   - Access Key ID
   - Secret Access Key
   - Endpoint URL

### Configure Custom Domain (Optional)

1. **Go to R2 → Manage bucket → Settings**
2. **Add custom domain** (e.g., `cdn.yourdomain.com`)
3. **Update DNS** to point to Cloudflare

## 📺 Step 2: Set Up Cloudflare Stream

### Enable Stream

1. **Navigate to Stream** in Cloudflare Dashboard
2. **Accept pricing** and enable service
3. **Configure webhook** for upload notifications (optional)

### Generate API Token

1. **Go to My Profile → API Tokens**
2. **Create token** with these permissions:
   - Zone:Stream:Edit
   - Account:Cloudflare Stream:Edit
3. **Note down the API token**

## 🔑 Step 3: Configure Environment Variables

Add these to your `.env` file:

```env
# Cloudflare Account ID (found in dashboard sidebar)
CLOUDFLARE_ACCOUNT_ID="your-account-id-here"

# API Token with R2 and Stream permissions
CLOUDFLARE_API_TOKEN="your-api-token-here"

# R2 Bucket name
CLOUDFLARE_R2_BUCKET="recipe-images"

# R2 Access Keys (from R2 API tokens page)
CLOUDFLARE_ACCESS_KEY_ID="your-r2-access-key-id"
CLOUDFLARE_SECRET_ACCESS_KEY="your-r2-secret-access-key"

# Optional: Custom domain for R2 CDN
CLOUDFLARE_R2_CDN_URL="https://cdn.yourdomain.com"

# Stream webhook secret (for notifications)
CLOUDFLARE_STREAM_WEBHOOK_SECRET="your-webhook-secret"
```

## 🧪 Step 4: Test Your Setup

### Test R2 Connection

Create a test file `test-r2.js`:

```javascript
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

async function testUpload() {
  try {
    await client.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: 'test.txt',
      Body: 'Hello from Recipe Blog!',
      ContentType: 'text/plain',
    }));
    console.log('✅ R2 upload successful!');
  } catch (error) {
    console.error('❌ R2 upload failed:', error);
  }
}

testUpload();
```

### Test Stream Connection

Create a test file `test-stream.js`:

```javascript
async function testStream() {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
      }
    );
    
    if (response.ok) {
      console.log('✅ Stream API connection successful!');
    } else {
      console.error('❌ Stream API failed:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Stream connection failed:', error);
  }
}

testStream();
```

## 📁 File Organization Structure

Our setup organizes files like this:

```
R2 Bucket: recipe-images/
├── recipes/
│   ├── {recipeId}/
│   │   ├── images/
│   │   │   ├── 1702123456_hero.jpg
│   │   │   ├── 1702123789_step1.png
│   │   │   └── 1702124000_final.webp
│   │   └── videos/
│   │       └── 1702125000_cooking.mp4
└── temp/
    ├── images/
    └── videos/

Stream Videos:
- Each video gets a unique UID
- Automatic transcoding to multiple formats
- Thumbnail generation
- Adaptive bitrate streaming
```

## 🔄 How Upload Process Works

### For Images (R2):

1. **User uploads** through drag-and-drop interface
2. **Client sends** file to `/api/upload` endpoint
3. **Server validates** file type and size
4. **Uploads to R2** with organized key structure
5. **Returns public URL** for immediate use

### For Videos (Stream):

1. **User uploads** video file
2. **Server uploads** to Cloudflare Stream
3. **Stream processes** video (transcoding, thumbnails)
4. **Returns UID** and streaming URLs
5. **Webhook notifies** when processing complete (optional)

## 🎛️ Configuration Options

### File Type Validation

Currently supported formats:

**Images:**
- JPEG, PNG, GIF, WebP
- Max size: 10MB per file
- Auto-optimization via Cloudflare

**Videos:**
- MP4, MOV, AVI, WebM
- Max size: 100MB per file
- Auto-transcoding via Stream

### Size Limits

Adjust in `src/lib/media/cloudflare.ts`:

```typescript
export function getFileSizeLimit(mimeType: string): number {
  if (mimeType.startsWith('image/')) {
    return 10 * 1024 * 1024; // 10MB for images
  }
  if (mimeType.startsWith('video/')) {
    return 100 * 1024 * 1024; // 100MB for videos
  }
  return 1 * 1024 * 1024; // 1MB default
}
```

## 💰 Cost Estimation

### R2 Pricing (as of 2024):
- **Storage**: $0.015 per GB per month
- **Operations**: $4.50 per million requests
- **Egress**: FREE (major advantage over S3)

### Stream Pricing:
- **Storage**: $5 per 1,000 minutes stored
- **Delivery**: $1 per 1,000 minutes delivered
- **Processing**: Included

### Example Monthly Costs:

**Small Blog (1GB images, 10 hours video):**
- R2: ~$0.02
- Stream: ~$0.60
- **Total: ~$0.62/month**

**Medium Blog (10GB images, 100 hours video):**
- R2: ~$0.15
- Stream: ~$5.10
- **Total: ~$5.25/month**

## 🔒 Security Best Practices

### Access Control

1. **Limit API token scope** to only required permissions
2. **Use bucket policies** for fine-grained access
3. **Implement rate limiting** on upload endpoints
4. **Validate file types** server-side

### Content Security

1. **Scan uploads** for malware (optional)
2. **Generate unique keys** to prevent conflicts
3. **Set proper CORS** for cross-origin uploads
4. **Use HTTPS** for all requests

## 🐛 Troubleshooting

### Common Issues

**"Access Denied" errors:**
- Check API token permissions
- Verify account ID is correct
- Ensure bucket exists and is accessible

**"Invalid credentials" errors:**
- Double-check access key ID and secret
- Verify credentials are for correct account
- Try regenerating credentials

**Upload timeouts:**
- Check file size limits
- Verify network connectivity
- Consider chunked uploads for large files

**CORS errors:**
- Configure CORS settings in R2 bucket
- Check allowed origins and methods
- Verify request headers

### Debug Mode

Enable verbose logging:

```javascript
// In your upload handler
console.log('Upload attempt:', {
  fileName: file.name,
  fileSize: file.size,
  fileType: file.type,
  key: generatedKey,
});
```

## 🚀 Performance Optimization

### Image Optimization

1. **Use WebP format** when supported
2. **Implement lazy loading** for recipe galleries
3. **Generate thumbnails** for better performance
4. **Use Cloudflare Image Resizing** for responsive images

### Video Optimization

1. **Use Stream's adaptive bitrate** for best quality
2. **Implement progressive loading** for better UX
3. **Generate preview thumbnails** for video cards
4. **Consider video compression** before upload

## 📊 Monitoring and Analytics

### Track Usage

Monitor these metrics:

- **Upload success/failure rates**
- **File sizes and types**
- **Storage usage growth**
- **Bandwidth consumption**
- **Processing times**

### Cloudflare Analytics

Access built-in analytics:

1. **R2 Analytics**: Storage, requests, bandwidth
2. **Stream Analytics**: Views, minutes delivered
3. **Worker Analytics**: API endpoint performance

## 🎯 Next Steps

After setup:

1. **Test thoroughly** with different file types
2. **Monitor costs** in Cloudflare dashboard
3. **Set up alerts** for usage thresholds
4. **Implement backup strategy** if needed
5. **Consider CDN optimization** for global users

## 📞 Support Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Cloudflare Stream Documentation](https://developers.cloudflare.com/stream/)
- [AWS SDK for JavaScript (used with R2)](https://docs.aws.amazon.com/sdk-for-javascript/)
- [Recipe Blog GitHub Issues](your-repo-url)

Happy cooking with cloud storage! ☁️🍳