import { customFetch } from '../../../../Axios.ts';
import type {
  DashboardStats,
  DashboardStatsParams,
  Envelope,
  Paged,
  RankedTeam,
  RankedTeamsParams,
  RankedUser,
  RankedUsersParams,
} from './dashboard.types.ts';

export async function getDashboardStats(
  params: DashboardStatsParams
): Promise<DashboardStats> {
  const { data } = await customFetch.get<Envelope<DashboardStats>>(
    '/user/dashboard-stats',
    { params }
  );
  return data.data;
}

export async function fetchRankedTeams(params: RankedTeamsParams) {
  const { data } = await customFetch.get<Envelope<Paged<RankedTeam>>>(
    '/user/ranked-team',
    {
      params: {
        search: params.search ?? '',
        page: params.page,
        page_size: params.page_size,
      },
    }
  );
  return data; // keep envelope shape for hooks.select
}

export async function fetchRankedUsers(params: RankedUsersParams) {
  const { data } = await customFetch.get<Envelope<Paged<RankedUser>>>(
    '/user/ranked-user',
    {
      params: {
        search: params.search ?? '',
        page: params.page,
        page_size: params.page_size,
      },
    }
  );
  return data; // keep envelope shape for hooks.select
}
