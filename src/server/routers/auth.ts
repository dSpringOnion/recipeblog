import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const authRouter = createTRPCRouter({
  getSession: publicProcedure
    .query(({ ctx }) => {
      return ctx.session;
    }),
    
  getUser: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              recipes: true,
              favorites: true
            }
          }
        }
      });
      
      return user;
    }),
});