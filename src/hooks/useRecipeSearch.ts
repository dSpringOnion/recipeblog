import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { api } from '@/lib/trpc/client';
import type { RecipeListInput } from '@/lib/validations/recipe';

export function useRecipeSearch(initialFilters: Partial<RecipeListInput> = {}) {
  const [filters, setFilters] = useState<RecipeListInput>({
    limit: 12,
    ...initialFilters,
  });

  // Debounce search query to avoid too many API calls
  const debouncedSearch = useDebounce(filters.search || '', 300);

  // Memoize the actual query filters
  const queryFilters = useMemo(() => ({
    ...filters,
    search: debouncedSearch,
  }), [filters, debouncedSearch]);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.recipe.list.useInfiniteQuery(
    queryFilters,
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  );

  const recipes = useMemo(() => {
    return data?.pages.flatMap(page => page.items) ?? [];
  }, [data]);

  const updateFilters = (newFilters: Partial<RecipeListInput>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({ limit: 12 });
  };

  return {
    recipes,
    filters,
    updateFilters,
    resetFilters,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}