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
  AdminManagedUser,
  AdminActionPayload,
  FeatureAccessPayload,
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

// GET /user/admin/:id
export async function fetchAdminUser(
  userId: number
): Promise<AdminManagedUser> {
  const res = await customFetch.get<ApiResponse<AdminManagedUser>>(
    `/user/admin/${userId}`
  );

  return res.data.data;
}

// -----------------------------------------------------------------------------
// Temporary Compatibility Wrappers
// These keep the existing frontend working while we migrate pages one-by-one.
// Remove them after every component has been updated.
// -----------------------------------------------------------------------------

export async function fetchUserProfile(
  sponsor_id: number
): Promise<UserProfile> {
  return (await fetchAdminUser(sponsor_id)) as UserProfile;
}

export async function patchUserProfile(
  sponsor_id: number,
  payload: UpdateUserPayload
): Promise<UserProfile> {
  return (await patchAdminUser(
    sponsor_id,
    payload
  )) as UserProfile;
}

// PATCH /user/admin/:id/edit
export async function patchAdminUser(
  userId: number,
  payload: UpdateUserPayload
): Promise<AdminManagedUser> {
  const { data } =
    await customFetch.patch<ApiResponse<AdminManagedUser>>(
      `/user/admin/${userId}/edit`,
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

export async function blockUser(
  userId: number,
  payload: AdminActionPayload
): Promise<AdminManagedUser> {
  const { data } =
    await customFetch.patch<ApiResponse<AdminManagedUser>>(
      `/user/admin/${userId}/block`,
      payload
    );

  return data.data;
}

export async function unblockUser(
  userId: number,
  payload: AdminActionPayload
): Promise<AdminManagedUser> {
  const { data } =
    await customFetch.patch<ApiResponse<AdminManagedUser>>(
      `/user/admin/${userId}/unblock`,
      payload
    );

  return data.data;
}

export async function deactivateUser(
  userId: number,
  payload: AdminActionPayload
): Promise<AdminManagedUser> {
  const { data } =
    await customFetch.patch<ApiResponse<AdminManagedUser>>(
      `/user/admin/${userId}/deactivate`,
      payload
    );

  return data.data;
}

export async function reactivateUser(
  userId: number,
  payload: AdminActionPayload
): Promise<AdminManagedUser> {
  const { data } =
    await customFetch.patch<ApiResponse<AdminManagedUser>>(
      `/user/admin/${userId}/reactivate`,
      payload
    );

  return data.data;
}

export async function deleteUser(
  userId: number,
  payload: AdminActionPayload
): Promise<void> {
  await customFetch.delete(
    `/user/admin/${userId}`,
    {
      data: payload,
    }
  );
}

export async function restoreUser(
  userId: number,
  payload: AdminActionPayload
): Promise<AdminManagedUser> {
  const { data } =
    await customFetch.patch<ApiResponse<AdminManagedUser>>(
      `/user/admin/${userId}/restore`,
      payload
    );

  return data.data;
}

export async function setFeatureAccess(
  userId: number,
  payload: FeatureAccessPayload
): Promise<AdminManagedUser> {
  const { data } =
    await customFetch.patch<ApiResponse<AdminManagedUser>>(
      `/user/admin/${userId}/feature-access`,
      payload
    );

  return data.data;
}

export async function deleteAdminUser(userId: number) {
  // We send the 'reason' in the 'data' property of the config object for axios.delete
  const { data } = await customFetch.delete(`/user/admin/${userId}`, {
    data: {
      reason: "Deleted by Administrator via Users Dashboard"
    }
  });
  return data;
}