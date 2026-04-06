import { customFetch } from "../../../../Axios.ts";
import type { ApiEnvelope, FetchLicensesParams, FetchTeamLicenseHistoryParams, LicensePayload, TeamLicenseHistoryResponse, UpdateLicenseStatusPayload } from "./licensing.types.ts";

export async function fetchLicenses(
  params: FetchLicensesParams
): Promise<LicensePayload> {
  const { data } = await customFetch.get<ApiEnvelope<LicensePayload>>(
    '/license/',
    { params }
  );
  return data.data;
}


export async function fetchTeamLicenseHistory(params: FetchTeamLicenseHistoryParams): Promise<TeamLicenseHistoryResponse>
{
  const { team_id, ...rest} = params;
  const { data } = await customFetch.get<ApiEnvelope<TeamLicenseHistoryResponse>>(
    `/license/${team_id}`,
    { params: rest }
  );
  return data.data;
}
export async function updateLicenseStatus(
  payload: UpdateLicenseStatusPayload
): Promise<void> {
  await customFetch.patch<ApiEnvelope<unknown>>('/license/', payload);
}