// pages/admin/Subscription/api/subscriptions.api.ts
import { customFetch } from '../../../../Axios';
import type {
  ApiEnvelope,
  FetchSubsParams,
  FetchTeamSubHistoryParams,
  SubPayload,
  TeamSubHistoryResponse,
  UpdateSubStatusPayload,
} from './subscriptions.types';

export async function fetchSubscriptions(
  params: FetchSubsParams
): Promise<SubPayload> {
  const { data } = await customFetch.get<ApiEnvelope<SubPayload>>('/sub/', {
    params,
  });
  return data.data;
}


// assuming team history mirrors licensing: GET /sub/:team_id
export async function fetchTeamSubHistory(
  params: FetchTeamSubHistoryParams
): Promise<TeamSubHistoryResponse> {
  const { team_id, ...rest } = params;
  const { data } = await customFetch.get<ApiEnvelope<TeamSubHistoryResponse>>(
    `/sub/${team_id}`,
    { params: rest }
  );
  return data.data;
}

// PATCH /sub/
export async function updateSubStatus(payload: UpdateSubStatusPayload) {
  await customFetch.patch<ApiEnvelope<unknown>>('/sub/', payload);
}