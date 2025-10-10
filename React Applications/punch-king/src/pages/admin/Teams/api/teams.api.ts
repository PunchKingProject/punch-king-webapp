
import { customFetch } from "../../../../Axios";
import type { Envelope, SingleTeamStats, SingleTeamStatsParams, TeamDashboardStats, TeamDashboardStatsParams, TeamPost, TeamProfile, UpdateTeamPayload, VoteHistoryEnvelope, VoteHistoryParams } from "./teams.types";



export async function getTeamDashboardStats(params: TeamDashboardStatsParams): Promise<TeamDashboardStats> {
    const { data } = await customFetch.get<Envelope<TeamDashboardStats>>(
        '/user/team-dashboard-stats', 
        {params}
    )
    return data.data
}

export async function getSingleTeamStats(
  params: SingleTeamStatsParams
): Promise<SingleTeamStats> {
  const { data } = await customFetch.get<Envelope<SingleTeamStats>>(
    '/user/single-team-stats',
    { params } // { team_id, start_date, end_date }
  );
  return data.data;
}

export async function getTeamProfile(id: number): Promise<TeamProfile> {
  const { data } = await customFetch.get<Envelope<TeamProfile>>(`/user/${id}`);
  return data.data;
}

// (Optional) when you’re ready to save edits
export async function updateTeamProfile(
  teamId: number,
  body: UpdateTeamPayload
) {
  const { data } = await customFetch.patch(
    `/user/edit/${teamId}`,
    body
  );
  return data;
}

export async function getTeamPosts(teamId: number) {
  // GET /post/team-posts?team_id=16
  const { data } = await customFetch.get('/post/team-posts', {
    params: { team_id: teamId },
  });
  // API returns { meta, data: TeamPost[] }
  return data.data as TeamPost[];
}


export async function fetchTeamVoteHistory(params: VoteHistoryParams) {
  const { data } = await customFetch.get<VoteHistoryEnvelope>(
    '/sponsorship/team-vote-history',
    {
      params: {
        team_id: params.team_id,
        page: params.page,
        page_size: params.page_size,
        search: params.search ?? '',
        start_date: params.start_date,
        end_date: params.end_date,
      },
    }
  );
  return data;
}