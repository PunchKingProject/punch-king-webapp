import { useQuery } from '@tanstack/react-query';
import { getTeamSponsorshipStats } from '../api/mySponsorship.api';
import type {
  TeamSponsorshipStats,
  TeamSponsorshipStatsParams,
} from '../api/mySponsorship.types';

export function useTeamSponsorshipStats(params: TeamSponsorshipStatsParams) {
  const enabled = !!params.start_date && !!params.end_date;

  return useQuery<TeamSponsorshipStats>({
    queryKey: ['team-sponsorship-stats', params],
    queryFn: () => getTeamSponsorshipStats(params),
    enabled,
    staleTime: 60_000,
  });
}
