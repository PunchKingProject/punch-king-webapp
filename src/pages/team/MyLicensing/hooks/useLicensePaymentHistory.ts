// src/pages/team/MyLicensing/hooks/useLicensePaymentHistory.ts
import { useQuery } from '@tanstack/react-query';
import { getLicensePaymentHistory } from '../api/mylicensing.api.ts';
import type { FetchLicenseHistoryParams } from '../api/mylicensing.types.ts';

export function useLicensePaymentHistory(params: FetchLicenseHistoryParams) {
  const { page, page_size, start_date, end_date } = params;
  return useQuery({
    queryKey: [
      'license-payment-history',
      page,
      page_size,
      start_date,
      end_date,
    ],
    queryFn: () => getLicensePaymentHistory(params),

  });
}
