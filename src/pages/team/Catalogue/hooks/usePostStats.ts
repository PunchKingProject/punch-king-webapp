import { useQuery } from '@tanstack/react-query';
import { getPostStats } from '../api/catalogue.api.ts';
import type { PostStats } from '../api/catalogue.types.ts';

export function usePostStats() {
  return useQuery<PostStats>({
    queryKey: ['post-stats'],
    queryFn: getPostStats,
    staleTime: 60_000,
  });
}



