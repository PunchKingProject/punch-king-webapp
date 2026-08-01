import { useInfiniteQuery } from '@tanstack/react-query';
import { getPostsByWeightClass } from '../../../team/Catalogue/api/catalogue.api.ts';
import type { WeightClass } from '../../../team/Catalogue/api/catalogue.types.ts';

// Extend the imported type to safely accept our newly added category
type ExtendedWeightClass = WeightClass | 'others' | string;

export function useWeightClassPosts(
  weightClass: ExtendedWeightClass,
  search = ''
) {
  return useInfiniteQuery({
    queryKey: [
      'public-weight-class-posts',
      weightClass,
      search,
    ],

    initialPageParam: 0,

    queryFn: ({ pageParam }) =>
      getPostsByWeightClass(weightClass as WeightClass, {
        cursor:
          Number(pageParam) || undefined,
        limit: 12,
        search,
      }),

    getNextPageParam: (lastPage) =>
      // Added optional chaining here as a safety measure
      lastPage?.meta?.next_cursor || 
      undefined,

    staleTime: 5 * 60 * 1000,
  });
}