import { customFetch } from '../../../../Axios.ts';
import type {
  Envelope,
  FetchSponsorshipHistoryParams,
  SponsorRelatedParams,
  SponsorRelatedPayload,
  SponsorRelatedStats,
  SponsorRelatedStatsParams,
  SponsorshipHistoryPayload,
  TeamSponsorshipStats,
  TeamSponsorshipStatsParams,
} from './mySponsorship.types.ts';

export async function getTeamSponsorshipStats(
  params: TeamSponsorshipStatsParams
): Promise<TeamSponsorshipStats> {
  const { data } = await customFetch.get<Envelope<TeamSponsorshipStats>>(
    '/user/team-sponsorship-stats',
    { params }
  );
  return data.data;
}

export async function getTeamSponsorshipHistory(
  params: FetchSponsorshipHistoryParams
): Promise<SponsorshipHistoryPayload> {
  const { data } = await customFetch.get<Envelope<SponsorshipHistoryPayload>>(
    '/user/team-sponsorships',
    { params }
  );
  return data.data;
}

export async function getSponsorRelatedStats(
  params: SponsorRelatedStatsParams
): Promise<SponsorRelatedStats> {
  const { data } = await customFetch.get<Envelope<SponsorRelatedStats>>(
    '/sponsorship/team-sponsor-related-stats',
    { params }
  );
  return data.data;
}

export async function getSponsorRelatedList(
  params: SponsorRelatedParams
): Promise<SponsorRelatedPayload> {
  const { data } = await customFetch.get<Envelope<SponsorRelatedPayload>>(
    '/sponsorship/team-sponsor-related-list',
    { params }
  );
  return data.data;
}