import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { RecipeCreator } from '@/components/features/recipe/RecipeCreator';

export const metadata = {
  title: 'Create Recipe | Recipe Blog',
  description: 'Share your delicious recipe with the community',
};

export default async function CreateRecipePage() {
  const session = await auth();

  // DEV MODE: Skip auth check in development
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev && !session) {
    redirect('/signin?callbackUrl=/recipes/create');
  }

  return <RecipeCreator />;
}