import { useQuery } from '@tanstack/react-query';
import { getPostStats } from '../api/catalogue.api';
import type { PostStats } from '../api/catalogue.types';

export function usePostStats() {
  return useQuery<PostStats>({
    queryKey: ['post-stats'],
    queryFn: getPostStats,
    staleTime: 60_000,
  });
}



