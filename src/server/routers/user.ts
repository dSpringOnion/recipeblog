import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  toggleFavorite: protectedProcedure
    .input(z.object({ recipeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.userFavorite.findUnique({
        where: {
          userId_recipeId: {
            userId: ctx.session.user.id,
            recipeId: input.recipeId
          }
        }
      });
      
      if (existing) {
        await ctx.prisma.userFavorite.delete({
          where: { userId_recipeId: {
            userId: ctx.session.user.id,
            recipeId: input.recipeId
          }}
        });
        return { favorited: false };
      } else {
        await ctx.prisma.userFavorite.create({
          data: {
            userId: ctx.session.user.id,
            recipeId: input.recipeId
          }
        });
        return { favorited: true };
      }
    }),
    
  getFavorites: protectedProcedure
    .query(async ({ ctx }) => {
      const favorites = await ctx.prisma.userFavorite.findMany({
        where: { userId: ctx.session.user.id },
        include: {
          recipe: {
            include: {
              author: { select: { name: true, image: true } },
              _count: { select: { favorites: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return favorites.map((f) => f.recipe);
    }),
});