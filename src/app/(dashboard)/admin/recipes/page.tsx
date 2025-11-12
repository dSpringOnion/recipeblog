import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminRecipeManager } from '@/components/features/admin/AdminRecipeManager';

export const metadata = {
  title: 'Recipe Management | Admin',
  description: 'Manage all recipes, moderate content, and handle administrative tasks',
};

export default async function AdminRecipesPage() {
  const session = await auth();
  
  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Recipe Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage all recipes, moderate content, and handle administrative tasks
        </p>
      </div>
      
      <AdminRecipeManager />
    </div>
  );
}