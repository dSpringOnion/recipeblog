'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/trpc/client';

interface FavoriteButtonProps {
  recipeId: string;
  initialFavorited?: boolean;
}

export function FavoriteButton({ recipeId, initialFavorited = false }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavoriteMutation = api.user.toggleFavorite.useMutation({
    onMutate: () => {
      setIsLoading(true);
      setIsFavorited(!isFavorited);
    },
    onSuccess: (data) => {
      setIsFavorited(data.favorited);
      setIsLoading(false);
    },
    onError: () => {
      // Revert optimistic update
      setIsFavorited(!isFavorited);
      setIsLoading(false);
    },
  });

  const handleToggleFavorite = () => {
    if (!session) {
      // Redirect to signin or show modal
      window.location.href = '/signin';
      return;
    }

    toggleFavoriteMutation.mutate({ recipeId });
  };

  return (
    <Button
      variant={isFavorited ? "default" : "outline"}
      className="w-full"
      onClick={handleToggleFavorite}
      disabled={isLoading}
    >
      <Heart 
        className={`h-4 w-4 mr-2 ${
          isFavorited ? 'fill-current' : ''
        }`} 
      />
      {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
    </Button>
  );
}