'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClockIcon, UsersIcon, HeartIcon } from '@/components/icons/CozyIcons';
import { api } from '@/lib/trpc/client';

// Mock data for demo - in real app this would come from tRPC
const featuredRecipes = [
  {
    id: '1',
    slug: 'classic-chocolate-chip-cookies',
    title: 'Classic Chocolate Chip Cookies',
    description: 'My go-to comfort recipe! Made these for Sunday brunch and they disappeared in minutes',
    videoThumbnail: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    baseServings: 24,
    difficulty: 'easy' as const,
    cuisine: 'American',
    author: { name: 'Recipe Admin', image: null },
    dietaryTags: [{ dietaryTag: { name: 'vegetarian', color: '#22c55e' } }],
    _count: { favorites: 142 }
  },
  {
    id: '2',
    slug: 'quinoa-black-bean-bowl',
    title: 'Quinoa Black Bean Power Bowl',
    description: 'Been making this every week for lunch prep - so colorful and keeps me full until dinner',
    videoThumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    baseServings: 4,
    difficulty: 'easy' as const,
    cuisine: 'Mexican',
    author: { name: 'Test User', image: null },
    dietaryTags: [
      { dietaryTag: { name: 'vegan', color: '#16a34a' } },
      { dietaryTag: { name: 'gluten-free', color: '#f59e0b' } }
    ],
    _count: { favorites: 89 }
  },
  {
    id: '3',
    slug: 'creamy-mushroom-risotto',
    title: 'Creamy Mushroom Risotto',
    description: 'Reminds me of that little Italian place we visited last fall. Takes patience but SO worth it',
    videoThumbnail: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    prepTimeMinutes: 20,
    cookTimeMinutes: 40,
    baseServings: 6,
    difficulty: 'medium' as const,
    cuisine: 'Italian',
    author: { name: 'Chef Marco', image: null },
    dietaryTags: [{ dietaryTag: { name: 'vegetarian', color: '#22c55e' } }],
    _count: { favorites: 205 }
  }
];

function RecipeCard({ recipe, index }: { recipe: typeof featuredRecipes[0], index: number }) {
  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  // Deterministic rotations for polaroid effect based on index
  const rotations = ['rotate-[-2deg]', 'rotate-[1deg]', 'rotate-[-1deg]'];
  const rotation = rotations[index % rotations.length];

  return (
    <div className={`${rotation} hover:rotate-0 cozy-transition group`}>
      {/* Polaroid-style card with thick white border */}
      <div className="bg-white p-3 rounded-lg cozy-shadow-lg hover:cozy-shadow-xl cozy-transition border-2 border-parchment-100">
        {/* Washi tape effect at top */}
        <div className="absolute -top-2 left-1/4 w-16 h-5 bg-cinnamon-200/40 rotate-[-3deg] rounded-sm border-l border-r border-cinnamon-300/30" />

        {/* Photo area */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-parchment-100">
          <Image
            src={recipe.videoThumbnail}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 cozy-transition"
          />
          {/* Vintage photo overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/30 via-transparent to-parchment-50/10" />

          {/* Corner bookmark/pin effect */}
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-cinnamon-400/70 rounded-full cozy-shadow" />
          </div>

          {/* Handwritten time note */}
          <div className="absolute bottom-2 left-2">
            <div className="px-2 py-1 bg-white/90 rounded text-xs text-coffee-800 font-medium italic border border-coffee-200/50">
              ~{totalTime} min
            </div>
          </div>
        </div>

        {/* Polaroid caption area (white space below photo) */}
        <div className="mt-3 space-y-2 pb-1">
          {/* Handwritten-style title */}
          <h3 className="font-bold text-base line-clamp-1 text-coffee-900 group-hover:text-coffee-700 cozy-transition text-center">
            {recipe.title}
          </h3>

          {/* Personal note in handwriting style */}
          <p className="text-xs text-coffee-600/80 italic line-clamp-2 leading-relaxed text-center">
            "{recipe.description}"
          </p>

          {/* Scrapbook-style tags */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="flex items-center gap-1 text-xs text-coffee-600">
              <UsersIcon className="h-3 w-3 text-cinnamon-500" />
              <span>{recipe.baseServings}</span>
            </div>

            {recipe.dietaryTags?.slice(0, 1).map(({ dietaryTag }) => (
              <Badge
                key={dietaryTag.name}
                className="text-xs bg-latte-100 text-coffee-700 border border-dashed border-coffee-300/60 px-2 py-0"
              >
                {dietaryTag.name}
              </Badge>
            ))}

            {/* Heart sticker */}
            <div className="flex items-center gap-0.5 text-xs">
              <HeartIcon className="h-3 w-3 fill-red-300 text-red-400" />
              <span className="text-coffee-600">{recipe._count.favorites}</span>
            </div>
          </div>

          {/* Handwritten difficulty note at bottom */}
          <div className="flex justify-center pt-1">
            <span className={`text-xs italic ${
              recipe.difficulty === 'easy'
                ? 'text-emerald-600'
                : recipe.difficulty === 'medium'
                ? 'text-amber-600'
                : 'text-rose-600'
            }`}>
              {recipe.difficulty === 'easy' ? '✨ easy to make!' : recipe.difficulty === 'medium' ? '⭐ worth the effort' : '🎯 challenge accepted'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedRecipes() {
  return (
    <section className="py-16 bg-gradient-to-b from-parchment-50 to-latte-50/30 relative">
      {/* Decorative doodles */}
      <div className="absolute top-8 left-8 text-4xl opacity-10 rotate-12">🌿</div>
      <div className="absolute top-12 right-12 text-4xl opacity-10 -rotate-12">🍴</div>
      <div className="absolute bottom-20 left-20 text-4xl opacity-10 rotate-[-15deg]">⭐</div>

      <div className="mx-auto">
        {/* Section header with personal styling */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-white/60 border-2 border-dashed border-coffee-300/50 rounded-xl cozy-shadow rotate-[-0.5deg]">
            <span className="text-sm font-medium text-coffee-700 italic flex items-center gap-2">
              <span>📝</span>
              Latest from my kitchen
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-coffee-900 mb-4">
            Recent Recipes
          </h2>
          <p className="text-coffee-700/70 max-w-2xl mx-auto text-lg leading-relaxed">
            The latest recipes I've shared from my social media
          </p>
        </div>

        {/* Recipe grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          {featuredRecipes.map((recipe, index) => (
            <Link key={recipe.id} href={`/recipes/${recipe.slug}`} className="group">
              <RecipeCard recipe={recipe} index={index} />
            </Link>
          ))}
        </div>

        {/* View all button - diary style */}
        <div className="text-center">
          <Link href="/recipes">
            <div className="inline-block px-8 py-3 bg-white border-2 border-dashed border-coffee-400 rounded-xl cozy-shadow hover:cozy-shadow-lg cozy-transition rotate-[-0.5deg] hover:rotate-0 cursor-pointer">
              <span className="text-base font-medium text-coffee-800 flex items-center gap-2">
                <span>📚</span>
                <span className="italic">View all recipes</span>
                <span>→</span>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}