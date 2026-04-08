import { useQuery } from '@tanstack/react-query';
import {
  getTeamSubPayments,
  getTeamSubActiveInactive,


} from '../api/mysubscriptions.api';
import type { SubHistoryPayload, SubPaymentPayload } from '../api/mysubscriptions.types';

export function useTeamSubPayments(params: {
  page: number;
  page_size: number;
}) {
  return useQuery<SubPaymentPayload, Error>({
    queryKey: ['team-sub-payments', params],
    queryFn: () => getTeamSubPayments(params),
  });
}

export function useTeamSubActiveInactive(params: {
  page: number;
  page_size: number;
}) {
  return useQuery<SubHistoryPayload, Error>({
    queryKey: ['team-sub-active-inactive', params],
    queryFn: () => getTeamSubActiveInactive(params),
  });
}
