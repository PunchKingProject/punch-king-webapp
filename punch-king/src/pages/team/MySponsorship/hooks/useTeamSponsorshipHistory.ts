import { useQuery } from '@tanstack/react-query';
import type {
  FetchSponsorshipHistoryParams,
  SponsorshipHistoryPayload,
} from '../api/mySponsorship.types.ts';
import { getTeamSponsorshipHistory } from '../api/mySponsorship.api.ts';

export function useTeamSponsorshipHistory(
  params: FetchSponsorshipHistoryParams
) {
  return useQuery<SponsorshipHistoryPayload, Error>({
    queryKey: ['team-sponsorships', params],
    queryFn: () => getTeamSponsorshipHistory(params),
  });
}
