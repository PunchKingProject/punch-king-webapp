import { useQuery } from '@tanstack/react-query';
import { getSponsorshipPurchase } from '../api/sponsorships.api.ts';
import type { SponsorshipDetails } from '../api/sponsorships.types.ts';

export function useSponsorshipPurchase(purchase_id: number | null) {
  return useQuery<SponsorshipDetails>({
    queryKey: ['sponsorship', 'purchase', purchase_id],
    queryFn: () => getSponsorshipPurchase(purchase_id as number),
    enabled: Number.isFinite(purchase_id ?? NaN),
    staleTime: 60_000,
  });
}
