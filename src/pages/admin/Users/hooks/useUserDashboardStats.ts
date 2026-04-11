import { useQuery } from '@tanstack/react-query';
import { getUserDashboardStats } from '../api/users.api';
import type {
  UserDashboardStats,
  UserDashboardStatsParams,
} from '../api/users.types';

export function useUserDashboardStats(params: UserDashboardStatsParams) {
  return useQuery<UserDashboardStats>({
    queryKey: ['user-dashboard-stats', params],
    queryFn: () => getUserDashboardStats(params),
    staleTime: 60_000,
  });
}
