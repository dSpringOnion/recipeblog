import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).optional(),
  email: z.string().email('Please enter a valid email address').optional(),
});

export const favoriteToggleSchema = z.object({
  recipeId: z.string().uuid('Invalid recipe ID'),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type FavoriteToggleInput = z.infer<typeof favoriteToggleSchema>;