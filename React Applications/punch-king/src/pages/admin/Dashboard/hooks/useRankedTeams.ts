import { useQuery } from "@tanstack/react-query";
import { fetchRankedTeams } from "../api/dashboard";

export type RankedTeam = {
  team_id: number;
  team_name: string;
  license_number: string;
  sponsorships: number;
  rank: number;
};

export type RankedTeamsParams = {
  page: number; // 1-based
  page_size: number;
  search?: string;
};

export function useRankedTeams(params: RankedTeamsParams) {
    return useQuery({
        queryKey: ['ranked-teams', params.page, params.page_size, params.search],
        queryFn: () => fetchRankedTeams(params),
        staleTime: 60_000, // cache for 1 min
        select: (resp) => ({
            rows: resp.data.data as RankedTeam[],
            meta: resp.data.metadata
        }),
        retry: 1
    })
}