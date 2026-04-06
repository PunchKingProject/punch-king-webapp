// src/pages/user/MySponsorships/hooks/useGetSponsorshipRates.ts
import { useQuery } from '@tanstack/react-query';
import { getSponsorshipRates } from '../api/mysponsorships.api.ts';
import type {SponsorshipRate} from "../api/mysponsorships.types.ts";

export function useGetSponsorshipRates() {
    return useQuery<SponsorshipRate[], Error>({
        queryKey: ['sponsorship-rates'],
        queryFn: getSponsorshipRates,
        // Optional: Keep the rates in cache for 24 hours as they don't change often
        staleTime: 1000 * 60 * 60 * 24,
    });
}