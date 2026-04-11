import { customFetch } from '../../../../Axios.ts';
import type {
  CreateSubBody, CreateSubscriptionResponse,
  Envelope,
  SubHistoryPayload,
  SubPaymentPayload, SubscriptionPlansPayload, SubscriptionPlansResponse,
  TeamSubStats,
  TeamSubStatsParams,
} from './mysubscriptions.types.ts';

// GET /sub/team-sub-stats?start_date=DD-MM-YYYY&end_date=DD-MM-YYYY
export async function getTeamSubStats(
  params: TeamSubStatsParams
): Promise<TeamSubStats> {
  const { data } = await customFetch.get<Envelope<TeamSubStats>>(
    '/sub/team-sub-stats',
    { params }
  );
  return data.data;
}


export async function getTeamSubActiveInactive(params: {
  page: number;
  page_size: number;
}) {
  const { data } = await customFetch.get<Envelope<SubHistoryPayload>>(
    '/sub/active-inactive/',
    { params }
  );
  return data.data;
}


export async function getTeamSubPayments(params: {
  page: number;
  page_size: number;
}) {
  const { data } = await customFetch.get<Envelope<SubPaymentPayload>>(
    '/sub/single-team',
    { params }
  );
  return data.data;
}

export async function createSubscription(body: CreateSubBody): Promise<CreateSubscriptionResponse> {
  const {data} = await customFetch.post<CreateSubscriptionResponse>('/sub/', body);

  return data
}


export async function getSubscriptionPlans(): Promise<SubscriptionPlansPayload[]> {
  const { data } = await customFetch.get<SubscriptionPlansResponse>('/sub/plans');

  return data.data;
}