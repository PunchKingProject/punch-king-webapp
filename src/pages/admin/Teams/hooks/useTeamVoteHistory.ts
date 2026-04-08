import { useQuery } from "@tanstack/react-query";
import type { VoteHistoryEnvelope, VoteHistoryParams } from "../api/teams.types";
import { fetchTeamVoteHistory } from "../api/teams.api";


export function useTeamVoteHistory(params: VoteHistoryParams) {
  return useQuery<VoteHistoryEnvelope>({
    queryKey: [
      'team-vote-history',
      params.team_id,
      params.page,
      params.page_size,
      params.search ?? '',
      params.start_date,
      params.end_date,
    ],
    queryFn: () => fetchTeamVoteHistory(params),
    staleTime: 60_000,
  });
}