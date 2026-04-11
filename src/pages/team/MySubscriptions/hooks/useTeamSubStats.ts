import { useQuery } from "@tanstack/react-query";
import type { TeamSubStats, TeamSubStatsParams } from "../api/mysubscriptions.types.ts";
import { getTeamSubStats } from "../api/mysubscriptions.api.ts";

export function useTeamSubStats(params: TeamSubStatsParams) {
  return useQuery<TeamSubStats, Error>({
    queryKey: ['team-sub-stats', params],
    queryFn: () => getTeamSubStats(params),
    staleTime: 60_000,
  });
}
