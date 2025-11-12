import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { scaleIngredients } from '../../lib/scale';
import { TRPCError } from '@trpc/server';

const recipeCreateSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  instructions: z.string().min(1),
  prepTimeMinutes: z.number().int().positive().optional(),
  cookTimeMinutes: z.number().int().positive().optional(),
  baseServings: z.number().int().positive().default(4),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  cuisine: z.string().max(100).optional(),
  videoUrl: z.string().url().optional(),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    quantity: z.number().positive(),
    unit: z.string(),
    notes: z.string().optional(),
  })),
  dietaryTags: z.array(z.string()).optional(),
});

const recipeListSchema = z.object({
  search: z.string().optional(),
  cuisine: z.string().optional(),
  dietaryTags: z.array(z.string()).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  limit: z.number().int().positive().max(50).default(12),
  cursor: z.string().optional(),
});

export const recipeRouter = createTRPCRouter({
  // Public endpoints
  list: publicProcedure
    .input(recipeListSchema)
    .query(async ({ ctx, input }) => {
      const { search, cuisine, dietaryTags, difficulty, limit, cursor } = input;
      
      // Build dynamic where clause
      const where: Record<string, any> = { isPublished: true };
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { 
            ingredients: { 
              some: { 
                ingredient: { 
                  name: { contains: search, mode: 'insensitive' } 
                } 
              } 
            } 
          }
        ];
      }
      
      if (cuisine) where.cuisine = cuisine;
      if (difficulty) where.difficulty = difficulty;
      if (dietaryTags?.length) {
        where.dietaryTags = {
          some: { dietaryTag: { name: { in: dietaryTags } } }
        };
      }
      
      const recipes = await ctx.prisma.recipe.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, image: true } },
          ingredients: {
            include: { ingredient: true },
            orderBy: { orderIndex: 'asc' }
          },
          dietaryTags: { include: { dietaryTag: true } },
          _count: { select: { favorites: true } }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
      });
      
      const hasMore = recipes.length > limit;
      const items = hasMore ? recipes.slice(0, -1) : recipes;
      
      return {
        items,
        nextCursor: hasMore ? items[items.length - 1].id : undefined,
      };
    }),

  get: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const recipe = await ctx.prisma.recipe.findUnique({
        where: { slug: input.slug, isPublished: true },
        include: {
          author: { select: { id: true, name: true, image: true } },
          ingredients: {
            include: { ingredient: true },
            orderBy: { orderIndex: 'asc' }
          },
          dietaryTags: { include: { dietaryTag: true } },
          _count: { select: { favorites: true } }
        },
      });
      
      if (!recipe) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Recipe not found',
        });
      }

      return recipe;
    }),

  getScaled: publicProcedure
    .input(z.object({ 
      slug: z.string(),
      servings: z.number().int().positive()
    }))
    .query(async ({ ctx, input }) => {
      const recipe = await ctx.prisma.recipe.findUnique({
        where: { slug: input.slug, isPublished: true },
        include: {
          ingredients: {
            include: { ingredient: true },
            orderBy: { orderIndex: 'asc' }
          },
        },
      });
      
      if (!recipe) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Recipe not found',
        });
      }

      const ingredients = recipe.ingredients.map((ri) => ({
        id: ri.id,
        name: ri.ingredient.name,
        quantity: ri.quantity.toNumber(),
        unit: ri.unit,
        notes: ri.notes,
      }));
      
      const scaledIngredients = scaleIngredients(
        ingredients,
        recipe.baseServings,
        input.servings
      );
      
      return {
        ...recipe,
        scaledIngredients,
        targetServings: input.servings,
      };
    }),

  // Protected endpoints
  create: protectedProcedure
    .input(recipeCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const { ingredients, dietaryTags, ...recipeData } = input;
      
      const slug = generateSlug(input.title);
      
      const recipe = await ctx.prisma.recipe.create({
        data: {
          ...recipeData,
          slug,
          authorId: ctx.session.user.id,
          ingredients: {
            create: ingredients.map((ing, index) => ({
              quantity: ing.quantity,
              unit: ing.unit,
              notes: ing.notes,
              orderIndex: index,
              ingredient: {
                connectOrCreate: {
                  where: { name: ing.name.toLowerCase() },
                  create: { name: ing.name.toLowerCase() }
                }
              }
            }))
          },
          dietaryTags: dietaryTags?.length ? {
            create: dietaryTags.map(tagName => ({
              dietaryTag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName }
                }
              }
            }))
          } : undefined
        },
        include: {
          ingredients: { include: { ingredient: true } },
          dietaryTags: { include: { dietaryTag: true } }
        }
      });
      
      return recipe;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: recipeCreateSchema.partial()
    }))
    .mutation(async ({ ctx, input }) => {
      const recipe = await ctx.prisma.recipe.findUnique({
        where: { id: input.id },
        select: { authorId: true }
      });
      
      if (!recipe || recipe.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You do not have permission to update this recipe',
        });
      }
      
      // Implementation for updating recipe...
      return { success: true };
    }),
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}