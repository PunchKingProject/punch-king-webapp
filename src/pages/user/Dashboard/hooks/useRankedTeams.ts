import { useQuery } from "@tanstack/react-query";
import type { FetchRankedTeamsParams } from "../api/dashboard.types";
import { getRankedTeams } from "../api/dashboard.api";



export function useRankedTeams(params: FetchRankedTeamsParams) {
  const { page, page_size, search } = params;
  return useQuery({
    queryKey: ['ranked-teams', page, page_size, search ?? ''],
    queryFn: () => getRankedTeams(params),
  });
}