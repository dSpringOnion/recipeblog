'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface ServingSliderProps {
  baseServings: number;
  currentServings: number;
  slug: string;
}

export function ServingSlider({ baseServings, currentServings, slug }: ServingSliderProps) {
  const [servings, setServings] = useState(currentServings);
  const router = useRouter();
  
  const handleServingsChange = (value: number[]) => {
    const newServings = value[0];
    setServings(newServings);
    
    // Update URL with new servings parameter
    const url = newServings === baseServings 
      ? `/recipes/${slug}` 
      : `/recipes/${slug}?servings=${newServings}`;
    
    router.push(url, { scroll: false });
  };
  
  const increment = () => handleServingsChange([Math.min(servings + 1, 20)]);
  const decrement = () => handleServingsChange([Math.max(servings - 1, 1)]);
  
  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Servings</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={decrement}
            disabled={servings <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <span className="font-bold text-lg min-w-[2ch] text-center">
            {servings}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={increment}
            disabled={servings >= 20}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Slider
        value={[servings]}
        onValueChange={handleServingsChange}
        max={20}
        min={1}
        step={1}
        className="w-full"
      />
      
      {servings !== baseServings && (
        <p className="text-sm text-muted-foreground">
          Scaled from {baseServings} servings
        </p>
      )}
    </div>
  );
}