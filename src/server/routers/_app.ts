import { createTRPCRouter } from '../trpc';
import { authRouter } from './auth';
import { recipeRouter } from './recipe';
import { userRouter } from './user';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  recipe: recipeRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;