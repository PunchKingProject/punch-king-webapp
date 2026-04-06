// pages/admin/Subscription/hooks/useSubscriptions.ts
import { useQuery } from '@tanstack/react-query';
import { fetchSubscriptions } from '../api/subscriptions.api.ts';
import type { FetchSubsParams, SubPayload } from '../api/subscriptions.types.ts';

export function useSubscriptions(params: FetchSubsParams) {
  return useQuery<SubPayload>({
    queryKey: [
      'subs',
      params.start_date,
      params.end_date,
      params.page,
      params.page_size,
      params.search ?? '',
    ],
    queryFn: () => fetchSubscriptions(params),
    staleTime: 60_000,
    enabled:
      !!params.start_date &&
      !!params.end_date &&
      Number.isFinite(params.page) &&
      Number.isFinite(params.page_size),
  });
}
