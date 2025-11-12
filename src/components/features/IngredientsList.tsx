'use client';

import { formatIngredientQuantity } from '@/lib/scale';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
  baseServings: number;
  targetServings: number;
}

export function IngredientsList({ ingredients }: IngredientsListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  
  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };
  
  return (
    <div className="bg-card border rounded-lg p-4">
      <h3 className="font-medium mb-4">Ingredients</h3>
      
      <ul className="space-y-3">
        {ingredients.map((ingredient) => {
          const isChecked = checkedItems.has(ingredient.id);
          
          return (
            <li
              key={ingredient.id}
              className={`flex items-start gap-3 p-2 rounded cursor-pointer hover:bg-muted/50 transition-colors ${
                isChecked ? 'bg-muted/50 line-through text-muted-foreground' : ''
              }`}
              onClick={() => toggleCheck(ingredient.id)}
            >
              <CheckCircle2
                className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                  isChecked ? 'text-green-600' : 'text-muted-foreground'
                }`}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">
                    {formatIngredientQuantity(ingredient.quantity, ingredient.unit as any)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {ingredient.unit}
                  </Badge>
                  <span className="capitalize">{ingredient.name}</span>
                </div>
                
                {ingredient.notes && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {ingredient.notes}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      
      <div className="mt-4 pt-3 border-t text-sm text-muted-foreground">
        Tap ingredients to check them off
      </div>
    </div>
  );
}