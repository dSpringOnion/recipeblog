import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { DashboardNavbar } from '@/components/layout/DashboardNavbar';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // DEV MODE: Skip auth check in development
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev && !session) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNavbar />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}