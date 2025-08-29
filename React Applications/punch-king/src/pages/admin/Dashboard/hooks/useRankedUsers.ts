import { useQuery } from '@tanstack/react-query';
import {
  fetchRankedUsers,
  type RankedUsersParams,
  type RankedUsersResponse,
} from '../api/dashboard';

export function useRankedUsers(params: RankedUsersParams) {
  return useQuery({
    queryKey: [
      'ranked-users',
      params.page,
      params.page_size,
      params.search ?? '',
    ],
    queryFn: () => fetchRankedUsers(params),
    staleTime: 60_000,
    select: (resp: RankedUsersResponse) => ({
      rows: resp.data.data,
      meta: resp.data.metadata,
    }),
  });
}
