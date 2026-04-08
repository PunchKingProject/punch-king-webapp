import { useQuery } from '@tanstack/react-query';
import type { TeamLicenseStats } from '../api/mylicensing.types';
import { fetchTeamLicenseStats } from '../api/mylicensing.api';

export function useTeamLicenseStats(params: {
  start_date: string;
  end_date: string;
}) {
  return useQuery<TeamLicenseStats>({
    queryKey: ['team-license-stats', params],
    queryFn: () => fetchTeamLicenseStats(params),
  });
}

