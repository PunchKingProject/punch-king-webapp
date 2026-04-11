import { useQuery } from "@tanstack/react-query";
import type { FetchTeamVoteHistoryParams, TeamVoteHistory } from "../api/dashboard.types";
import { getTeamVoteHistory } from "../api/dashboard.api";




export function useTeamVoteHistory(params: FetchTeamVoteHistoryParams) {
  const enabled =

    !!params.start_date &&
    !!params.end_date &&
    Number.isFinite(params.page) &&
    Number.isFinite(params.page_size);

  return useQuery<TeamVoteHistory>({
    queryKey: ['team-vote-history', params],
    queryFn: () => getTeamVoteHistory(params),
    enabled, //only fetch if we have a valid team id and dates
    staleTime: 60_000, //1 min
  });
}