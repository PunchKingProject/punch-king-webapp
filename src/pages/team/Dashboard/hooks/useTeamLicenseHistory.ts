import { useQuery } from "@tanstack/react-query";
import type { FetchTeamLicenseHistoryParams, TeamLicenseHistory } from "../api/dashboard.types";
import { getTeamLicenseHistory } from "../api/dashboard.api";

export function useTeamLicenseHistory(params: FetchTeamLicenseHistoryParams) {
  const enabled =
    Number.isFinite(params.page) &&
    Number.isFinite(params.page_size);

  return useQuery<TeamLicenseHistory>({
    queryKey: ['team-license-history', params],
    queryFn: () => getTeamLicenseHistory(params),
    enabled,
    staleTime: 60_000,
  });
}
