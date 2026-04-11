
import { customFetch } from "../../../../Axios.ts";
import type { Envelope, SingleTeamStats, SingleTeamStatsParams, TeamDashboardStats, TeamDashboardStatsParams, TeamPost, TeamProfile, UpdateTeamPayload, VoteHistoryEnvelope, VoteHistoryParams } from "./teams.types.ts";



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
    '/user/team-sponsorship-stats',
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

  // API may return comments as an object/array — normalize to a count
  const raw = (data?.data ?? []) as Array<Record<string, unknown>>;

  const posts: TeamPost[] = raw.map((p) => {
    const commentsRaw = (p as { comments?: unknown }).comments;
    const comments_count = Array.isArray(commentsRaw)
      ? commentsRaw.length
      : typeof commentsRaw === 'number'
      ? commentsRaw
      : // object or undefined -> 1 if it looks like a single comment object, else 0
      commentsRaw && typeof commentsRaw === 'object'
      ? 1
      : 0;

    return {
      id: Number(p.id),
      team: String(p.team ?? ''),
      title: String(p.title ?? ''),
      caption: String(p.caption ?? ''),
      file_url: String(p.file_url ?? ''),
      comments_count,
      sponsorships: Number((p as { sponsorships?: number }).sponsorships ?? 0),
      sponsors: Number((p as { sponsors?: number }).sponsors ?? 0),
      created_at: String(p.created_at ?? ''),
      // keep the raw comments if you still need them elsewhere (but don't render directly)
      comments_raw: commentsRaw,
    };
  });

  return posts;
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