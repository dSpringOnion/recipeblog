'use client';

import { 
  ChefHat, 
  Users, 
  Heart,
  TrendingUp,
  Calendar,
  Settings,
  FileText,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AdminDashboard() {
  // Mock data - replace with actual data fetching
  const stats = {
    totalRecipes: 156,
    totalUsers: 2340,
    totalFavorites: 8924,
    monthlyGrowth: 12.5,
    recentRecipes: [
      {
        id: '1',
        title: 'Classic Chocolate Chip Cookies',
        author: 'Sarah Johnson',
        favorites: 45,
        isPublished: true,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        title: 'Homemade Pizza Margherita',
        author: 'Marco Rossi',
        favorites: 23,
        isPublished: false,
        createdAt: '2024-01-14'
      },
      {
        id: '3',
        title: 'Thai Green Curry',
        author: 'Lisa Chen',
        favorites: 67,
        isPublished: true,
        createdAt: '2024-01-13'
      }
    ],
    recentUsers: [
      {
        id: '1',
        name: 'Emily Davis',
        email: 'emily@example.com',
        joinedAt: '2024-01-15',
        recipesCount: 3
      },
      {
        id: '2',
        name: 'James Wilson',
        email: 'james@example.com',
        joinedAt: '2024-01-14',
        recipesCount: 1
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's what's happening with your recipe blog.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Recipes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalRecipes}
                </p>
              </div>
              <div className="h-12 w-12 bg-brand-100 dark:bg-brand-900 rounded-lg flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400 font-medium">+12%</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-herb-100 dark:bg-herb-900 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-herb-600 dark:text-herb-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400 font-medium">+8%</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Favorites</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalFavorites.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400 font-medium">+15%</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Growth</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.monthlyGrowth}%
                </p>
              </div>
              <div className="h-12 w-12 bg-spice-100 dark:bg-spice-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-spice-600 dark:text-spice-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400 font-medium">+2.1%</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/recipes">
              <Button variant="outline" className="w-full justify-start">
                <ChefHat className="h-4 w-4 mr-2" />
                Manage Recipes
              </Button>
            </Link>
            
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
            
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
            
            <Link href="/admin/settings">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Site Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Recipes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Recipes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentRecipes.map((recipe) => (
                <div key={recipe.id} className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {recipe.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      by {recipe.author} • {recipe.favorites} favorites
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={recipe.isPublished ? "default" : "secondary"}>
                      {recipe.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/admin/recipes">
                <Button variant="ghost" size="sm" className="w-full">
                  View All Recipes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.recipesCount} recipes
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Joined {user.joinedAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="w-full">
                  View All Users
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New recipe published</p>
                <p className="text-xs text-gray-500">Sarah Johnson published "Classic Chocolate Chip Cookies"</p>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registration</p>
                <p className="text-xs text-gray-500">Emily Davis joined the community</p>
              </div>
              <span className="text-xs text-gray-500">4 hours ago</span>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Recipe needs review</p>
                <p className="text-xs text-gray-500">Marco Rossi submitted "Homemade Pizza Margherita" for review</p>
              </div>
              <span className="text-xs text-gray-500">6 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}