import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { RecipeHero } from '@/components/features/recipe/RecipeHero';
import { IngredientsList } from '@/components/features/recipe/IngredientsList';
import { InstructionsSteps } from '@/components/features/recipe/InstructionsSteps';
import { RecipeInfo } from '@/components/features/recipe/RecipeInfo';
import { FavoriteButton } from '@/components/features/recipe/FavoriteButton';
import { ServingSlider } from '@/components/features/recipe/ServingSlider';
import { api } from '@/lib/trpc/server';

interface RecipePageProps {
  params: { slug: string };
  searchParams: { servings?: string };
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  try {
    const recipe = await api.recipe.get.query({ slug: params.slug });
    
    return {
      title: `${recipe.title} | Recipe Blog`,
      description: recipe.description || `Learn how to make ${recipe.title}`,
      openGraph: {
        title: recipe.title,
        description: recipe.description || '',
        images: recipe.videoThumbnail ? [recipe.videoThumbnail] : [],
      },
    };
  } catch {
    return { title: 'Recipe Not Found' };
  }
}

export default async function RecipePage({ params, searchParams }: RecipePageProps) {
  const targetServings = searchParams.servings ? parseInt(searchParams.servings) : undefined;
  
  try {
    const recipe = targetServings
      ? await api.recipe.getScaled.query({ slug: params.slug, servings: targetServings })
      : await api.recipe.get.query({ slug: params.slug });
    
    if (!recipe) notFound();
    
    return (
      <div className="min-h-screen bg-background">
        <RecipeHero 
          title={recipe.title}
          description={recipe.description}
          videoUrl={recipe.videoUrl}
          videoThumbnail={recipe.videoThumbnail}
          author={recipe.author}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recipe Info Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <RecipeInfo
                prepTime={recipe.prepTimeMinutes}
                cookTime={recipe.cookTimeMinutes}
                difficulty={recipe.difficulty}
                cuisine={recipe.cuisine}
                dietaryTags={recipe.dietaryTags}
                favoriteCount={recipe._count.favorites}
              />
              
              <ServingSlider
                baseServings={recipe.baseServings}
                currentServings={targetServings || recipe.baseServings}
                slug={params.slug}
              />
              
              <FavoriteButton recipeId={recipe.id} />
              
              <IngredientsList
                ingredients={'scaledIngredients' in recipe ? recipe.scaledIngredients : recipe.ingredients}
                baseServings={recipe.baseServings}
                targetServings={targetServings || recipe.baseServings}
              />
            </div>
            
            {/* Instructions */}
            <div className="lg:col-span-2">
              <InstructionsSteps instructions={recipe.instructions} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}