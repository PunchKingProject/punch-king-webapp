import { customFetch } from '../../../../Axios';

export type DashboardStatsParams = {
  start_date: string; //YYYY-MM-DD
  end_date: string; //YYYY-MM-DD
};

export type DashboardStats = {
  sponsor_count: number;
  team_count: number;
  subscriptions_in_range: number;
  licenses_in_range: number;
  sponsorship_purchases_range: number;
};

export type DashboardStatsResponse = {
  meta: { message: string; code: number; status: string };
  data: DashboardStats;
};

export async function getDashboardStats(
  params: DashboardStatsParams
): Promise<DashboardStats> {
  const { data } = await customFetch.get('/user/dashboard-stats', {
    params,
  });

  return data.data;
}

export type RankedTeam = {
  team_id: number;
  team_name: string;
  license_number: string;
  sponsorships: number;
  rank: number;
};

export type RankedTeamsResponse = {
  meta: { message: string; code: number; status: string };
  data: {
    data: RankedTeam[];
    metadata: {
      current_page: number;
      page_size: number;
      total_count: number;
      last_page: number;
    };
  };
};

export type RankedTeamsParams = {
  page: number;
  page_size: number;
  search?: string;
};

export async function fetchRankedTeams(params: RankedTeamsParams) {
  const { data } = await customFetch.get<RankedTeamsResponse>(
    '/user/ranked-team',
    {
      params: {
        search: params.search ?? '',
        page: params.page,
        page_size: params.page_size,
      },
    }
  );

  return data;
}



export type RankedUser = {
  user_id: number;
  name: string;
  email: string;
  phone_number: string;
  total_points_purchased: number;
  total_amount_sponsored: number;
};

export type RankedUsersResponse = {
  meta: { message: string; code: number; status: string };
  data: {
    data: RankedUser[];
    metadata: {
      current_page: number;
      page_size: number;
      total_count: number;
      last_page: number;
    };
  };
};

export type RankedUsersParams = {
  page: number; // 1-based
  page_size: number;
  search?: string;
};

export async function fetchRankedUsers(params: RankedUsersParams) {
  const { data } = await customFetch.get<RankedUsersResponse>(
    '/user/ranked-user',
    {
      params: {
        search: params.search ?? '',
        page: params.page,
        page_size: params.page_size,
      },
    }
  );

  return data; // keep same return shape as fetchRankedTeams
}