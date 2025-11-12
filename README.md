# Recipe Blog

A modern, full-stack recipe sharing platform built with Next.js 14, tRPC, and PostgreSQL. Features include fuzzy search, ingredient scaling, video recipes, and user authentication.

## 🚀 Features

- **Public Recipe Catalog** - Browse recipes with fuzzy search by ingredient, cuisine, and dietary tags
- **Dynamic Ingredient Scaling** - Scale recipes for any number of servings with smart unit conversions
- **Video Recipes** - Hero video integration with Cloudflare Stream
- **User Authentication** - Passwordless magic link authentication
- **Favorites System** - Save and organize favorite recipes
- **Admin Dashboard** - Content moderation and analytics
- **Mobile Responsive** - Optimized for all devices
- **Dark Mode** - System-aware theme switching

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** + **shadcn/ui**
- **tRPC** for type-safe APIs

### Backend
- **PostgreSQL** with **Prisma ORM**
- **Auth.js** (NextAuth) for authentication
- **tRPC** server with validation

### Infrastructure
- **Railway** hosting with auto-scaling
- **Cloudflare Stream** for video hosting
- **Cloudflare R2** for image storage
- **GitHub Actions** for CI/CD

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- npm or yarn

## 🏃‍♂️ Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd recipe-blog
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Configure your `.env` file with:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/recipe_blog"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email (for magic links)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@recipeblog.com"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with demo data
npm run db:seed
```

### 4. Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

## 📝 Development Commands

### Database Operations
```bash
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema changes
npm run db:migrate      # Run migrations
npm run db:seed         # Seed demo data
npm run db:studio       # Open Prisma Studio
npm run db:reset        # Reset database
```

### Testing
```bash
npm test                # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run with coverage report
npm run test:e2e        # Run Playwright e2e tests
```

### Code Quality
```bash
npm run lint            # Run ESLint
npm run format          # Format with Prettier
npm run format:check    # Check formatting
npm run type-check      # TypeScript check
```

### Production
```bash
npm run build           # Build for production
npm start               # Start production server
```

## 🏗 Architecture

### Database Schema
- **Users** - Authentication and profiles
- **Recipes** - Core recipe data with MDX instructions
- **Ingredients** - Normalized ingredient database
- **RecipeIngredients** - Junction table with quantities and units
- **DietaryTags** - Vegetarian, vegan, gluten-free tags
- **UserFavorites** - User's saved recipes

### API Structure
- `auth.*` - Authentication endpoints
- `recipe.*` - Recipe CRUD and search
- `user.*` - User preferences and favorites

### Key Features

#### Ingredient Scaling Engine
```typescript
// Automatically scales ingredients for different serving sizes
const scaledIngredients = scaleIngredients(
  ingredients,
  baseServings: 4,
  targetServings: 6
);

// Smart unit conversions (g ↔ oz, ml ↔ cups, etc.)
const converted = convertUnit(500, 'g', 'oz'); // 17.6 oz
```

#### Fuzzy Search
```sql
-- PostgreSQL trigram search for ingredients and recipes
SELECT * FROM recipes 
WHERE title ILIKE '%choc%' 
  OR description ILIKE '%chocolate%'
ORDER BY similarity(title, 'chocolate') DESC;
```

## 🚀 Deployment

### Railway (Recommended)

1. **Connect Repository**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway up
   ```

2. **Environment Variables**
   Set these in Railway dashboard:
   - `DATABASE_URL` (provided by Railway PostgreSQL)
   - `NEXTAUTH_SECRET`
   - `EMAIL_SERVER_*` variables

3. **Custom Domain**
   - Add domain in Railway dashboard
   - Update `NEXTAUTH_URL`

### Alternative: Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build for production
docker build -t recipe-blog .
docker run -p 3000:3000 recipe-blog
```

## 📊 Cost Scaling Plan

| Tier | Users | Traffic | Infrastructure | Monthly Cost |
|------|-------|---------|---------------|--------------|
| **Hobby** | <1K | <10K req/day | Railway: 1 CPU, 1GB RAM<br/>PostgreSQL shared | $5-15 |
| **Growth** | 1K-10K | 10K-100K req/day | Railway: 2 CPU, 2GB RAM<br/>PostgreSQL dedicated | $25-50 |  
| **Scale** | 10K-100K | 100K-1M req/day | Multiple replicas<br/>Read replicas<br/>Redis caching | $100-200 |
| **Enterprise** | 100K+ | 1M+ req/day | Multi-region<br/>Global Redis<br/>Advanced monitoring | $500+ |

### Scaling Triggers
- **CPU > 70%** → Add replicas or upgrade tier
- **Memory > 80%** → Upgrade RAM or optimize queries  
- **DB connections > 80%** → Add read replicas
- **Response time > 500ms** → Add caching layers

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm test

# Test specific component
npm test -- IngredientsList

# Coverage report
npm run test:coverage
```

### E2E Tests (Playwright)
```bash
# Install browsers
npx playwright install

# Run e2e tests
npm run test:e2e

# Debug mode
npm run test:e2e -- --debug
```

## 🔒 Security

### Implemented Features
- **OWASP Top 10** protection
- **Helmet.js** security headers
- **Rate limiting** for API endpoints
- **Input validation** with Zod schemas
- **SQL injection** prevention with Prisma
- **CSRF protection** built into Next.js

### Security Headers
```javascript
// next.config.js
headers: [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
]
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm test`)
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Write tests for new features
- Use conventional commit messages
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the React framework
- [Prisma](https://prisma.io/) for database management
- [tRPC](https://trpc.io/) for type-safe APIs
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Railway](https://railway.app/) for hosting platform