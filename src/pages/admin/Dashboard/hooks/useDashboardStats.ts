import { useQuery } from '@tanstack/react-query';
import {
    getDashboardStats,
} from '../api/dashboard.api';
import type { DashboardStats, DashboardStatsParams } from '../api/dashboard.types';

export function useDashboardStats(params: DashboardStatsParams) {
  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats', params], //refetch when date changes
    queryFn: () => getDashboardStats(params),
    staleTime: 60_000, //1 min
  });
}
