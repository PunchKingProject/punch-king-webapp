import { useQuery } from '@tanstack/react-query';
import { fetchRankedTeams } from '../api/dashboard.api';
import type { Envelope, Paged, RankedTeam, RankedTeamsParams } from '../api/dashboard.types';




export function useRankedTeams(params: RankedTeamsParams) {
  return useQuery<Envelope<Paged<RankedTeam>>>({
    queryKey: ['ranked-teams', params.page, params.page_size, params.search],
    queryFn: () => fetchRankedTeams(params),
    staleTime: 60_000, // cache for 1 min
    retry: 1,
  });
}
