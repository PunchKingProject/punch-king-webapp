import { useQuery } from '@tanstack/react-query';

import { getTeamPostById } from '../api/catalogue.api';
import type { TeamPost } from '../api/catalogue.types';

export function usePostById(id?: number) {
  return useQuery<TeamPost, Error>({
    queryKey: ['team-post', id],

    queryFn: () => getTeamPostById(id as number),

    enabled: !!id,

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,

    retry: 2,
  });
}