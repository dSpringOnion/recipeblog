import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, Users, Heart } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface RecipeInfoProps {
  prepTime?: number;
  cookTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  cuisine?: string;
  dietaryTags?: Array<{
    dietaryTag: {
      id: string;
      name: string;
      color: string;
    };
  }>;
  favoriteCount: number;
}

const difficultyConfig = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  hard: { label: 'Hard', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
};

export function RecipeInfo({
  prepTime,
  cookTime,
  difficulty,
  cuisine,
  dietaryTags,
  favoriteCount,
}: RecipeInfoProps) {
  const totalTime = (prepTime || 0) + (cookTime || 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recipe Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timing */}
        <div className="grid grid-cols-2 gap-4">
          {prepTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Prep Time</p>
                <p className="font-medium">{formatDuration(prepTime)}</p>
              </div>
            </div>
          )}
          
          {cookTime && (
            <div className="flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Cook Time</p>
                <p className="font-medium">{formatDuration(cookTime)}</p>
              </div>
            </div>
          )}
        </div>

        {totalTime > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Total Time</p>
                <p className="font-medium">{formatDuration(totalTime)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Difficulty */}
        {difficulty && (
          <div className="flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Difficulty:</span>
              <Badge 
                variant="outline" 
                className={difficultyConfig[difficulty].color}
              >
                {difficultyConfig[difficulty].label}
              </Badge>
            </div>
          </div>
        )}

        {/* Cuisine */}
        {cuisine && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Cuisine:</span>
              <Badge variant="outline">{cuisine}</Badge>
            </div>
          </div>
        )}

        {/* Dietary Tags */}
        {dietaryTags && dietaryTags.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Dietary Info:</p>
            <div className="flex flex-wrap gap-1">
              {dietaryTags.map(({ dietaryTag }) => (
                <Badge 
                  key={dietaryTag.id}
                  variant="outline"
                  style={{ 
                    backgroundColor: `${dietaryTag.color}20`,
                    borderColor: dietaryTag.color,
                    color: dietaryTag.color
                  }}
                  className="text-xs"
                >
                  {dietaryTag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Favorites */}
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {favoriteCount} {favoriteCount === 1 ? 'person' : 'people'} favorited this recipe
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}