import { useQuery } from '@tanstack/react-query';
import { getSponsorshipPurchase } from '../api/sponsorships.api';
import type { SponsorshipDetails } from '../api/sponsorships.types';

export function useSponsorshipPurchase(purchase_id: number | null) {
  return useQuery<SponsorshipDetails>({
    queryKey: ['sponsorship', 'purchase', purchase_id],
    queryFn: () => getSponsorshipPurchase(purchase_id as number),
    enabled: Number.isFinite(purchase_id ?? NaN),
    staleTime: 60_000,
  });
}
