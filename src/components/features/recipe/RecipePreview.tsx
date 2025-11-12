'use client';

import Image from 'next/image';
import { Clock, Users, ChefHat, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDuration } from '@/lib/utils';
import { formatIngredientForDisplay } from '@/lib/ingredient-parser';

interface FileWithPreview extends File {
  preview?: string;
}

interface RecipePreviewProps {
  recipe: {
    title?: string;
    description?: string;
    instructions?: string;
    prepTimeMinutes?: number;
    cookTimeMinutes?: number;
    baseServings?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    cuisine?: string;
    ingredients?: Array<{
      quantity: number;
      unit: string;
      name: string;
      notes?: string;
    }>;
    dietaryTags?: string[];
    author: {
      name: string;
      image?: string | null;
    };
    _count: {
      favorites: number;
    };
  };
  media?: FileWithPreview[];
}

const difficultyConfig = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  hard: { label: 'Hard', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
};

export function RecipePreview({ recipe, media = [] }: RecipePreviewProps) {
  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);
  const heroImage = media.find(file => file.type.startsWith('image/'));
  const heroVideo = media.find(file => file.type.startsWith('video/'));

  const renderInstructions = (text: string) => {
    if (!text) return null;
    
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^## (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-900 dark:text-white">$1</h3>')
      .replace(/^(\d+)\. (.*$)/gm, '<div class="flex items-start gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"><span class="bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">$1</span><span class="text-gray-700 dark:text-gray-300">$2</span></div>')
      .replace(/^- (.*$)/gm, '<div class="flex items-start gap-3 mb-2"><span class="text-gray-400 mt-1.5 flex-shrink-0">•</span><span class="text-gray-700 dark:text-gray-300">$1</span></div>')
      .replace(/⏲️\s*\*\*(.*?)\*\*/g, '<span class="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-md text-sm font-medium"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z"/></svg>$1</span>')
      .replace(/🌡️\s*\*\*(.*?)\*\*/g, '<span class="inline-flex items-center gap-1 bg-orange-50 dark:bg-orange-900 text-orange-700 dark:text-orange-200 px-2 py-1 rounded-md text-sm font-medium"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v6a6 6 0 1012 0V8a6 6 0 00-6-6z"/></svg>$1</span>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="relative aspect-video bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl overflow-hidden mb-8">
        {heroImage && (
          <Image
            src={heroImage.preview || URL.createObjectURL(heroImage)}
            alt={recipe.title || 'Recipe preview'}
            fill
            className="object-cover opacity-80"
          />
        )}
        
        {heroVideo && !heroImage && (
          <video
            src={URL.createObjectURL(heroVideo)}
            className="w-full h-full object-cover opacity-80"
            muted
            loop
            autoPlay
          />
        )}
        
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {recipe.title || 'Untitled Recipe'}
          </h1>
          {recipe.description && (
            <p className="text-lg text-gray-200 mb-4">{recipe.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              {recipe.author.image && (
                <Image
                  src={recipe.author.image}
                  alt={recipe.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span>by {recipe.author.name}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {recipe._count.favorites}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recipe Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recipe Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recipe Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Timing */}
              <div className="grid grid-cols-2 gap-4">
                {recipe.prepTimeMinutes && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Prep</p>
                      <p className="font-medium">{formatDuration(recipe.prepTimeMinutes)}</p>
                    </div>
                  </div>
                )}
                
                {recipe.cookTimeMinutes && (
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Cook</p>
                      <p className="font-medium">{formatDuration(recipe.cookTimeMinutes)}</p>
                    </div>
                  </div>
                )}
              </div>

              {totalTime > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Total Time</p>
                      <p className="font-medium">{formatDuration(totalTime)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Servings */}
              {recipe.baseServings && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Serves</p>
                    <p className="font-medium">{recipe.baseServings} people</p>
                  </div>
                </div>
              )}

              {/* Difficulty */}
              {recipe.difficulty && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Difficulty:</span>
                  <Badge 
                    variant="outline" 
                    className={difficultyConfig[recipe.difficulty].color}
                  >
                    {difficultyConfig[recipe.difficulty].label}
                  </Badge>
                </div>
              )}

              {/* Cuisine */}
              {recipe.cuisine && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Cuisine:</span>
                  <Badge variant="outline">{recipe.cuisine}</Badge>
                </div>
              )}

              {/* Dietary Tags */}
              {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Dietary Info:</p>
                  <div className="flex flex-wrap gap-1">
                    {recipe.dietaryTags.map((tag) => (
                      <Badge 
                        key={tag}
                        variant="outline"
                        className="text-xs capitalize"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-sm">
                      {formatIngredientForDisplay(ingredient)}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Instructions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              {recipe.instructions ? (
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ 
                    __html: renderInstructions(recipe.instructions) 
                  }}
                />
              ) : (
                <p className="text-gray-500 italic">No instructions added yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Additional Media */}
          {media.length > 1 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>More Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {media.slice(1).map((file, index) => (
                    <div key={index} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      {file.type.startsWith('image/') ? (
                        <Image
                          src={file.preview || URL.createObjectURL(file)}
                          alt={`Recipe image ${index + 2}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(file)}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}