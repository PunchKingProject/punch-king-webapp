import { useQuery } from "@tanstack/react-query";
import type { FetchTeamSubHistoryParams, TeamSubHistoryResponse } from "../api/subscriptions.types.ts";
import { fetchTeamSubHistory } from "../api/subscriptions.api.ts";

export function useTeamSubHistory(params: FetchTeamSubHistoryParams) {
  const enabled =
    Number.isFinite(params.team_id) &&
    params.team_id > 0 &&
    !!params.start_date &&
    !!params.end_date;

  return useQuery<TeamSubHistoryResponse>({
    queryKey: ['team-sub-history', params],
    queryFn: () => fetchTeamSubHistory(params),
    enabled,
    staleTime: 60_000,
  });
}
