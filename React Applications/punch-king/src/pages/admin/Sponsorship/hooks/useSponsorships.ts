import { useQuery } from '@tanstack/react-query';
import { fetchSponsorships } from '../api/sponsorships.api';
import type {
  FetchSponsorshipsParams,
  SponsorshipPayload,
} from '../api/sponsorships.types';

export function useSponsorships(params: FetchSponsorshipsParams) {
  return useQuery<SponsorshipPayload>({
    queryKey: [
      'sponsorships',
      params.start_date,
      params.end_date,
      params.page,
      params.page_size,
      params.search ?? '',
    ],
    queryFn: () => fetchSponsorships(params),
    staleTime: 60_000,
    enabled:
      !!params.start_date &&
      !!params.end_date &&
      Number.isFinite(params.page) &&
      Number.isFinite(params.page_size),

  });
}
