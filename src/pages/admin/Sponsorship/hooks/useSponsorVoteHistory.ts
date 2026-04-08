import { useQuery } from "@tanstack/react-query";
import { fetchSponsorVoteHistory } from "../api/sponsorships.api";
import type { FetchSponsorVoteHistoryParams, SponsorVoteHistoryPayload } from "../api/sponsorships.types";


export function useSponsorVoteHistory(params: FetchSponsorVoteHistoryParams

) {
  return useQuery<SponsorVoteHistoryPayload>({
    queryKey: ['sponsor-vote-history', params],
    queryFn: () => fetchSponsorVoteHistory(params),
    staleTime: 60_000,
  });
}