import { useQuery } from '@tanstack/react-query';
import type { TeamLicenseStats } from '../api/mylicensing.types.ts';
import { fetchTeamLicenseStats } from '../api/mylicensing.api.ts';

export function useTeamLicenseStats(params: {
  start_date: string;
  end_date: string;
}) {
  return useQuery<TeamLicenseStats>({
    queryKey: ['team-license-stats', params],
    queryFn: () => fetchTeamLicenseStats(params),
  });
}

