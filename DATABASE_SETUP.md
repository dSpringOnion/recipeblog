# 🗄️ Production Database Setup Guide

This guide will help you set up a production-ready PostgreSQL database for your Recipe Blog on Railway.

## 🚀 Quick Setup with Railway (Recommended)

Railway offers managed PostgreSQL with automatic backups, scaling, and monitoring.

### Step 1: Create Railway Account

1. **Visit [Railway.app](https://railway.app)**
2. **Sign up** with GitHub account
3. **Verify your account** and add payment method

### Step 2: Create PostgreSQL Database

1. **Create new project** in Railway dashboard
2. **Add PostgreSQL service**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will provision your database automatically
3. **Get connection details**:
   - Go to your PostgreSQL service
   - Copy the "Database URL" from the Connect tab

### Step 3: Configure Environment Variables

Add to your `.env.production`:

```env
# Production Database (Railway)
DATABASE_URL="postgresql://postgres:password@host:port/database"

# Or use Railway's formatted URL
DATABASE_URL="postgresql://postgres:PASSWORD@HOST:PORT/railway"
```

### Step 4: Run Database Migrations

```bash
# Generate Prisma client
npm run db:generate

# Deploy migrations to production
npm run db:deploy

# Seed initial data (optional)
npm run db:seed
```

## 🔧 Alternative Database Providers

### Supabase (Free Tier Available)

1. **Create account** at [supabase.com](https://supabase.com)
2. **Create new project**
3. **Copy database URL** from Settings → Database
4. **Enable Row Level Security** if needed

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres"
```

### Neon (Serverless PostgreSQL)

1. **Create account** at [neon.tech](https://neon.tech)
2. **Create database**
3. **Copy connection string**

```env
DATABASE_URL="postgresql://[user]:[password]@[host]/[dbname]?sslmode=require"
```

### AWS RDS

1. **Create RDS PostgreSQL instance**
2. **Configure security groups**
3. **Note connection details**

```env
DATABASE_URL="postgresql://username:password@rds-endpoint:5432/dbname"
```

## 📊 Database Configuration

### Prisma Schema Optimizations

Update `prisma/schema.prisma` for production:

```prisma
generator client {
  provider = "prisma-client-js"
  // Enable connection pooling
  previewFeatures = ["jsonProtocol"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Enable connection pooling
  directUrl = env("DIRECT_URL")
}
```

### Connection Pooling

For production, use connection pooling:

```env
# Direct connection for migrations
DIRECT_URL="postgresql://postgres:password@host:port/database"

# Pooled connection for application
DATABASE_URL="postgresql://postgres:password@host:port/database?pgbouncer=true"
```

## 🔐 Security Best Practices

### Environment Variables

Never commit these to version control:

```env
# ❌ NEVER commit these
DATABASE_URL="postgresql://..."
DATABASE_PASSWORD="..."

# ✅ Use placeholder values in .env.example
DATABASE_URL="postgresql://username:password@localhost:5432/recipe_blog"
```

### Database Security

1. **Use strong passwords** (20+ characters)
2. **Enable SSL** connections
3. **Limit connection IPs** if possible
4. **Regular backups** (most providers auto-backup)
5. **Monitor access logs**

### User Permissions

Create application-specific user:

```sql
-- Create application user
CREATE USER recipe_app WITH PASSWORD 'strong_password_here';

-- Grant necessary permissions
GRANT CONNECT ON DATABASE recipe_blog TO recipe_app;
GRANT USAGE ON SCHEMA public TO recipe_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO recipe_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO recipe_app;

-- For new tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO recipe_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO recipe_app;
```

## 📈 Performance Optimization

### Database Indexes

Add these indexes for better performance:

```sql
-- Recipe search optimization
CREATE INDEX idx_recipes_title_gin ON "Recipe" USING gin(to_tsvector('english', title));
CREATE INDEX idx_recipes_published ON "Recipe" (is_published);
CREATE INDEX idx_recipes_created_at ON "Recipe" (created_at DESC);

-- User lookups
CREATE INDEX idx_users_email ON "User" (email);

-- Recipe ingredients
CREATE INDEX idx_recipe_ingredients_recipe_id ON "RecipeIngredient" (recipe_id);
CREATE INDEX idx_recipe_ingredients_ingredient_id ON "RecipeIngredient" (ingredient_id);

-- Favorites
CREATE INDEX idx_favorites_user_recipe ON "UserFavorite" (user_id, recipe_id);
```

### Query Optimization

Use Prisma's query optimization features:

```typescript
// ✅ Select only needed fields
const recipes = await prisma.recipe.findMany({
  select: {
    id: true,
    title: true,
    imageUrls: true,
    author: {
      select: {
        name: true,
        image: true
      }
    }
  }
});

// ✅ Use pagination
const recipes = await prisma.recipe.findMany({
  skip: page * limit,
  take: limit,
  orderBy: { createdAt: 'desc' }
});

// ✅ Use transactions for related operations
await prisma.$transaction([
  prisma.recipe.create({ data: recipeData }),
  prisma.recipeIngredient.createMany({ data: ingredientsData })
]);
```

## 🚀 Migration Strategy

### Development to Production

1. **Test migrations locally**:
```bash
# Reset and test full migration
npm run db:reset
npm run db:migrate
npm run db:seed
```

2. **Deploy migrations**:
```bash
# Generate Prisma client
npm run db:generate

# Apply migrations (doesn't reset data)
npm run db:deploy
```

3. **Verify deployment**:
```bash
# Check database connection
npm run db:studio
```

### Zero-Downtime Deployments

For production apps with users:

1. **Backward-compatible migrations** first
2. **Deploy application updates**
3. **Remove old columns** in subsequent migration

Example safe migration:
```prisma
// Step 1: Add new column (safe)
model Recipe {
  // ... existing fields
  newField String? // Optional field
}

// Step 2: Deploy app that handles both old and new
// Step 3: Populate new field
// Step 4: Make field required (if needed)
// Step 5: Remove old fields (if any)
```

## 📋 Database Maintenance

### Regular Tasks

1. **Monitor performance**:
   - Check slow queries
   - Monitor connection count
   - Review storage usage

2. **Backup verification**:
   - Test backup restoration
   - Verify backup schedules
   - Document recovery procedures

3. **Update statistics**:
```sql
-- Update table statistics for better query planning
ANALYZE;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Monitoring Queries

Monitor your database performance:

```sql
-- Find slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;

-- Check connection count
SELECT count(*) FROM pg_stat_activity;

-- Database size
SELECT pg_size_pretty(pg_database_size('recipe_blog'));
```

## 🛠️ Development vs Production

### Development Database

For local development, use Docker:

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: recipe_blog_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Environment-Specific Configs

```bash
# Development
DATABASE_URL="postgresql://postgres:password@localhost:5432/recipe_blog_dev"

# Testing
DATABASE_URL="postgresql://postgres:password@localhost:5432/recipe_blog_test"

# Production
DATABASE_URL="postgresql://user:password@prod-host:5432/recipe_blog"
```

## 🚨 Troubleshooting

### Common Issues

**Connection timeout:**
```bash
# Check if database is accessible
pg_isready -h hostname -p port

# Test connection
psql "postgresql://user:password@host:port/database"
```

**Migration failed:**
```bash
# Check migration status
npx prisma migrate status

# Reset if safe (dev only)
npx prisma migrate reset

# Force migration (use carefully)
npx prisma db push --force-reset
```

**Performance issues:**
```sql
-- Check for missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE tablename = 'Recipe';

-- Check for table bloat
SELECT schemaname, tablename, 
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public';
```

### Recovery Procedures

**Restore from backup:**
```bash
# Railway provides automatic backups
# Check Railway dashboard for backup restoration

# Manual backup (if needed)
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql
```

## 📊 Cost Optimization

### Railway Pricing

- **Hobby Plan**: $5/month (suitable for small apps)
- **Pro Plan**: Usage-based (scales with traffic)
- **Database**: ~$5-15/month depending on size

### Optimization Tips

1. **Use connection pooling** to reduce connection overhead
2. **Archive old data** to separate tables
3. **Optimize queries** to reduce compute time
4. **Monitor storage growth** and clean up unused data

## 🎯 Next Steps

After database setup:

1. **Test all database operations** in production
2. **Set up monitoring** and alerts
3. **Configure automated backups** (usually included)
4. **Document recovery procedures**
5. **Plan for scaling** as your app grows

## 📞 Support Resources

- [Railway PostgreSQL Docs](https://docs.railway.app/databases/postgresql)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Performance Guide](https://www.postgresql.org/docs/current/performance-tips.html)
- [Recipe Blog GitHub Issues](your-repo-url)

Happy cooking with production data! 🍳📊