import { customFetch } from "../../../../Axios";
import type { CreateSponsorPurchaseRequest, Envelope, PurchaseHistoryItem, PurchaseHistoryParams, PurchaseHistoryPayload } from "./mysponsorships.types";

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
 const payload = data.data;

 return {
   data: Array.isArray(payload?.data)
     ? (payload!.data as PurchaseHistoryItem[])
     : [], // ⬅︎ null → []
   metadata: payload?.metadata ?? {
     current_page: 1,
     page_size: params.page_size,
     total_count: 0,
     last_page: 0,
   },
 };
}

export async function createSponsorPurchase(
  body: CreateSponsorPurchaseRequest
): Promise<void> {
  await customFetch.post('/sponsorship/purchase', body);
}