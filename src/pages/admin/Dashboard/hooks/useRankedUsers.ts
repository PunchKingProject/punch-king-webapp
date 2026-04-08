import { useQuery } from '@tanstack/react-query';
import {
  fetchRankedUsers,

} from '../api/dashboard.api';
import type { Envelope, Paged, RankedUser, RankedUsersParams } from '../api/dashboard.types';

export function useRankedUsers(params: RankedUsersParams) {
  return useQuery<Envelope<Paged<RankedUser>>>({
    queryKey: [
      'ranked-users',
      params.page,
      params.page_size,
      params.search ?? '',
    ],
    queryFn: () => fetchRankedUsers(params),
    staleTime: 60_000,
  });
}
