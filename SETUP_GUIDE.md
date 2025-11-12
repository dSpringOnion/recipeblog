# 🚀 Recipe Blog Setup Guide

This guide will help you get the Recipe Blog application up and running locally and deploy it to production.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL 15+** ([Download](https://postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))
- **npm** or **yarn** (comes with Node.js)

## 🏗️ Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd recipe-blog
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the environment template:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/recipe_blog"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email (for magic links) - Gmail example
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="Recipe Blog <noreply@recipeblog.com>"

# Optional: Cloudflare (for production media storage)
# CLOUDFLARE_ACCOUNT_ID="your-account-id"
# CLOUDFLARE_API_TOKEN="your-api-token"
# CLOUDFLARE_R2_BUCKET="recipe-images"
```

### 4. Database Setup

Create a PostgreSQL database:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database and user
CREATE DATABASE recipe_blog;
CREATE USER recipe_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE recipe_blog TO recipe_user;

-- Exit psql
\q
```

Generate Prisma client and run migrations:

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed with demo data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

## 🧪 Testing

Run the test suite:

```bash
# Unit tests
npm test

# Watch mode during development
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests (requires Playwright)
npx playwright install
npm run test:e2e
```

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | TypeScript check |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset database |

## 🚀 Production Deployment

### Railway Deployment (Recommended)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize:**
   ```bash
   railway login
   railway init
   ```

3. **Add PostgreSQL Service:**
   ```bash
   railway add postgresql
   ```

4. **Set Environment Variables:**
   ```bash
   railway variables set NEXTAUTH_SECRET="your-production-secret"
   railway variables set EMAIL_SERVER_HOST="smtp.gmail.com"
   railway variables set EMAIL_SERVER_USER="your-email@gmail.com"
   railway variables set EMAIL_SERVER_PASSWORD="your-app-password"
   railway variables set EMAIL_FROM="Recipe Blog <noreply@recipeblog.com>"
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

6. **Run Database Migrations:**
   ```bash
   railway run npm run db:deploy
   railway run npm run db:seed
   ```

### Alternative: Docker Deployment

1. **Build the image:**
   ```bash
   docker build -t recipe-blog .
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

## 📧 Email Configuration

### Gmail Setup (Development)

1. Enable 2-Factor Authentication
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the app password in `EMAIL_SERVER_PASSWORD`

### Production Email Options

- **Resend** (recommended): Simple API, great deliverability
- **SendGrid**: Reliable, scalable
- **Amazon SES**: Cost-effective for high volume
- **Postmark**: Focus on transactional emails

## 🎯 Key Features to Test

### Authentication Flow
1. Visit `/signin`
2. Enter email address
3. Check email for magic link
4. Click link to sign in

### Recipe Features
1. Browse recipes at `/recipes`
2. View recipe with scaling at `/recipes/classic-chocolate-chip-cookies`
3. Try the serving slider
4. Check off ingredients
5. Use the instruction timers

### User Features (when signed in)
1. Add recipes to favorites
2. Visit profile at `/profile`
3. Create new recipe at `/recipes/create`

## 🔍 Troubleshooting

### Common Issues

**Database connection fails:**
```bash
# Check PostgreSQL is running
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Linux

# Test connection
psql -U recipe_user -d recipe_blog
```

**Email not sending:**
- Check EMAIL_SERVER_* variables
- Verify Gmail app password
- Check spam folder
- Test with a different email provider

**Build fails:**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

**Prisma issues:**
```bash
# Reset and regenerate
npm run db:reset
npm run db:generate
npm run db:migrate
```

### Getting Help

1. Check the [Next.js docs](https://nextjs.org/docs)
2. Review [tRPC documentation](https://trpc.io/docs)
3. Browse [Prisma guides](https://www.prisma.io/docs/)
4. Search [GitHub Issues](https://github.com/your-repo/issues)

## 📊 Performance Monitoring

### Lighthouse Scores (Target: >95)
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

### Database Performance
```bash
# Open Prisma Studio
npm run db:studio

# Check query performance in logs
```

## 🔐 Security Checklist

- [ ] Environment variables properly set
- [ ] Database credentials secured
- [ ] NEXTAUTH_SECRET is cryptographically random
- [ ] Email credentials use app passwords
- [ ] Rate limiting configured
- [ ] HTTPS enabled in production
- [ ] Security headers configured

## 📈 Scaling Considerations

### Performance Optimizations
- Enable Redis for session storage
- Add database read replicas
- Implement CDN for static assets
- Use database connection pooling

### Infrastructure Scaling
- Add horizontal scaling (multiple instances)
- Implement database sharding
- Use microservices for complex features
- Add monitoring and alerting

## 🎉 You're Ready!

Your Recipe Blog application should now be running successfully. Start by:

1. Creating your first recipe
2. Customizing the brand colors in `tailwind.config.ts`
3. Adding your own featured recipes
4. Setting up analytics and monitoring

Happy cooking! 🍳