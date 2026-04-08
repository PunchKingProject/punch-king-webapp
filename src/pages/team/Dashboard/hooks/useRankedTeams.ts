import { useQuery } from "@tanstack/react-query";
import type { FetchRankedTeamsParams, RankedTeamsPayload } from "../api/dashboard.types";
import { getRankedTeams } from "../api/dashboard.api";


export function useRankedTeams(params: FetchRankedTeamsParams) {
  const enabled =
    Number.isFinite(params.page) && Number.isFinite(params.page_size);

  return useQuery<RankedTeamsPayload>({
    queryKey: ['ranked-teams', params],
    queryFn: () => getRankedTeams(params),
    enabled,
    staleTime: 60_000,
  });
}