import { useQuery } from "@tanstack/react-query";
import type { FetchTeamLicenseHistoryParams, TeamLicenseHistoryResponse } from "../api/licensing.types";
import { fetchTeamLicenseHistory } from "../api/licensing.api";


export function useTeamLicenseHistory(params: FetchTeamLicenseHistoryParams) {
      const { team_id, page, page_size, start_date, end_date, search } = params;

      return useQuery<TeamLicenseHistoryResponse>({
        queryKey: [
          'team-license-history',
          team_id,
          page,
          page_size,
          start_date,
          end_date,
          search ?? '',
        ],
        queryFn: () => fetchTeamLicenseHistory(params),
        enabled:
          Number.isFinite(team_id) && team_id > 0 && !!start_date && !!end_date,
          staleTime: 60_000
      });
}