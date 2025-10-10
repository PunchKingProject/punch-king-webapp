import { useQuery } from '@tanstack/react-query';
import type {
  FetchSponsorshipHistoryParams,
  SponsorshipHistoryPayload,
} from '../api/mySponsorship.types';
import { getTeamSponsorshipHistory } from '../api/mySponsorship.api';

export function useTeamSponsorshipHistory(
  params: FetchSponsorshipHistoryParams
) {
  return useQuery<SponsorshipHistoryPayload, Error>({
    queryKey: ['team-sponsorships', params],
    queryFn: () => getTeamSponsorshipHistory(params),
  });
}
