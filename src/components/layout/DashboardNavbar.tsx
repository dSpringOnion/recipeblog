'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Bell, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardNavbar() {
  const { data: session } = useSession();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🍳</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Recipe Blog
            </span>
          </Link>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4" />
              <span className="text-gray-700 dark:text-gray-300">
                {session?.user?.name || 'User'}
              </span>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}