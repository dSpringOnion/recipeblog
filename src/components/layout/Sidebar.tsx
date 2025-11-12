'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CoffeeCupIcon, CookingPotIcon, HeartIcon, RecipeBookIcon, MenuIcon, XIcon } from '@/components/icons/CozyIcons';
import { Button } from '@/components/ui/button';

const coffeeCategories = [
  { name: 'Espresso Drinks', slug: 'espresso', icon: '☕', count: 12 },
  { name: 'Cold Brews', slug: 'cold-brew', icon: '🧊', count: 8 },
  { name: 'Lattes & Cappuccinos', slug: 'lattes', icon: '🥛', count: 15 },
  { name: 'Tea Recipes', slug: 'tea', icon: '🍵', count: 10 },
  { name: 'Coffee Treats', slug: 'coffee-treats', icon: '🍰', count: 7 },
];

const foodCategories = [
  { name: 'Breakfast', slug: 'breakfast', icon: '🍳', count: 18 },
  { name: 'Lunch & Dinner', slug: 'lunch-dinner', icon: '🍽️', count: 24 },
  { name: 'Snacks', slug: 'snacks', icon: '🍪', count: 16 },
  { name: 'Desserts', slug: 'desserts', icon: '🍰', count: 21 },
  { name: 'Comfort Food', slug: 'comfort', icon: '🥘', count: 14 },
];

const dietaryFilters = [
  { name: 'Vegetarian', slug: 'vegetarian', color: 'text-emerald-600' },
  { name: 'Vegan', slug: 'vegan', color: 'text-green-600' },
  { name: 'Gluten-Free', slug: 'gluten-free', color: 'text-amber-600' },
  { name: 'Dairy-Free', slug: 'dairy-free', color: 'text-blue-600' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname.includes(path);

  const sidebarContent = (
    <div className="space-y-4">
        {/* Quick Links Section */}
        <div className="bg-white/60 border-2 border-dashed border-coffee-300/50 rounded-xl p-4 cozy-shadow">
          <div className="flex items-center gap-2 mb-3">
            <RecipeBookIcon className="h-4 w-4 text-cinnamon-500" />
            <h3 className="font-bold text-coffee-900 text-sm">Quick Links</h3>
          </div>
          <div className="space-y-2">
            <Link
              href="/recipes"
              className={`block px-3 py-2 rounded-lg text-sm cozy-transition ${
                pathname === '/recipes'
                  ? 'bg-cinnamon-100 text-cinnamon-800 font-medium'
                  : 'text-coffee-700 hover:bg-coffee-100/60'
              }`}
            >
              📚 All Recipes
            </Link>
            <Link
              href="/profile/favorites"
              className={`block px-3 py-2 rounded-lg text-sm cozy-transition ${
                pathname === '/profile/favorites'
                  ? 'bg-cinnamon-100 text-cinnamon-800 font-medium'
                  : 'text-coffee-700 hover:bg-coffee-100/60'
              }`}
            >
              <span className="flex items-center gap-2">
                <HeartIcon className="h-3 w-3" />
                My Favorites
              </span>
            </Link>
          </div>
        </div>

        {/* Coffee & Tea Section */}
        <div className="bg-gradient-to-br from-coffee-50 to-latte-50 border-2 border-coffee-400/40 rounded-xl p-4 cozy-shadow">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-dashed border-coffee-300/40">
            <CoffeeCupIcon className="h-5 w-5 text-coffee-600" />
            <h3 className="font-bold text-coffee-900">Coffee & Tea</h3>
          </div>
          <div className="space-y-1.5">
            {coffeeCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/recipes?category=${category.slug}`}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cozy-transition ${
                  isActive(category.slug)
                    ? 'bg-coffee-200/50 text-coffee-900 font-medium'
                    : 'text-coffee-700 hover:bg-coffee-100/60'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{category.icon}</span>
                  <span className="text-xs">{category.name}</span>
                </span>
                <span className="text-xs text-coffee-500 bg-white/50 px-1.5 py-0.5 rounded">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Food Section */}
        <div className="bg-gradient-to-br from-cinnamon-50 to-parchment-50 border-2 border-cinnamon-400/40 rounded-xl p-4 cozy-shadow">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-dashed border-cinnamon-300/40">
            <CookingPotIcon className="h-5 w-5 text-cinnamon-600" />
            <h3 className="font-bold text-coffee-900">Food Recipes</h3>
          </div>
          <div className="space-y-1.5">
            {foodCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/recipes?category=${category.slug}`}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cozy-transition ${
                  isActive(category.slug)
                    ? 'bg-cinnamon-200/50 text-coffee-900 font-medium'
                    : 'text-coffee-700 hover:bg-cinnamon-100/60'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{category.icon}</span>
                  <span className="text-xs">{category.name}</span>
                </span>
                <span className="text-xs text-coffee-500 bg-white/50 px-1.5 py-0.5 rounded">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Dietary Filters */}
        <div className="bg-white/60 border-2 border-dashed border-coffee-300/50 rounded-xl p-4 cozy-shadow">
          <h3 className="font-bold text-coffee-900 text-sm mb-3 flex items-center gap-2">
            <span>🥗</span> Dietary
          </h3>
          <div className="space-y-1.5">
            {dietaryFilters.map((filter) => (
              <Link
                key={filter.slug}
                href={`/recipes?dietary=${filter.slug}`}
                className={`block px-3 py-1.5 rounded-lg text-xs cozy-transition ${
                  isActive(filter.slug)
                    ? 'bg-latte-100 font-medium'
                    : 'text-coffee-700 hover:bg-coffee-100/60'
                } ${filter.color}`}
              >
                {filter.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Decorative note */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-amber-300/40 rounded-lg p-3 cozy-shadow rotate-[-0.5deg]">
          <p className="text-xs text-coffee-700/80 italic leading-relaxed text-center">
            ✨ "Every recipe tells a story from my kitchen" ☕
          </p>
        </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-coffee-500 hover:bg-coffee-600 text-white shadow-lg"
        aria-label="Open menu"
      >
        <MenuIcon className="h-6 w-6" />
      </Button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-20">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-parchment-50 z-50 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="sticky top-0 bg-parchment-50/95 backdrop-blur-sm p-4 border-b-2 border-coffee-300/40 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-coffee-900">Browse Recipes</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(false)}
            className="h-8 w-8 p-0"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className="p-4">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
