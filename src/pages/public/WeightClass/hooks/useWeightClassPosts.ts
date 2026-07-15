import { useInfiniteQuery } from '@tanstack/react-query';
import { getPostsByWeightClass } from '../../../team/Catalogue/api/catalogue.api.ts';
import type { WeightClass } from '../../../team/Catalogue/api/catalogue.types.ts';

export function useWeightClassPosts(
  weightClass: WeightClass,
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
      getPostsByWeightClass(weightClass, {
        cursor:
          Number(pageParam) || undefined,
        limit: 12,
        search,
      }),

    getNextPageParam: (lastPage) =>
      lastPage.meta.next_cursor ||
      undefined,

    staleTime: 5 * 60 * 1000,
  });
}