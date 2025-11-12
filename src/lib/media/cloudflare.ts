import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Cloudflare R2 configuration
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET!;
const CDN_URL = process.env.CLOUDFLARE_R2_CDN_URL; // Optional: Custom domain for R2

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  type: string;
}

/**
 * Upload a file to Cloudflare R2
 */
export async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string,
  metadata?: Record<string, string>
): Promise<UploadResult> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: metadata,
      // Make publicly accessible
      ACL: 'public-read',
    });

    await r2Client.send(command);

    // Generate public URL
    const publicUrl = CDN_URL 
      ? `${CDN_URL}/${key}`
      : `https://${BUCKET_NAME}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

    return {
      url: publicUrl,
      key,
      size: buffer.length,
      type: contentType,
    };
  } catch (error) {
    console.error('Failed to upload to R2:', error);
    throw new Error(`Upload failed: ${error}`);
  }
}

/**
 * Delete a file from Cloudflare R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error('Failed to delete from R2:', error);
    throw new Error(`Delete failed: ${error}`);
  }
}

/**
 * Generate a presigned URL for secure uploads
 */
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      ACL: 'public-read',
    });

    return await getSignedUrl(r2Client, command, { expiresIn });
  } catch (error) {
    console.error('Failed to generate presigned URL:', error);
    throw new Error(`Presigned URL generation failed: ${error}`);
  }
}

/**
 * Generate optimized file key for recipes
 */
export function generateRecipeMediaKey(
  recipeId: string,
  fileName: string,
  type: 'image' | 'video' = 'image'
): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `recipes/${recipeId}/${type}s/${timestamp}_${sanitizedFileName}`;
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/mov': 'mov',
    'video/avi': 'avi',
    'video/webm': 'webm',
  };
  
  return mimeToExt[mimeType] || 'bin';
}

/**
 * Validate file type for recipe media
 */
export function validateRecipeMediaType(mimeType: string): boolean {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/mov',
    'video/avi',
    'video/webm',
  ];
  
  return allowedTypes.includes(mimeType);
}

/**
 * Get file size limits for different media types
 */
export function getFileSizeLimit(mimeType: string): number {
  if (mimeType.startsWith('image/')) {
    return 10 * 1024 * 1024; // 10MB for images
  }
  if (mimeType.startsWith('video/')) {
    return 100 * 1024 * 1024; // 100MB for videos
  }
  return 1 * 1024 * 1024; // 1MB default
}

/**
 * Cloudflare Stream integration for video processing
 */
export async function uploadToStream(
  buffer: Buffer,
  metadata?: Record<string, string>
): Promise<{ uid: string; preview: string; playback: string }> {
  try {
    const formData = new FormData();
    formData.append('file', new Blob([buffer]));
    
    if (metadata) {
      formData.append('meta', JSON.stringify(metadata));
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Stream upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      uid: data.result.uid,
      preview: `https://videodelivery.net/${data.result.uid}/thumbnails/thumbnail.jpg`,
      playback: `https://videodelivery.net/${data.result.uid}/manifest/video.m3u8`,
    };
  } catch (error) {
    console.error('Failed to upload to Stream:', error);
    throw new Error(`Stream upload failed: ${error}`);
  }
}