import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required').max(255),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  notes: z.string().optional(),
});

export const recipeCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  instructions: z.string().min(1, 'Instructions are required'),
  prepTimeMinutes: z.number().int().positive().optional(),
  cookTimeMinutes: z.number().int().positive().optional(),
  baseServings: z.number().int().positive().default(4),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  cuisine: z.string().max(100).optional(),
  videoUrl: z.string().url().optional(),
  ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient is required'),
  dietaryTags: z.array(z.string()).optional(),
});

export const recipeUpdateSchema = recipeCreateSchema.partial();

export const recipeListSchema = z.object({
  search: z.string().optional(),
  cuisine: z.string().optional(),
  dietaryTags: z.array(z.string()).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  limit: z.number().int().positive().max(50).default(12),
  cursor: z.string().optional(),
});

export const recipeScaleSchema = z.object({
  slug: z.string(),
  servings: z.number().int().positive().min(1).max(20),
});

export type RecipeCreateInput = z.infer<typeof recipeCreateSchema>;
export type RecipeUpdateInput = z.infer<typeof recipeUpdateSchema>;
export type RecipeListInput = z.infer<typeof recipeListSchema>;
export type RecipeScaleInput = z.infer<typeof recipeScaleSchema>;
export type IngredientInput = z.infer<typeof ingredientSchema>;

// Additional types for UI components
export interface ParsedIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface UploadedFile {
  url: string;
  type: 'image' | 'video';
  playback?: string;
}