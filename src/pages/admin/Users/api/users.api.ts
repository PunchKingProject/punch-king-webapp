import { customFetch } from '../../../../Axios.ts';
import type {
  ApiResponse,
  FetchSponsorVoteHistoryParams,
  FetchUserPurchaseHistoryParams,
  Paged,
  SingleUserStats,
  SponsorVoteHistoryResponse,
  UpdateUserPayload,
  UserDashboardStats,
  UserDashboardStatsParams,
  UserProfile,
  UserPurchaseHistoryResponse,
  UserTableApiRow,
  UserTableParams,
} from './users.types.ts';

export async function getUserDashboardStats(
  params: UserDashboardStatsParams
): Promise<UserDashboardStats> {
  const { data } = await customFetch.get<ApiResponse<UserDashboardStats>>(
    '/user/user-dashboard-stats',
    { params }
  );
  return data.data;
}

export async function fetchUserDashboardTable(params: UserTableParams) {
  const { data } = await customFetch.get<ApiResponse<Paged<UserTableApiRow>>>(
    '/user/user-dashboard-table',
    {
      params: {
        start_date: params.start_date,
        end_date: params.end_date,
        search: params.search ?? '',
        page: params.page,
        page_size: params.page_size,
      },
    }
  );
  return data; // keep the Envelope for hooks .select
}

export const apiGetSingleUsersStats = async (args: {
  sponsor_id: number;
  start_date?: string;
  end_date?: string;
}) => {
  const { sponsor_id, start_date, end_date } = args;
  // Build params explicitly
  const params: Record<string, string> = {
    sponsor_id: String(sponsor_id),
  };
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;

  const { data } = await customFetch.get<ApiResponse<SingleUserStats>>(
    '/user/single-user-stats',
    { params }
  );

  return data.data;
};

// GET /user/:id
export async function fetchUserProfile(
  sponsor_id: number
): Promise<UserProfile> {
  const res = await customFetch.get<ApiResponse<UserProfile>>(
    `/user/${sponsor_id}`
  );
  return res.data.data;
}

// PATCH /user/edit/:id
export async function patchUserProfile(
  sponsor_id: number,
  payload: UpdateUserPayload
): Promise<UserProfile> {
  const { data } = await customFetch.patch<ApiResponse<UserProfile>>(
    `/user/edit/${sponsor_id}`,
    payload
  );
  return data.data;
}

export async function fetchUserPurchaseHistory(
  params: FetchUserPurchaseHistoryParams
): Promise<UserPurchaseHistoryResponse> {
  const res = await customFetch.get<ApiResponse<UserPurchaseHistoryResponse>>(
    '/sponsorship/users-purchase-history',
    { params }
  );
  return res.data.data;
}

export async function fetchSponsorVoteHistory(
  params: FetchSponsorVoteHistoryParams
): Promise<SponsorVoteHistoryResponse> {
  const res = await customFetch.get<ApiResponse<SponsorVoteHistoryResponse>>(
    '/sponsorship/sponsor-vote-history',
    { params }
  );
  return res.data.data;
}