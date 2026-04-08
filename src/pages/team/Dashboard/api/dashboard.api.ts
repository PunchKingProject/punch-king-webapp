import { customFetch } from "../../../../Axios";
import type { DashboardStats, DashboardStatsParams, Envelope, FetchMySubsParams, FetchRankedTeamsParams, FetchTeamLicenseHistoryParams, FetchTeamVoteHistoryParams, RankedTeamsPayload, TeamLicenseHistory, TeamPost, TeamSubHistoryRaw, TeamSubPayload, TeamVoteHistory } from "./dashboard.types";


export async function getDashboardStats(params: DashboardStatsParams):Promise<DashboardStats> {
    const { data } = await customFetch.get<Envelope<DashboardStats>>(
      '/user/team-personal-stats',
      {params}
    );
    return data.data
}


export async function getTeamVoteHistory(params:FetchTeamVoteHistoryParams):Promise<TeamVoteHistory> {
    const { data } = await customFetch.get<Envelope<TeamVoteHistory>>('/sponsorship/team-vote-history', {
        params
    });
    return data.data
}

export async function getMySubscriptions(
  params: FetchMySubsParams
): Promise<TeamSubPayload> {
  const res = await customFetch.get<Envelope<TeamSubHistoryRaw>>('/sub/:team_id', {
    params,
  });
  // guard against unexpected shapes
  const raw = res?.data?.data;
  if (!raw) {
    console.error('getMySubscriptions: unexpected response', res?.data);
    return {
      table: {
        data: [],
        metadata: {
          current_page: 1,
          page_size: 10,
          total_count: 0,
          last_page: 1,
        },
      },
    };
  }

  // adapt backend shape -> UI expected shape
  return {
    table: {
      data: raw.data,
      metadata: raw.metadata,
    },
  };
}


// GET /license/:team-id?page=&page_size=
export async function getTeamLicenseHistory(
  params: FetchTeamLicenseHistoryParams
): Promise<TeamLicenseHistory> {
 
  const { data } = await customFetch.get<Envelope<TeamLicenseHistory>>(
    `/license/:team_id`,
    { params}
  );
  return data.data;
}

// GET /user/ranked-team?search&page=1&page_size=10
export async function getRankedTeams(
  params: FetchRankedTeamsParams
): Promise<RankedTeamsPayload> {
  const { data } = await customFetch.get<Envelope<RankedTeamsPayload>>(
    "/user/ranked-team",
    { params }
  );
  return data.data;
}

export async function getTeamPosts(): Promise<TeamPost[]> {
  const { data } = await customFetch.get<Envelope<TeamPost[]>>(
    '/post/team-posts'
  );
  return data.data;
}