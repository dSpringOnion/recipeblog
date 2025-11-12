import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminDashboard } from '@/components/features/admin/AdminDashboard';

export const metadata = {
  title: 'Admin Dashboard | Recipe Blog',
  description: 'Administrative dashboard for managing the recipe blog',
};

export default async function AdminPage() {
  const session = await auth();
  
  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }
  
  return <AdminDashboard />;
}