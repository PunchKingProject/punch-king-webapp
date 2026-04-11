// pages/team/Dashboard/hooks/useMySubscriptions.ts
import { useQuery } from '@tanstack/react-query';
import { getMySubscriptions } from '../api/dashboard.api';
import type { FetchMySubsParams, TeamSubPayload } from '../api/dashboard.types';

export function useMySubscriptions(params: FetchMySubsParams) {
  const enabled =
    !!params.start_date &&
    !!params.end_date &&
    Number.isFinite(params.page) &&
    Number.isFinite(params.page_size);

  return useQuery<TeamSubPayload>({
    queryKey: ['my-subs-history', params],
    queryFn: () => getMySubscriptions(params),
    enabled,
    staleTime: 60_000,
  });
}
