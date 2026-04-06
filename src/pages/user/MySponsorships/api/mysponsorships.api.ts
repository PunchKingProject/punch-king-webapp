import { customFetch } from "../../../../Axios.ts";
import type {
  CreateSponsorPurchaseRequest,
  CreateSponsorPurchaseResponse,
  Envelope,
  PurchaseHistoryParams,
  PurchaseHistoryPayload,
  SponsorshipRate,
  SponsorshipRatesResponse
} from "./mysponsorships.types.ts";

// ADD this function (leave existing exports as-is)
/**
 * Create a sponsorship purchase request.
 * - Uploads slip file to /img -> gets a URL
 * - Builds JSON body:
 *   - payment_date: today (00:00:00Z)
 *   - payment_amount, points: from caller
 *   - payment_slip: uploaded URL
 *   - source_*: HARD-CODED as requested
 * - Returns void (component handles toasts)
 */
export async function getPurchaseHistory(
  params: PurchaseHistoryParams
): Promise<PurchaseHistoryPayload> {
  const { data } = await customFetch.get<Envelope<PurchaseHistoryPayload>>(
    '/sponsorship/users-purchase-history',
    { params }
  );
  return data.data;
}

export async function createSponsorPurchase(
    body: CreateSponsorPurchaseRequest
): Promise<CreateSponsorPurchaseResponse> {
  const { data } = await customFetch.post<CreateSponsorPurchaseResponse>(
      '/sponsorship/purchase',
      body
  );

  return data;
}

export async function getSponsorshipRates(): Promise<SponsorshipRate[]> {
  const { data } = await customFetch.get<SponsorshipRatesResponse>('/sponsorship/rate/');

  // 2. Return the inner 'data' array (e.g., the [ {id: 1...}, {id: 2...} ] part)
  return data.data;
}