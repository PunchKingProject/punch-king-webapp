// src/pages/admin/Sponsorships/hooks/useSponsorshipPurchase.ts
import { useQuery } from '@tanstack/react-query';
import { getSponsorshipPurchaseFromHistory } from '../api/sponsorships.api';
import type {
  SponsorPurchaseHistoryQueryArgs,
  SponsorshipApiRow,
} from '../api/sponsorships.types';

type Args = Omit<SponsorPurchaseHistoryQueryArgs, 'page' | 'page_size'> & {
  page?: number; // defaults to 1
  page_size?: number; // defaults to 50
};

/**
 * Finds a single purchase row by id by querying the users-purchase-history list.
 * If not found on that page, returns null.
 */
export function useSponsorshipPurchase(purchase_id: number | null, args: Args) {
  const { sponsor_id, start_date, end_date, page = 1, page_size = 50 } = args;

  return useQuery({
    queryKey: [
      'sponsorship',
      'purchase',
      purchase_id,
      sponsor_id,
      start_date,
      end_date,
      page,
      page_size,
    ],
    queryFn: async (): Promise<SponsorshipApiRow | null> => {
      if (!purchase_id) return null;
      return getSponsorshipPurchaseFromHistory(purchase_id, {
        sponsor_id,
        start_date,
        end_date,
        page,
        page_size,
      });
    },
    enabled: Boolean(purchase_id && sponsor_id && start_date && end_date),
  });
}
