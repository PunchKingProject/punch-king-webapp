import { customFetch } from '../../../../Axios';
import type {
  ApiEnvelope,
  FetchSponsorshipsParams,
  FetchSponsorVoteHistoryParams,
  SponsorPurchaseHistoryEnvelope,
  SponsorPurchaseHistoryPayload,
  SponsorPurchaseHistoryQueryArgs,
  SponsorshipApiRow,
  SponsorshipDetails,
  SponsorshipPayload,
  SponsorVoteHistoryPayload,
  UpdateSponsorshipStatusBody,
} from './sponsorships.types';

// GET /sponsorship/purchase-history?search=&page=1&page_size=10&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
export async function fetchSponsorships(
  params: FetchSponsorshipsParams
): Promise<SponsorshipPayload> {
  const { data } = await customFetch.get<ApiEnvelope<SponsorshipPayload>>(
    '/sponsorship/purchase-history',
    { params }
  );
  // Your example shows { meta, data: { cards, table } }
  return data.data;
}


// GET details for a single purchase (adjust path if yours differs)
export async function getSponsorshipPurchase(purchase_id: number): Promise<SponsorshipDetails> {
  const { data } = await customFetch.get<ApiEnvelope<SponsorshipDetails>>(
    `/sponsorship/purchase-history/${purchase_id}`
  );
  return data.data;
}

/**
 * DETAILS SOURCE OF TRUTH (like subscription history)
 * GET /sponsorship/users-purchase-history?page=&page_size=&sponsor_id=&start_date=&end_date=
 * Returns { meta, data: { data: SponsorshipApiRow[], metadata: PageMeta } }
 */
export async function fetchSponsorPurchaseHistory(
  params: SponsorPurchaseHistoryQueryArgs
): Promise<SponsorPurchaseHistoryPayload> {
  const { data } = await customFetch.get<SponsorPurchaseHistoryEnvelope>(
    '/sponsorship/users-purchase-history',
    { params }
  );
  return data.data; // { data: [...], metadata: {...} }
}

/**
 * Helper: find a single purchase row by id from the history list.
 * Useful when deep-linking a :purchase_id but the backend doesn’t expose /:id.
 *
 * NOTE: If the purchase isn’t on the current page, you may need to request a bigger page_size
 * or paginate until found. This helper checks only the provided page.
 */
export async function getSponsorshipPurchaseFromHistory(
  purchase_id: number,
  params: SponsorPurchaseHistoryQueryArgs
): Promise<SponsorshipApiRow | null> {
  const payload = await fetchSponsorPurchaseHistory(params);
  return payload.data.find((r) => r.id === purchase_id) ?? null;
}

// POST update for payment/purchase status
export async function updateSponsorshipStatus(body: UpdateSponsorshipStatusBody): Promise<unknown> {
  const { data } = await customFetch.patch<ApiEnvelope<unknown>>(
    '/sponsorship/purchase',
    body
  );
  return data.data;
}


export async function fetchSponsorVoteHistory(
  params: FetchSponsorVoteHistoryParams
): Promise<SponsorVoteHistoryPayload> {
  const { data } = await customFetch.get<
    ApiEnvelope<SponsorVoteHistoryPayload>
  >('/sponsorship/sponsor-vote-history', { params });
  return data.data;
}