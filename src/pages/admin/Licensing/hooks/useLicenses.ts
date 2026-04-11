import { useQuery } from "@tanstack/react-query";
import { fetchLicenses } from "../api/licensing.api.ts";
import type { FetchLicensesParams, LicensePayload } from "../api/licensing.types.ts";


export function useLicenses(params: FetchLicensesParams) {
      const { start_date, end_date, page, page_size, search } = params;


       return useQuery<LicensePayload>({
         queryKey: [
           'licenses',
           start_date,
           end_date,
           page,
           page_size,
           search ?? '',
         ],
         queryFn: () => fetchLicenses(params),
         enabled: !!start_date && !!end_date && page > 0 && page_size > 0,
         staleTime: 60_000,
       });

}