// src/pages/admin/Sponsorships/hooks/useSponsorPurchaseHistory.ts
import { useQuery } from '@tanstack/react-query';
import { fetchSponsorPurchaseHistory } from '../api/sponsorships.api';
import type {
  SponsorPurchaseHistoryPayload,
  SponsorPurchaseHistoryQueryArgs,
} from '../api/sponsorships.types';

/**
 * GET /sponsorship/users-purchase-history
 * Mirrors subscription’s team history hook.
 */
export function useSponsorPurchaseHistory(
  args: SponsorPurchaseHistoryQueryArgs
) {
  const { sponsor_id, start_date, end_date, page, page_size } = args;

  return useQuery({
    queryKey: [
      'sponsor-purchase-history',
      sponsor_id,
      start_date,
      end_date,
      page,
      page_size,
    ],
    queryFn: async (): Promise<SponsorPurchaseHistoryPayload> =>
      fetchSponsorPurchaseHistory({
        sponsor_id,
        start_date,
        end_date,
        page,
        page_size,
      }),
    enabled: Boolean(sponsor_id && start_date && end_date),
  });
}
