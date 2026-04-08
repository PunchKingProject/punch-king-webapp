import { useQuery } from '@tanstack/react-query';
import type {
  TeamDashboardStats,
  TeamDashboardStatsParams,
} from '../api/teams.types';
import { getTeamDashboardStats } from '../api/teams.api';

export function useTeamDashboardStats(params: TeamDashboardStatsParams) {
  return useQuery<TeamDashboardStats>({
    queryKey: ['teamDashboardStats', params],
    queryFn: () => getTeamDashboardStats(params),
    staleTime: 60_000,
  });
}
