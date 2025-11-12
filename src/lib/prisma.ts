import { PrismaClient } from '@prisma/client'
import { withOptimize } from '@prisma/extension-optimize'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: any
}

const createPrismaClient = () => {
  const client = new PrismaClient()

  // Only add extensions if API keys are available
  if (process.env.OPTIMIZE_API_KEY && process.env.ACCELERATE_DATABASE_URL) {
    return client
      .$extends(
        withOptimize({
          apiKey: process.env.OPTIMIZE_API_KEY,
          enable: process.env.NODE_ENV === 'development',
        })
      )
      .$extends(withAccelerate())
  }

  if (process.env.ACCELERATE_DATABASE_URL) {
    return client.$extends(withAccelerate())
  }

  // Fallback to basic Prisma client without extensions
  return client
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma