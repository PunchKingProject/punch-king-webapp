import { useQuery } from '@tanstack/react-query';
import type {
  FetchUserPurchaseHistoryParams,
  UserPurchaseHistoryResponse,
} from '../api/users.types';
import { fetchUserPurchaseHistory } from '../api/users.api';

export function useUserPurchaseHistory(params: FetchUserPurchaseHistoryParams) {
  const { sponsor_id, page, page_size, start_date, end_date, search } = params;

  return useQuery<UserPurchaseHistoryResponse>({
    queryKey: [
      'user-purchase-history',
      sponsor_id,
      page,
      page_size,
      start_date,
      end_date,
      search ?? '',
    ],
    queryFn: () => fetchUserPurchaseHistory(params),
    enabled:
      Number.isFinite(sponsor_id) &&
      sponsor_id > 0 &&
      !!start_date &&
      !!end_date,
    staleTime: 60_000,
  });
}
