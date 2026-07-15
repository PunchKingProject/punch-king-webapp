import { useQuery } from "@tanstack/react-query";
import { apiGetSingleUsersStats } from "../api/users.api";
import type { SingleUserStats, UseSingleUserStatsArgs } from "../api/users.types";

export function useSingleUserStats(args: UseSingleUserStatsArgs) {
  return useQuery<SingleUserStats>({
    queryKey: [
      "user-details-stats",
      args.sponsor_id,
      args.start_date,
      args.end_date,
    ],
    queryFn: () => apiGetSingleUsersStats(args),
    enabled: args.sponsor_id > 0,
    staleTime: 60_000,
  });
}