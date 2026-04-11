// hooks/usePostById.ts
import { useQuery } from '@tanstack/react-query';
import { getTeamPostById } from '../api/catalogue.api.ts';

export function usePostById(id: number | undefined) {
  return useQuery({
    queryKey: ['team-post', id],
    queryFn: () => getTeamPostById(id!),
    enabled: id !== undefined && id > 0, // only fires when id is valid
    staleTime: 5 * 60 * 1000, // 5 minutes — consistent with your Redis TTL
  });
}