'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, MenuIcon, XIcon, UserIcon, HeartIcon, PencilIcon } from '@/components/icons/CozyIcons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const quickSearches = [
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

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setIsSearchFocused(false);
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
    <nav className="bg-parchment-50/95 backdrop-blur-sm border-b-2 border-coffee-200/60 dark:border-coffee-700 sticky top-0 z-50">
      {/* Decorative dotted border (Cyworld style) */}
      <div className="h-1 bg-gradient-to-r from-transparent via-cinnamon-300/40 to-transparent"></div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with personal styling */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-xl bg-coffee-100/50 border border-coffee-200/50 cozy-transition group-hover:bg-coffee-200/50 group-hover:scale-105">
              <span className="text-2xl">📖</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-coffee-900 dark:text-parchment-50 group-hover:text-coffee-700 cozy-transition">
                My Kitchen Diary
              </span>
              <span className="text-xs text-coffee-600/70 dark:text-coffee-400 italic">where recipes come to life ☕</span>
            </div>
          </Link>

          {/* Desktop Search with warm styling and dropdown */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8" ref={searchRef}>
            <div className="w-full relative">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cinnamon-500" />
                  <Input
                    type="search"
                    placeholder="Find a recipe in my collection..."
                    className="pl-10 w-full bg-latte-50/80 border-coffee-300/40 text-coffee-900 placeholder:text-coffee-500/60 focus:border-coffee-500 focus:ring-coffee-500/20 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                  />
                </div>
              </form>

              {/* Search dropdown with filters */}
              {isSearchFocused && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-parchment-50 border-2 border-coffee-300/40 rounded-xl cozy-shadow-lg p-4 space-y-4">
                  {/* Quick searches */}
                  <div>
                    <h3 className="text-xs font-medium text-coffee-700 mb-2 flex items-center gap-2">
                      <span>💭</span>
                      <span className="italic">Quick searches</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {quickSearches.map((search) => (
                        <Button
                          key={search}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs text-coffee-600 hover:bg-coffee-100/60 hover:text-coffee-900 cozy-transition border border-dashed border-coffee-300/40 rounded-lg h-7"
                          onClick={() => {
                            setSearchQuery(search);
                            router.push(`/recipes?q=${encodeURIComponent(search)}`);
                            setIsSearchFocused(false);
                          }}
                        >
                          {search}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Cuisine filters */}
                  <div>
                    <h3 className="text-xs font-medium text-coffee-700 mb-2 flex items-center gap-2">
                      <span>🌍</span>
                      <span className="italic">Cuisine</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cuisineFilters.map((cuisine) => (
                        <Badge
                          key={cuisine}
                          className={`cursor-pointer cozy-transition text-xs h-7 ${
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

                  {/* Dietary filters */}
                  <div>
                    <h3 className="text-xs font-medium text-coffee-700 mb-2 flex items-center gap-2">
                      <span>🥗</span>
                      <span className="italic">Dietary</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {dietaryFilters.map((dietary) => (
                        <Badge
                          key={dietary}
                          className={`cursor-pointer cozy-transition text-xs h-7 ${
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

                  {/* Search button */}
                  {(searchQuery.trim() || selectedCuisines.length > 0 || selectedDietary.length > 0) && (
                    <Button
                      onClick={handleSearch}
                      className="w-full bg-cinnamon-500 hover:bg-cinnamon-600 text-parchment-50 cozy-shadow"
                      size="sm"
                    >
                      Search with filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation with personal touch */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/recipes" className="px-4 py-2 rounded-lg text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100/60 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition font-medium">
              My Recipes
            </Link>

            {session ? (
              <>
                <Link href="/profile/favorites">
                  <Button variant="ghost" size="sm" className="text-coffee-700 hover:bg-coffee-100/60 hover:text-coffee-900 cozy-transition">
                    <HeartIcon className="h-4 w-4 mr-2" />
                    Saved
                  </Button>
                </Link>

                <Link href="/recipes/create">
                  <Button size="sm" className="bg-cinnamon-500 hover:bg-cinnamon-600 text-parchment-50 cozy-shadow border border-cinnamon-600/30">
                    <span className="mr-2">✍️</span>
                    Write
                  </Button>
                </Link>

                <div className="relative group">
                  <Button variant="ghost" size="sm" className="text-coffee-700 hover:bg-coffee-100/60 hover:text-coffee-900 cozy-transition">
                    <UserIcon className="h-4 w-4 mr-2" />
                    {session.user?.name || 'Profile'}
                  </Button>

                  {/* Dropdown Menu with warm styling */}
                  <div className="absolute right-0 mt-2 w-56 bg-parchment-50 dark:bg-coffee-900 border-2 border-coffee-200/60 dark:border-coffee-700 rounded-xl cozy-shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible cozy-transition">
                    <div className="py-2">
                      <Link href="/profile" className="block px-4 py-2.5 text-sm text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100/60 dark:hover:bg-coffee-800 cozy-transition">
                        🧑 My Profile
                      </Link>
                      <Link href="/profile/favorites" className="block px-4 py-2.5 text-sm text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100/60 dark:hover:bg-coffee-800 cozy-transition">
                        ❤️ My Favorites
                      </Link>
                      {session.user?.role === 'admin' && (
                        <Link href="/admin" className="block px-4 py-2.5 text-sm text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100/60 dark:hover:bg-coffee-800 cozy-transition">
                          ⚙️ Admin Dashboard
                        </Link>
                      )}
                      <div className="my-1 border-t border-coffee-200/60 dark:border-coffee-700"></div>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2.5 text-sm text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100/60 dark:hover:bg-coffee-800 cozy-transition"
                      >
                        👋 Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/signin">
                  <Button size="sm" className="bg-coffee-600 hover:bg-coffee-700 text-parchment-50 cozy-shadow border border-coffee-700/20">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button with warm styling */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-coffee-700 hover:bg-coffee-100/60 cozy-transition"
            >
              {isMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu with cozy styling */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-coffee-200/60 dark:border-coffee-700 bg-parchment-100/80 rounded-b-xl backdrop-blur-sm">
            {/* Mobile Search with personal touch */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cinnamon-500" />
                <Input
                  type="search"
                  placeholder="Find a recipe..."
                  className="pl-10 w-full bg-latte-50/80 border-coffee-300/40 text-coffee-900 placeholder:text-coffee-500/60 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Mobile Navigation Links with personal styling */}
            <div className="space-y-1">
              <Link
                href="/recipes"
                className="block px-4 py-2.5 rounded-lg text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100/60 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                📚 My Recipes
              </Link>

              {session ? (
                <>
                  <Link
                    href="/profile/favorites"
                    className="block px-4 py-2.5 rounded-lg text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100/60 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    💝 Saved Recipes
                  </Link>
                  <Link
                    href="/recipes/create"
                    className="block px-4 py-2.5 rounded-lg text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100/60 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ✍️ Write a Recipe
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2.5 rounded-lg text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100/60 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🧑 Profile
                  </Link>
                  {session.user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2.5 rounded-lg text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100/60 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ⚙️ Admin Dashboard
                    </Link>
                  )}
                  <div className="my-2 border-t border-coffee-200/60 dark:border-coffee-700"></div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2.5 rounded-lg text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100/60 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition"
                  >
                    👋 Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/signin"
                  className="block px-4 py-2.5 rounded-lg text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100/60 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🔐 Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}