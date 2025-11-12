# Directory Structure - Recipe Blog

## ✅ Next.js 14 Best Practices Implementation

This project follows the **latest Next.js 14 App Router best practices** with proper organization for scalability and maintainability.

```
recipeBlog/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD pipeline
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── schema.sql                 # Raw PostgreSQL DDL
│   └── seed.ts                    # Database seeding
├── public/                        # Static assets
├── src/                          # 📁 Source code (Next.js 14 standard)
│   ├── app/                      # 📁 App Router (Next.js 14)
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts   # Auth.js API routes
│   │   │   └── trpc/
│   │   │       └── [trpc]/
│   │   │           └── route.ts   # tRPC API handler
│   │   ├── (auth)/               # 📁 Route group - Auth pages
│   │   │   ├── layout.tsx        # Auth-specific layout
│   │   │   ├── signin/
│   │   │   │   └── page.tsx
│   │   │   └── verify-email/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/          # 📁 Route group - Protected pages
│   │   │   ├── layout.tsx        # Dashboard layout with auth
│   │   │   ├── admin/
│   │   │   │   └── page.tsx
│   │   │   └── profile/
│   │   │       ├── page.tsx
│   │   │       └── favorites/
│   │   │           └── page.tsx
│   │   ├── (public)/             # 📁 Route group - Public pages
│   │   │   ├── layout.tsx        # Public layout with navbar
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── recipes/
│   │   │   │   ├── page.tsx      # Recipe listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Individual recipe
│   │   │   └── search/
│   │   │       └── page.tsx
│   │   ├── globals.css → moved to src/styles/
│   │   ├── layout.tsx            # Root layout
│   │   └── not-found.tsx
│   ├── components/               # 📁 React Components
│   │   ├── features/            # 📁 Feature-specific components
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── FeaturedRecipes.tsx
│   │   │   │   └── SearchSection.tsx
│   │   │   ├── recipe/
│   │   │   │   ├── RecipeHero.tsx
│   │   │   │   ├── IngredientsList.tsx
│   │   │   │   ├── ServingSlider.tsx
│   │   │   │   ├── InstructionsSteps.tsx
│   │   │   │   ├── RecipeInfo.tsx
│   │   │   │   └── FavoriteButton.tsx
│   │   │   └── auth/
│   │   │       ├── SignInForm.tsx
│   │   │       └── SignOutButton.tsx
│   │   ├── layout/              # 📁 Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── DashboardNavbar.tsx
│   │   │   └── DashboardSidebar.tsx
│   │   ├── forms/               # 📁 Form components
│   │   │   ├── RecipeForm.tsx
│   │   │   └── SearchForm.tsx
│   │   ├── providers/           # 📁 Context providers
│   │   │   ├── TRPCProvider.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   └── ThemeProvider.tsx
│   │   └── ui/                  # 📁 shadcn/ui components
│   │       ├── button.tsx
│   │       ├── slider.tsx
│   │       ├── badge.tsx
│   │       ├── card.tsx
│   │       └── input.tsx
│   ├── hooks/                   # 📁 Custom React hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useRecipeSearch.ts
│   ├── lib/                     # 📁 Utility libraries
│   │   ├── auth/
│   │   │   ├── config.ts        # Auth.js configuration
│   │   │   └── email.ts         # Email templates
│   │   ├── trpc/
│   │   │   ├── server.ts        # Server-side tRPC client
│   │   │   └── client.ts        # Client-side tRPC setup
│   │   ├── utils/
│   │   │   ├── cn.ts            # Tailwind class merging
│   │   │   └── formatters.ts    # Utility functions
│   │   ├── validations/
│   │   │   ├── recipe.ts        # Zod schemas for recipes
│   │   │   └── auth.ts          # Zod schemas for auth
│   │   ├── prisma.ts            # Prisma client singleton
│   │   ├── scale.ts             # Ingredient scaling engine
│   │   └── scale.test.ts        # Unit tests
│   ├── server/                  # 📁 tRPC server code
│   │   ├── routers/
│   │   │   ├── _app.ts          # Main router
│   │   │   ├── auth.ts          # Auth routes
│   │   │   ├── recipe.ts        # Recipe routes
│   │   │   └── user.ts          # User routes
│   │   └── trpc.ts              # tRPC setup & middleware
│   ├── styles/                  # 📁 Global styles
│   │   └── globals.css          # Tailwind + custom CSS
│   └── types/                   # 📁 TypeScript definitions
│       ├── next-auth.d.ts       # NextAuth type extensions
│       └── globals.d.ts         # Global type definitions
├── .env.example                 # Environment variables template
├── .eslintrc.json              # ESLint configuration
├── .gitignore
├── docker-compose.yml          # Local development setup
├── Dockerfile                  # Production container
├── jest.config.js              # Testing configuration
├── jest.setup.js               # Test setup
├── next.config.js              # Next.js configuration
├── package.json
├── postcss.config.js           # PostCSS for Tailwind
├── prettier.config.js          # Code formatting
├── railway.json                # Railway deployment config
├── README.md                   # Project documentation
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🎯 Key Improvements Made

### 1. **Next.js 14 App Router Best Practices**
- ✅ `src/` directory structure (recommended for larger projects)
- ✅ Route groups `(auth)`, `(dashboard)`, `(public)` for layout organization
- ✅ Proper layout inheritance with dedicated layout files
- ✅ Server and client components properly separated

### 2. **Component Organization**
- ✅ `features/` - Business logic components grouped by feature
- ✅ `layout/` - Reusable layout components
- ✅ `forms/` - Form-specific components
- ✅ `ui/` - Design system components (shadcn/ui)
- ✅ `providers/` - React context providers

### 3. **Library Structure**
- ✅ `lib/auth/` - Authentication utilities
- ✅ `lib/trpc/` - API client/server setup
- ✅ `lib/utils/` - Generic utilities
- ✅ `lib/validations/` - Zod schemas organized by domain

### 4. **Type Safety**
- ✅ `src/types/` - Custom TypeScript definitions
- ✅ Proper module augmentation for NextAuth
- ✅ Updated import paths in tsconfig.json

### 5. **Testing Structure**
- ✅ Co-located test files with source code
- ✅ Updated Jest configuration for src structure
- ✅ Proper module mapping for imports

## 🔧 Configuration Updates

### Import Path Mapping
```json
// tsconfig.json
{
  "paths": {
    "@/*": ["./src/*"]  // Updated to point to src/
  }
}
```

### Jest Configuration
```javascript
// jest.config.js
moduleNameMapping: {
  '^@/components/(.*)$': '<rootDir>/src/components/$1',
  '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
  // ... all paths updated
}
```

## 🚀 Benefits of This Structure

1. **Scalability** - Clear separation of concerns
2. **Maintainability** - Logical grouping of related files
3. **Developer Experience** - Easy to navigate and understand
4. **Next.js Compliance** - Follows official recommendations
5. **Industry Standards** - Matches large-scale React project patterns

This structure supports growth from MVP to enterprise-scale applications while maintaining code organization and developer productivity.