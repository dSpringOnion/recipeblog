import { createTransport } from 'nodemailer';

interface SendVerificationRequestParams {
  identifier: string;
  url: string;
  expires: Date;
  provider: {
    server: any;
    from: string;
  };
  token: string;
}

export async function sendVerificationRequest(params: SendVerificationRequestParams) {
  const { identifier, url, provider } = params;
  
  const { host } = new URL(url);
  const transport = createTransport(provider.server);
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Sign in to Recipe Blog</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: linear-gradient(135deg, #fef7ed 0%, #fdedd3 100%);
            margin: 0;
            padding: 20px;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(236, 118, 19, 0.1);
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #ec7613 0%, #22c55e 100%);
            color: white;
            text-align: center; 
            padding: 40px 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
          }
          .content {
            padding: 40px;
          }
          .button { 
            background: linear-gradient(135deg, #ec7613 0%, #dd5e09 100%);
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 12px; 
            display: inline-block; 
            margin: 20px 0;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s;
            box-shadow: 0 4px 12px rgba(236, 118, 19, 0.3);
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(236, 118, 19, 0.4);
          }
          .url-box {
            word-break: break-all; 
            background: #fef7ed; 
            padding: 16px; 
            border-radius: 8px;
            border: 2px solid #fbd7a5;
            font-family: monospace;
            font-size: 14px;
          }
          .footer { 
            margin-top: 30px; 
            padding-top: 30px;
            border-top: 1px solid #fbd7a5;
            font-size: 14px; 
            color: #953710;
            line-height: 1.5;
          }
          .recipe-icon {
            display: inline-block;
            font-size: 24px;
            margin-right: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1><span class="recipe-icon">🍳</span>Recipe Blog</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your culinary community awaits</p>
          </div>
          
          <div class="content">
            <h2 style="color: #953710; margin-bottom: 20px;">Welcome back, chef! 👨‍🍳</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #7a2f11;">
              Ready to share more delicious recipes? Click the button below to sign in to your Recipe Blog account and continue your culinary journey.
            </p>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${url}" class="button">🔑 Sign in to Recipe Blog</a>
            </p>
            
            <p style="color: #953710; font-weight: 500;">Having trouble with the button? Copy and paste this link:</p>
            <div class="url-box">
              ${url}
            </div>
            
            <div class="footer">
              <p><strong>🛡️ Security notice:</strong> If you didn't request this email, you can safely ignore it.</p>
              <p><strong>⏰ Expires:</strong> This magic link will expire in 24 hours for your security.</p>
              <p><strong>📧 Questions?</strong> Contact us if you need help with your account.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
  
  const text = `
🍳 Recipe Blog - Welcome back, chef!

Ready to share more delicious recipes? 

Sign in here: ${url}

Security Notice:
🛡️ If you didn't request this email, you can safely ignore it.
⏰ This magic link will expire in 24 hours for your security.
📧 Contact us if you need help with your account.

Happy cooking!
The Recipe Blog Team
  `;
  
  await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: 'Sign in to Recipe Blog',
    text,
    html,
  });
}