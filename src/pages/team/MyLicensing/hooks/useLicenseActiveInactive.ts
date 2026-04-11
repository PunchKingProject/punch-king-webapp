import { useQuery } from "@tanstack/react-query";
import type { FetchLicenseHistoryListParams, LicenseHistoryList } from "../api/mylicensing.types.ts";
import { getLicenseActiveInactive } from "../api/mylicensing.api.ts";


export function useLicenseActiveInactive(
  params: FetchLicenseHistoryListParams
) {
  return useQuery<LicenseHistoryList, Error>({
    queryKey: ['license-active-inactive', params],
    queryFn: () => getLicenseActiveInactive(params),

  });
}