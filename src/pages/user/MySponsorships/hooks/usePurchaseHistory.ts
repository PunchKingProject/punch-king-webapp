import { useQuery } from "@tanstack/react-query";
import { getPurchaseHistory } from "../api/mysponsorships.api";
import type { FetchPurchaseHistoryParams, PurchaseHistoryPayload } from "../api/mysponsorships.types";



export function usePurchaseHistory(params: FetchPurchaseHistoryParams) {
  return useQuery<PurchaseHistoryPayload>({
    queryKey: ['purchase-history', params],
    queryFn: () => getPurchaseHistory(params),

  });
}