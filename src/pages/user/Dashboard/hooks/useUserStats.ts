import { useQuery } from "@tanstack/react-query";
import type { UserStatsParams } from "../api/dashboard.types";
import { getUserStats } from "../api/dashboard.api";

export function useUserStats(params: UserStatsParams) {
  const { start_date, end_date } = params;
  return useQuery({
    queryKey: ['user-stats', start_date, end_date],
    queryFn: () => getUserStats(params),
  });
}
