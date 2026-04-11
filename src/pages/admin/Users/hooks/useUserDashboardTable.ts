import { useQuery } from '@tanstack/react-query';
import { fetchUserDashboardTable } from '../api/users.api';
import type {

  ApiResponse,
  Paged,
  UserTableApiRow,
  UserTableParams,
} from '../api/users.types';

export function useUserDashboardTable(params: UserTableParams) {
  return useQuery<ApiResponse<Paged<UserTableApiRow>>>({
    queryKey: [
      'user-dashboard-table',
      params.start_date,
      params.end_date,
      params.page,
      params.page_size,
      params.search ?? '',
    ],
    queryFn: () => fetchUserDashboardTable(params),
    staleTime: 60_000,
    retry: 1,
  });
}
