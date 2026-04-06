import { customFetch } from "../../../../Axios.ts";
import type { CreateLicensePaymentRequest, Envelope, FetchLicenseHistoryListParams, FetchLicenseHistoryParams, LicenseHistoryList, TeamLicenseHistory, TeamLicenseStats } from "./mylicensing.types.ts";

export async function fetchTeamLicenseStats(params: {
  start_date: string;
  end_date: string;
}): Promise<TeamLicenseStats> {
  const res = await customFetch.get<Envelope<TeamLicenseStats>>(
    '/license/team-stats',
    { params }
  );
  return res.data.data;
}


export async function getLicensePaymentHistory(
  params: FetchLicenseHistoryParams
): Promise<TeamLicenseHistory> {
  const { data } = await customFetch.get<Envelope<TeamLicenseHistory>>(
    '/license/single-team',
    { params }
  );
  return data.data;
}

// GET /license/active-inactive?page=&page_size=&search
export async function getLicenseActiveInactive(
  params: FetchLicenseHistoryListParams
): Promise<LicenseHistoryList> {
  const { data } = await customFetch.get<Envelope<LicenseHistoryList>>(
    '/license/active-inactive',
    { params }
  );
  return data.data;
}

export async function createLicensePayment(
  body: CreateLicensePaymentRequest
): Promise<void> {
  await customFetch.post('/license/', body);
}