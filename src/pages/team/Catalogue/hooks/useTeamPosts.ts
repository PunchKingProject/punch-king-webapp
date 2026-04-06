import { useQuery } from '@tanstack/react-query';
import type { TeamPost } from '../api/catalogue.types.ts';
import { getTeamPosts } from '../api/catalogue.api.ts';

export function useTeamPosts() {
  return useQuery<TeamPost[]>({
    queryKey: ['team-posts'],
    queryFn: getTeamPosts,
    staleTime: 60_000,
  });
}
