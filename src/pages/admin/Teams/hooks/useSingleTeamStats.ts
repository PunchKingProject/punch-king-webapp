
import { useQuery } from "@tanstack/react-query";
import type { SingleTeamStats, SingleTeamStatsParams } from "../api/teams.types.ts";
import { getSingleTeamStats } from "../api/teams.api.ts";


export function useSingleTeamStats(params: SingleTeamStatsParams) {
  const { team_id, start_date, end_date } = params;

  return useQuery<SingleTeamStats>({
    queryKey: ['single-team-stats', team_id, start_date, end_date],
    queryFn: () => getSingleTeamStats(params),
    staleTime: 60_000,
    enabled: Number.isFinite(team_id) && !!start_date && !!end_date, // avoid firing without inputs
    retry: 1
  });
}