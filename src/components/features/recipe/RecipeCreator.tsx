'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  ClockIcon,
  UsersIcon,
  PlusCircleIcon,
  CookingPotIcon,
  HeartIcon,
  SearchIcon,
  PencilIcon
} from '@/components/icons/CozyIcons';
import {
  Camera,
  Hash,
  ChefHat,
  Save,
  Eye,
  Sparkles,
  Wand2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/ui/file-upload';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { RecipePreview } from './RecipePreview';

import { parseIngredients, formatIngredientForDisplay } from '@/lib/ingredient-parser';
import { api } from '@/lib/trpc/client';
import { recipeCreateSchema, type RecipeCreateInput, type ParsedIngredient, type UploadedFile } from '@/lib/validations/recipe';
import { useAutoSave } from '@/hooks/useAutoSave';
import { cn } from '@/lib/utils';

interface FileWithPreview extends File {
  preview?: string;
}

export function RecipeCreator() {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<FileWithPreview[]>([]);
  const [ingredientText, setIngredientText] = useState('');
  const [parsedIngredients, setParsedIngredients] = useState<ParsedIngredient[]>([]);
  const [showParsedIngredients, setShowParsedIngredients] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<RecipeCreateInput>({
    resolver: zodResolver(recipeCreateSchema),
    defaultValues: {
      baseServings: 4,
      difficulty: 'easy'
    }
  });

  const watchedValues = watch();
  
  // Auto-save functionality
  const { 
    savedData, 
    lastSaved, 
    isSaving,
    clearSaved,
    hasSavedData
  } = useAutoSave({
    key: 'recipe-draft',
    data: { ...watchedValues, ingredientText, uploadedMedia: [] }, // Don't save files
    delay: 3000,
    enabled: true
  });

  // Parse ingredients when text changes
  useEffect(() => {
    if (ingredientText.trim()) {
      const parsed = parseIngredients(ingredientText);
      setParsedIngredients(parsed);
      setValue('ingredients', parsed);
    } else {
      setParsedIngredients([]);
      setValue('ingredients', []);
    }
  }, [ingredientText, setValue]);

  const { mutate: createRecipe, isPending: isCreating } = api.recipe.create.useMutation({
    onSuccess: (data) => {
      clearSaved(); // Clear auto-saved draft on successful publish
      router.push(`/recipes/${data.slug}`);
    },
    onError: (error) => {
      console.error('Failed to create recipe:', error);
    }
  });

  // Restore draft function
  const restoreDraft = useCallback(() => {
    if (savedData) {
      Object.keys(savedData).forEach(key => {
        if (key === 'ingredientText') {
          setIngredientText(savedData[key] || '');
        } else if (key !== 'uploadedMedia') {
          setValue(key as keyof RecipeCreateInput, savedData[key]);
        }
      });
    }
  }, [savedData, setValue]);

  const onSubmit = useCallback(async (data: RecipeCreateInput) => {
    try {
      let uploadedUrls: string[] = [];
      let videoUrl: string | undefined;

      // Upload media files to Cloudflare if any
      if (uploadedMedia.length > 0) {
        const formData = new FormData();
        uploadedMedia.forEach((file) => {
          formData.append('files', file);
        });
        formData.append('recipeId', 'temp'); // Will be updated after recipe creation

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload media files');
        }

        const result = await response.json();
        
        // Extract URLs from upload results
        result.files.forEach((file: UploadedFile) => {
          if (file.type === 'image') {
            uploadedUrls.push(file.url);
          } else if (file.type === 'video') {
            videoUrl = file.playback; // Use Stream playback URL
          }
        });
      }

      createRecipe({
        ...data,
        imageUrls: uploadedUrls,
        videoUrl,
      });
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  }, [uploadedMedia, createRecipe]);

  const generateTitle = useCallback(() => {
    const suggestions = [
      "My Amazing Recipe",
      "Quick & Easy Delight",
      "Family Favorite",
      "Weekend Special",
      "Comfort Food Classic"
    ];
    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    setValue('title', random);
  }, [setValue]);

  const addPresetIngredients = useCallback((preset: string) => {
    const presets = {
      baking: "2 cups all-purpose flour\n1/2 tsp salt\n1 tsp baking powder\n1/2 cup butter\n1/2 cup sugar\n2 large eggs\n1 tsp vanilla extract",
      pasta: "1 lb pasta\n2 tbsp olive oil\n3 cloves garlic\n1 onion (diced)\n1 can tomatoes\nSalt and pepper to taste\nFresh basil",
      salad: "4 cups mixed greens\n1/2 cup cherry tomatoes\n1/4 cup red onion (sliced)\n1/4 cup cucumber (diced)\n2 tbsp olive oil\n1 tbsp balsamic vinegar"
    };
    setIngredientText(presets[preset as keyof typeof presets] || '');
  }, []);

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Recipe Preview</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsPreview(false)}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Publishing...' : 'Publish Recipe'}
              </Button>
            </div>
          </div>
          
          <RecipePreview
            recipe={{
              ...watchedValues,
              ingredients: parsedIngredients,
              author: { name: 'You', image: null },
              _count: { favorites: 0 }
            }}
            media={uploadedMedia}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Share Your Recipe
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and share your delicious recipe with the community
          </p>
        </div>

        {/* Sticky Action Bar */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-y border-gray-200 dark:border-gray-800 -mx-4 px-4 py-3 mb-6">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Auto-save indicator */}
              <div className="flex items-center gap-2 text-sm">
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Saving...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Saved {lastSaved.toLocaleTimeString()}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500 dark:text-gray-500">Not saved yet</span>
                )}
              </div>

              {/* Restore draft button */}
              {hasSavedData && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={restoreDraft}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Restore Draft
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(true)}
                disabled={!watchedValues.title}
                className="gap-1"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </Button>

              <Button
                onClick={handleSubmit(onSubmit)}
                size="sm"
                disabled={isCreating || !watchedValues.title}
                className="gap-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">{isCreating ? 'Publishing...' : 'Publish Recipe'}</span>
                <span className="sm:hidden">Publish</span>
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Empty State Welcome Guide */}
          {!watchedValues.title && parsedIngredients.length === 0 && uploadedMedia.length === 0 && (
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-2 border-amber-300 dark:border-amber-700">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">👋</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-3">
                      New recipe? Here's your quick start guide:
                    </h3>
                    <ol className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                      <li className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                        <span>📷 Add 1-3 photos (food looks better with pictures!)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                        <span>✏️ Give it a catchy title</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                        <span>🥘 List your ingredients (try Quick Start templates!)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                        <span>📝 Write the cooking steps</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                        <span>🎉 Hit Publish!</span>
                      </li>
                    </ol>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-4 italic">
                      💡 Tip: Your progress is auto-saved as you type. Check the progress indicator on the right!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Media Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Add Photos & Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onFileSelect={setUploadedMedia}
                    multiple
                    maxFiles={5}
                    accept={{
                      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
                      'video/*': ['.mp4', '.mov', '.avi']
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Add eye-catching photos and videos of your recipe. The first image will be your cover photo.
                  </p>
                </CardContent>
              </Card>

              {/* Recipe Title */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-2 mb-4">
                    <Input
                      {...register('title')}
                      placeholder="Give your recipe a catchy title..."
                      className="text-xl font-semibold border-0 border-b-2 border-gray-200 dark:border-gray-700 rounded-none px-0 focus:border-blue-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={generateTitle}
                      className="flex-shrink-0"
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                  )}
                  
                  <Input
                    {...register('description')}
                    placeholder="Write a short description that makes people want to try this recipe..."
                    className="mt-3 border-0 border-b border-gray-200 dark:border-gray-700 rounded-none px-0"
                  />
                </CardContent>
              </Card>

              {/* Ingredients */}
              <Card>
                <CardHeader>
                  <div className="space-y-3">
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      Ingredients
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        💡 Quick Start:
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addPresetIngredients('baking')}
                        className="gap-1 text-xs"
                      >
                        🍰 Baking
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addPresetIngredients('pasta')}
                        className="gap-1 text-xs"
                      >
                        🍝 Pasta
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addPresetIngredients('salad')}
                        className="gap-1 text-xs"
                      >
                        🥗 Salad
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={ingredientText}
                    onChange={(e) => setIngredientText(e.target.value)}
                    placeholder="Just type naturally! For example:
2 cups flour
1/2 tsp salt
3 large eggs (room temperature)
1 cup chocolate chips"
                    className="w-full h-40 p-3 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  
                  {parsedIngredients.length > 0 && (
                    <div className="mt-4">
                      {/* Collapsed Summary */}
                      <button
                        type="button"
                        onClick={() => setShowParsedIngredients(!showParsedIngredients)}
                        className="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 dark:text-green-400 font-medium">✅</span>
                          <span className="text-sm font-medium text-green-900 dark:text-green-100">
                            {parsedIngredients.length} ingredient{parsedIngredients.length !== 1 ? 's' : ''} parsed successfully
                          </span>
                        </div>
                        {showParsedIngredients ? (
                          <ChevronUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                        )}
                      </button>

                      {/* Expanded Details */}
                      {showParsedIngredients && (
                        <div className="mt-2 space-y-1 animate-in slide-in-from-top-2">
                          {parsedIngredients.map((ingredient, index) => (
                            <div key={index} className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded border-l-2 border-green-500">
                              {formatIngredientForDisplay(ingredient)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {errors.ingredients && (
                    <p className="text-red-500 text-sm mt-2">{errors.ingredients.message}</p>
                  )}
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichTextEditor
                    value={watchedValues.instructions || ''}
                    onChange={(value) => setValue('instructions', value)}
                    placeholder="Write step-by-step instructions. Use the toolbar to add timers, temperatures, and formatting!"
                  />
                  {errors.instructions && (
                    <p className="text-red-500 text-sm mt-2">{errors.instructions.message}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Progress Indicator */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Recipe Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Completion: {(() => {
                          const checks = [
                            watchedValues.title,
                            watchedValues.description,
                            parsedIngredients.length > 0,
                            watchedValues.instructions,
                            uploadedMedia.length > 0
                          ];
                          const completed = checks.filter(Boolean).length;
                          return Math.round((completed / checks.length) * 100);
                        })()}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${(() => {
                            const checks = [
                              watchedValues.title,
                              watchedValues.description,
                              parsedIngredients.length > 0,
                              watchedValues.instructions,
                              uploadedMedia.length > 0
                            ];
                            const completed = checks.filter(Boolean).length;
                            return (completed / checks.length) * 100;
                          })()}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2 text-sm">
                    <div className={cn(
                      "flex items-center gap-2 p-2 rounded transition-all",
                      watchedValues.title
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                        : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    )}>
                      {watchedValues.title ? (
                        <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">○</span>
                      )}
                      <span className="font-medium">Title</span>
                    </div>

                    <div className={cn(
                      "flex items-center gap-2 p-2 rounded transition-all",
                      watchedValues.description
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                        : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    )}>
                      {watchedValues.description ? (
                        <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">○</span>
                      )}
                      <span className="font-medium">Description</span>
                    </div>

                    <div className={cn(
                      "flex items-center gap-2 p-2 rounded transition-all",
                      parsedIngredients.length > 0
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700"
                    )}>
                      {parsedIngredients.length > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400">◐</span>
                      )}
                      <span className="font-medium">
                        Ingredients {parsedIngredients.length > 0 && `(${parsedIngredients.length})`}
                      </span>
                    </div>

                    <div className={cn(
                      "flex items-center gap-2 p-2 rounded transition-all",
                      watchedValues.instructions
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700"
                    )}>
                      {watchedValues.instructions ? (
                        <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400">◐</span>
                      )}
                      <span className="font-medium">Instructions</span>
                    </div>

                    <div className={cn(
                      "flex items-center gap-2 p-2 rounded transition-all",
                      uploadedMedia.length > 0
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                        : "bg-sky-50 dark:bg-sky-900/20 text-sky-800 dark:text-sky-200 border border-sky-200 dark:border-sky-700"
                    )}>
                      {uploadedMedia.length > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                      ) : (
                        <span className="text-sky-600 dark:text-sky-400">◯</span>
                      )}
                      <span className="font-medium">
                        Photos {uploadedMedia.length > 0 ? `(${uploadedMedia.length})` : '(optional)'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recipe Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Recipe Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Servings */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      <UsersIcon className="inline h-4 w-4 mr-1" />
                      Serves
                    </label>
                    <Input
                      type="number"
                      {...register('baseServings', { valueAsNumber: true })}
                      min="1"
                      max="20"
                      className="w-full"
                    />
                  </div>

                  {/* Prep Time */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      <ClockIcon className="inline h-4 w-4 mr-1" />
                      Prep Time (minutes)
                    </label>
                    <Input
                      type="number"
                      {...register('prepTimeMinutes', { valueAsNumber: true })}
                      min="0"
                      placeholder="15"
                    />
                  </div>

                  {/* Cook Time */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      <ChefHat className="inline h-4 w-4 mr-1" />
                      Cook Time (minutes)
                    </label>
                    <Input
                      type="number"
                      {...register('cookTimeMinutes', { valueAsNumber: true })}
                      min="0"
                      placeholder="30"
                    />
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['easy', 'medium', 'hard'] as const).map((level) => {
                        const isSelected = watchedValues.difficulty === level;
                        const colorClasses = {
                          easy: isSelected
                            ? 'bg-green-500 hover:bg-green-600 text-white border-green-500'
                            : 'border-green-300 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950',
                          medium: isSelected
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500'
                            : 'border-yellow-300 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950',
                          hard: isSelected
                            ? 'bg-red-500 hover:bg-red-600 text-white border-red-500'
                            : 'border-red-300 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950'
                        };

                        return (
                          <Button
                            key={level}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setValue('difficulty', level)}
                            className={cn(
                              "capitalize font-medium transition-all",
                              colorClasses[level]
                            )}
                          >
                            {level}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cuisine */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Cuisine</label>
                    <Input
                      {...register('cuisine')}
                      placeholder="Italian, Mexican, Asian..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Dietary Tags</CardTitle>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Click to toggle dietary restrictions
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'low-carb'].map((tag) => {
                      const isSelected = (watchedValues.dietaryTags || []).includes(tag);
                      return (
                        <Badge
                          key={tag}
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer transition-all font-medium capitalize",
                            isSelected
                              ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                              : "hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300"
                          )}
                          onClick={() => {
                            const current = watchedValues.dietaryTags || [];
                            const updated = current.includes(tag)
                              ? current.filter(t => t !== tag)
                              : [...current, tag];
                            setValue('dietaryTags', updated);
                          }}
                        >
                          {isSelected && <span className="mr-1">✓</span>}
                          {tag}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Publish Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isCreating || !watchedValues.title}
              >
                <Save className="h-4 w-4 mr-2" />
                {isCreating ? 'Publishing...' : 'Publish Recipe'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}