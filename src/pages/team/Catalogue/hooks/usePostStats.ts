import { useQuery } from '@tanstack/react-query';

import { getPostStats } from '../api/catalogue.api';
import type { PostStats } from '../api/catalogue.types';

export function usePostStats() {
  return useQuery<PostStats, Error>({
    queryKey: ['post-stats'],

    queryFn: getPostStats,

    staleTime: 1000 * 60,

    refetchOnWindowFocus: false,

    retry: 2,
  });
}