import {useQuery} from "@tanstack/react-query";
import type {LicensePlansPayload} from "../api/mylicensing.types.ts";
import {getLicensePlans} from "../api/mylicensing.api.ts";

export function useGetLicensePlans() {
  return useQuery<LicensePlansPayload[], Error>({
    queryKey: ['sponsorship-rates'],
    queryFn: getLicensePlans,
    // Optional: Keep the rates in cache for 24 hours as they don't change often
    staleTime: 1000 * 60 * 60 * 24,
  });
}