import { useQuery } from '@tanstack/react-query';

import { getTeamPosts } from '../api/catalogue.api';
import type { TeamPost } from '../api/catalogue.types';

export function useTeamPosts() {
  return useQuery<TeamPost[], Error>({
    queryKey: ['team-posts'],

    queryFn: getTeamPosts,

    staleTime: 1000 * 60,

    refetchOnWindowFocus: false,

    retry: 2,
  });
}