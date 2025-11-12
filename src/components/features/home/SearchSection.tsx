'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const popularSearches = [
  'cookies & treats',
  'comfort food',
  'quick weeknight meals',
  'weekend projects',
  'family favorites',
];

const cuisineFilters = [
  'Italian', 'Mexican', 'Asian', 'American', 'Mediterranean', 'Indian'
];

const dietaryFilters = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto'
];

export function SearchSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    
    if (selectedCuisines.length > 0) {
      params.set('cuisine', selectedCuisines.join(','));
    }
    
    if (selectedDietary.length > 0) {
      params.set('dietary', selectedDietary.join(','));
    }
    
    router.push(`/recipes?${params.toString()}`);
  };

  const toggleFilter = (
    filter: string, 
    selected: string[], 
    setSelected: (filters: string[]) => void
  ) => {
    if (selected.includes(filter)) {
      setSelected(selected.filter(f => f !== filter));
    } else {
      setSelected([...selected, filter]);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-latte-50/30 to-parchment-50 relative">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 text-4xl opacity-10 rotate-12">🔍</div>
      <div className="absolute bottom-10 left-10 text-4xl opacity-10 -rotate-12">📑</div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block mb-4 px-4 py-2 bg-white/60 border-2 border-dashed border-coffee-300/50 rounded-xl cozy-shadow rotate-[-0.5deg]">
              <span className="text-sm font-medium text-coffee-700 italic flex items-center gap-2">
                <span>🔍</span>
                Looking for something specific?
              </span>
            </div>
            <h2 className="text-3xl font-bold text-coffee-900 dark:text-parchment-50 mb-4">
              Browse My Recipe Collection
            </h2>
            <p className="text-coffee-700/70 dark:text-coffee-400 leading-relaxed">
              Filter by what you're in the mood for or what you have on hand
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            {/* Main Search with diary styling */}
            <div className="relative">
              <div className="bg-white/80 border-2 border-coffee-300/40 rounded-xl cozy-shadow hover:cozy-shadow-lg cozy-transition overflow-hidden">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cinnamon-500" />
                <Input
                  type="search"
                  placeholder="Try 'chocolate', 'pasta', or 'easy dinner'..."
                  className="pl-12 h-14 text-lg bg-transparent border-0 text-coffee-900 placeholder:text-coffee-500/60 focus:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-cinnamon-500 hover:bg-cinnamon-600 text-parchment-50 cozy-shadow"
                  size="sm"
                >
                  Find
                </Button>
              </div>
            </div>

            {/* Filters with scrapbook styling */}
            <div className="space-y-4">
              {/* Cuisine Filters */}
              <div>
                <h3 className="text-sm font-medium text-coffee-700 dark:text-coffee-300 mb-3 flex items-center gap-2">
                  <span>🌍</span>
                  <span className="italic">Cuisine Style</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cuisineFilters.map((cuisine) => (
                    <Badge
                      key={cuisine}
                      variant={selectedCuisines.includes(cuisine) ? 'default' : 'outline'}
                      className={`cursor-pointer cozy-transition ${
                        selectedCuisines.includes(cuisine)
                          ? 'bg-cinnamon-500 hover:bg-cinnamon-600 text-parchment-50 border-cinnamon-600'
                          : 'bg-latte-100 text-coffee-700 border-coffee-300/60 hover:bg-latte-200 border-dashed'
                      }`}
                      onClick={() => toggleFilter(cuisine, selectedCuisines, setSelectedCuisines)}
                    >
                      {cuisine}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Dietary Filters */}
              <div>
                <h3 className="text-sm font-medium text-coffee-700 dark:text-coffee-300 mb-3 flex items-center gap-2">
                  <span>🥗</span>
                  <span className="italic">Dietary Preferences</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dietaryFilters.map((dietary) => (
                    <Badge
                      key={dietary}
                      variant={selectedDietary.includes(dietary) ? 'default' : 'outline'}
                      className={`cursor-pointer cozy-transition ${
                        selectedDietary.includes(dietary)
                          ? 'bg-cinnamon-500 hover:bg-cinnamon-600 text-parchment-50 border-cinnamon-600'
                          : 'bg-latte-100 text-coffee-700 border-coffee-300/60 hover:bg-latte-200 border-dashed'
                      }`}
                      onClick={() => toggleFilter(dietary, selectedDietary, setSelectedDietary)}
                    >
                      {dietary}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </form>

          {/* Quick links with personal touch */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-coffee-700 dark:text-coffee-300 mb-3 flex items-center gap-2">
              <span>💭</span>
              <span className="italic">What I'm usually making...</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search) => (
                <Button
                  key={search}
                  variant="ghost"
                  size="sm"
                  className="text-coffee-600 dark:text-coffee-400 hover:bg-coffee-100/60 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition border border-dashed border-coffee-300/40 rounded-lg"
                  onClick={() => {
                    setSearchQuery(search);
                    router.push(`/recipes?q=${encodeURIComponent(search)}`);
                  }}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}