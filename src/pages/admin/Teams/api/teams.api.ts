import { customFetch } from "../../../../Axios.ts";
import type { 
  Envelope, 
  SingleTeamStats, 
  SingleTeamStatsParams, 
  TeamDashboardStats, 
  TeamDashboardStatsParams, 
  TeamPost, 
  TeamProfile, 
  UpdateTeamPayload, 
  VoteHistoryEnvelope, 
  VoteHistoryParams 
} from "./teams.types.ts";

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
    { params } 
  );
  return data.data;
}

export async function getTeamProfile(id: number): Promise<TeamProfile> {
  const { data } = await customFetch.get<Envelope<TeamProfile>>(`/user/admin/${id}`);
  return data.data;
}

export async function updateTeamProfile(
  teamId: number,
  body: UpdateTeamPayload
) {
  const { data } = await customFetch.patch(
    `/user/admin/${teamId}/edit`,
    body
  );
  return data;
}

export async function getTeamPosts(teamId: number) {
  const { data } = await customFetch.get('/post/team-posts', {
    params: { team_id: teamId },
  });

  const raw = (data?.data ?? []) as Array<Record<string, unknown>>;

  const posts = raw.map((p) => {
    const commentsRaw = (p as { comments?: unknown }).comments;
    const comments_count = Array.isArray(commentsRaw)
      ? commentsRaw.length
      : typeof commentsRaw === 'number'
      ? commentsRaw
      : commentsRaw && typeof commentsRaw === 'object'
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
      comments_raw: commentsRaw,

      // NEW: Explicitly mapping the fighter information so the Edit Modal can see it
      boxer_name: String(p.boxer_name ?? ''),
      weight_class: String(p.weight_class ?? ''),
      boxer_weight_kg: p.boxer_weight_kg ? Number(p.boxer_weight_kg) : '',
      shorts_color: String(p.shorts_color ?? ''),
      glove_color: String(p.glove_color ?? ''),
      opponent_name: String(p.opponent_name ?? ''),
      opponent_weight_kg: p.opponent_weight_kg ? Number(p.opponent_weight_kg) : '',
      opponent_shorts_color: String(p.opponent_shorts_color ?? ''),
      sparring_location: String(p.sparring_location ?? ''),
    };
  });

  // Cast as any temporarily to bypass potential strict type errors if teams.types.ts is not yet updated
  return posts as any as TeamPost[]; 
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

/**
 * NEW: Allows an admin to create/upload a post on behalf of any team.
 * Matches your Go backend's `AdminCreateTeamPost` handler.
 */
export async function createAdminTeamPost(payload: any) {
  // Point to the exact route defined in your Go postRoute.go file
  const { data } = await customFetch.post('/admin/team-post/', payload); 
  return data;
}

/**
 * Deletes a team post from the Admin dashboard
 */
export async function deleteAdminTeamPost(postId: number) {
  const { data } = await customFetch.delete(`/admin/team-post/${postId}`);
  return data;
}

export async function deleteAdminTeam(teamId: number) {
  const { data } = await customFetch.delete(`/admin/teams/${teamId}`);
  return data;
}

/**
 * NEW: Updates an existing team post from the Admin dashboard.
 */
export async function updateAdminTeamPost(postId: number, payload: any) {
  const { data } = await customFetch.patch('/admin/team-post/', {
    post_id: postId, // ⬅️ Change this from 'id' to 'post_id' to match your Go DTO
    ...payload
  });
  return data;
}