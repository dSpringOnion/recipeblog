# 📧 Email Service Setup Guide

This guide will help you configure email services for your Recipe Blog, enabling magic link authentication and user notifications.

## 🚀 Quick Setup Options

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Add to your `.env` file**:

```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-gmail@gmail.com
EMAIL_SERVER_PASSWORD=your-16-char-app-password
EMAIL_FROM=noreply@yourdomain.com
```

### Option 2: SendGrid (Recommended for Production)

1. **Create SendGrid Account** at [sendgrid.com](https://sendgrid.com)
2. **Generate API Key** in Settings → API Keys
3. **Add to your `.env` file**:

```env
EMAIL_SERVER_URL=smtps://apikey:YOUR_SENDGRID_API_KEY@smtp.sendgrid.net:465
EMAIL_FROM=noreply@yourdomain.com
```

### Option 3: Resend (Modern Alternative)

1. **Create Resend Account** at [resend.com](https://resend.com)
2. **Generate API Key** in Settings
3. **Add to your `.env` file**:

```env
EMAIL_SERVER_URL=smtps://resend:YOUR_RESEND_API_KEY@smtp.resend.com:465
EMAIL_FROM=noreply@yourdomain.com
```

## 🔧 Configuration Details

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_SERVER_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `EMAIL_SERVER_PORT` | SMTP server port | `587` (TLS) or `465` (SSL) |
| `EMAIL_SERVER_USER` | SMTP username | `your-email@gmail.com` |
| `EMAIL_SERVER_PASSWORD` | SMTP password/token | `your-app-password` |
| `EMAIL_SERVER_URL` | Complete SMTP URL | `smtps://user:pass@host:port` |
| `EMAIL_FROM` | Sender address | `noreply@yourdomain.com` |

### URL Format Options

You can use either individual variables OR a complete URL:

**Individual Variables:**
```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=user@gmail.com
EMAIL_SERVER_PASSWORD=app-password
```

**Complete URL:**
```env
EMAIL_SERVER_URL=smtps://user%40gmail.com:app-password@smtp.gmail.com:465
```

## ✨ Email Template Features

Our email template includes:

- **🎨 Recipe Blog Branding** - Warm orange and green colors
- **📱 Mobile Responsive** - Looks great on all devices  
- **🔒 Security Indicators** - Clear expiration and security notices
- **🍳 Food-Themed Design** - Cooking emojis and culinary language
- **⚡ Call-to-Action Button** - Prominent sign-in button
- **🔗 Fallback Link** - Copy-paste option if button doesn't work

## 🧪 Testing Your Setup

### 1. Test Email Configuration

Create a test file `test-email.js`:

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

transporter.sendMail({
  from: 'noreply@yourdomain.com',
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'If you receive this, your email setup works!'
}).then(() => {
  console.log('✅ Email sent successfully!');
}).catch(err => {
  console.error('❌ Email failed:', err);
});
```

### 2. Test Magic Link Authentication

1. Start your development server: `npm run dev`
2. Navigate to `/signin`
3. Enter your email address
4. Check your inbox for the magic link
5. Click the link to sign in

## 🏗️ Production Considerations

### Domain Setup

For production, you'll want to:

1. **Own your domain** for the `EMAIL_FROM` address
2. **Set up SPF/DKIM records** to improve deliverability
3. **Use a dedicated email service** (SendGrid, Resend, etc.)

### Security Best Practices

- ✅ Use app passwords instead of account passwords
- ✅ Store credentials in environment variables
- ✅ Use HTTPS for your callback URLs
- ✅ Configure proper CORS settings
- ✅ Monitor email delivery rates

### Scaling Considerations

- **Rate Limiting**: Most providers limit emails per hour
- **Delivery Monitoring**: Track bounce rates and delivery
- **Template Management**: Consider using provider templates
- **Analytics**: Monitor sign-in success rates

## 📊 Email Service Comparison

| Provider | Free Tier | Pros | Cons |
|----------|-----------|------|------|
| **Gmail** | 25K/day | Easy setup, reliable | Google dependency |
| **SendGrid** | 100/day | Excellent deliverability | Complex for simple use |
| **Resend** | 3K/month | Developer-friendly, modern | Newer service |
| **AWS SES** | 200/day | Cheap at scale | Complex setup |
| **Mailgun** | 10K/month | Good APIs | Limited free tier |

## 🐛 Troubleshooting

### Common Issues

**"Invalid login" with Gmail:**
- Ensure 2FA is enabled
- Use app password, not account password
- Check if "Less secure apps" is needed (not recommended)

**Emails going to spam:**
- Verify your `EMAIL_FROM` domain
- Set up SPF/DKIM records
- Use a proper `EMAIL_FROM` address

**Connection timeout:**
- Check firewall settings
- Verify port numbers (587 for TLS, 465 for SSL)
- Try different email providers

**Magic links not working:**
- Verify `NEXTAUTH_URL` matches your domain
- Check link expiration (24 hours default)
- Ensure proper SSL/HTTPS setup

### Debug Mode

Enable debug logging in NextAuth:

```javascript
// pages/api/auth/[...nextauth].js
export default NextAuth({
  debug: process.env.NODE_ENV === 'development',
  // ... other config
});
```

## 🎯 Next Steps

After setting up email:

1. **Test thoroughly** in development
2. **Configure production domain** 
3. **Set up monitoring** for email delivery
4. **Consider email templates** for other notifications
5. **Monitor user feedback** on email experience

## 📞 Support

Need help? Check these resources:

- [NextAuth.js Email Provider Docs](https://next-auth.js.org/providers/email)
- [Nodemailer Documentation](https://nodemailer.com/about/)
- [SendGrid Integration Guide](https://docs.sendgrid.com/)
- [Gmail App Password Setup](https://support.google.com/accounts/answer/185833)

Happy cooking! 🍳✨