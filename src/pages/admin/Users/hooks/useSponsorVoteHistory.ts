import { useQuery } from "@tanstack/react-query";
import type { FetchSponsorVoteHistoryParams, SponsorVoteHistoryResponse } from "../api/users.types";
import { fetchSponsorVoteHistory } from "../api/users.api";




export function useSponsorVoteHistory(params: FetchSponsorVoteHistoryParams) {
  const { sponsor_id, page, page_size, start_date, end_date, search } = params;

  return useQuery<SponsorVoteHistoryResponse>({
    queryKey: [
      'sponsor-vote-history',
      sponsor_id,
      page,
      page_size,
      start_date,
      end_date,
      search ?? '',
    ],
    queryFn: () => fetchSponsorVoteHistory(params),
    enabled:
      Number.isFinite(sponsor_id) &&
      sponsor_id > 0 &&
      !!start_date &&
      !!end_date,
    staleTime: 60_000,
  });
}