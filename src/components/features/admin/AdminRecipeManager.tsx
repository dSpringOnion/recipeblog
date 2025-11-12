'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Clock,
  Users,
  ChefHat
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/trpc/client';
import { formatDuration, cn } from '@/lib/utils';

interface Recipe {
  id: string;
  title: string;
  description: string;
  slug: string;
  imageUrls: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  baseServings: number;
  cuisine?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  _count: {
    favorites: number;
    ingredients: number;
  };
}

type SortOption = 'newest' | 'oldest' | 'title' | 'author' | 'favorites';
type FilterOption = 'all' | 'published' | 'draft' | 'easy' | 'medium' | 'hard';

export function AdminRecipeManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);

  // Mock data - replace with actual tRPC query
  const recipes: Recipe[] = [
    {
      id: '1',
      title: 'Classic Chocolate Chip Cookies',
      description: 'The perfect chewy chocolate chip cookies that everyone loves',
      slug: 'classic-chocolate-chip-cookies',
      imageUrls: ['https://example.com/cookie1.jpg'],
      difficulty: 'easy',
      prepTimeMinutes: 15,
      cookTimeMinutes: 12,
      baseServings: 24,
      cuisine: 'American',
      isPublished: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      author: {
        id: 'user1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        image: null
      },
      _count: {
        favorites: 45,
        ingredients: 8
      }
    },
    {
      id: '2',
      title: 'Homemade Pizza Margherita',
      description: 'Authentic Italian pizza with fresh basil and mozzarella',
      slug: 'homemade-pizza-margherita',
      imageUrls: ['https://example.com/pizza1.jpg'],
      difficulty: 'medium',
      prepTimeMinutes: 120,
      cookTimeMinutes: 15,
      baseServings: 4,
      cuisine: 'Italian',
      isPublished: false,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      author: {
        id: 'user2',
        name: 'Marco Rossi',
        email: 'marco@example.com',
        image: null
      },
      _count: {
        favorites: 12,
        ingredients: 10
      }
    }
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.cuisine?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterBy === 'all' ||
      (filterBy === 'published' && recipe.isPublished) ||
      (filterBy === 'draft' && !recipe.isPublished) ||
      recipe.difficulty === filterBy;

    return matchesSearch && matchesFilter;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.name.localeCompare(b.author.name);
      case 'favorites':
        return b._count.favorites - a._count.favorites;
      default:
        return 0;
    }
  });

  const toggleRecipeSelection = (recipeId: string) => {
    setSelectedRecipes(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const handleBulkAction = (action: 'publish' | 'unpublish' | 'delete') => {
    console.log(`Bulk ${action} for recipes:`, selectedRecipes);
    // Implement bulk actions here
    setSelectedRecipes([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-brand-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Recipes</p>
                <p className="text-2xl font-bold">{recipes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-herb-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                <p className="text-2xl font-bold">{recipes.filter(r => r.isPublished).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-spice-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drafts</p>
                <p className="text-2xl font-bold">{recipes.filter(r => !r.isPublished).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-cream-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Favorites</p>
                <p className="text-2xl font-bold">
                  {recipes.reduce((sum, r) => sum + r._count.favorites, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Recipe Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search recipes, authors, or cuisine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Recipes</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="author">Author A-Z</SelectItem>
                <SelectItem value="favorites">Most Favorites</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedRecipes.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <span className="text-sm font-medium">
                {selectedRecipes.length} recipe(s) selected
              </span>
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('publish')}
                >
                  Publish
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('unpublish')}
                >
                  Unpublish
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('delete')}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* Recipe List */}
          <div className="space-y-3">
            {sortedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className={cn(
                  "flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                  selectedRecipes.includes(recipe.id) && "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700"
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedRecipes.includes(recipe.id)}
                  onChange={() => toggleRecipeSelection(recipe.id)}
                  className="rounded border-gray-300"
                />
                
                {recipe.imageUrls[0] && (
                  <img
                    src={recipe.imageUrls[0]}
                    alt={recipe.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{recipe.title}</h3>
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty}
                    </Badge>
                    {recipe.isPublished ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                    {recipe.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>By {recipe.author.name}</span>
                    <span>{recipe.cuisine}</span>
                    <span>{recipe._count.favorites} favorites</span>
                    {recipe.prepTimeMinutes && (
                      <span>{formatDuration(recipe.prepTimeMinutes)} prep</span>
                    )}
                    <span>{recipe.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Recipe
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Recipe
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      {recipe.isPublished ? (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Publish
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 dark:text-red-400">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Recipe
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          {sortedRecipes.length === 0 && (
            <div className="text-center py-12">
              <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No recipes found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}