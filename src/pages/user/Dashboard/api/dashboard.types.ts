// src/pages/user/api/user.types.ts
export type ApiMeta = { message: string; code: number; status: string };
export type Envelope<T> = { meta: ApiMeta; data: T };

export type UserStatsParams = {
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
};

export type UserStats = {
  sponsorship_balance: number;
  total_amount_spent: number; // units spent
  equivalent_amount_spent: number; // USD cash equivalent
  distinct_teams_sponsored: number;
  spent_units: number; // if this is the correct name
};


/** ---------- Team Feeds ---------- */
export type FeedPost = {
  id: number;
  team_id: number; // ← NEW
  team_name: string; // ← NEW (replaces "team")
  //   team: string;
  title: string;
  caption: string;
  file_url: string | null;
  comments_count: number;
  sponsorships: number;
  sponsors: number;
  created_at: string; // ISO
};

export type AllPostsPayload = {
  meta: {
    limit: number;
    next_cursor: number | null;
  };
  posts: FeedPost[];
};

export type FetchAllPostsParams = {
  cursor: number; // start at 0
  limit: number;  // e.g. 4
};

/** ---------- Team Ranking ---------- */
export type Meta = {
  current_page: number;
  page_size: number;
  total_count: number;
  last_page: number;
};

export type RankedTeam = {
  team_id: number;
  team_name: string;
  license_number: string;
  sponsorships: number;
  rank: number;
  contributors?: number; // backend may add later
};

export type RankedTeamsPayload = {
  data: RankedTeam[];
  metadata: Meta;
};

export type FetchRankedTeamsParams = {
  page: number;      // 1-based
  page_size: number; // e.g. 10
  search?: string;
};


export type CommentRow = {
  id: number;
  post_id: number;
  content: string;
  commenter: string; // e.g. "TEAM7"
  replies: CommentRow[] | null;
  created_at: string; // ISO
};

export type PostDetail = {
  id: number;
  //   team: string;
  team_id: number; // ← NEW
  team_name: string; // ← NEW (replaces "team")
  title: string;
  caption: string;
  file_url: string | null;
  comments?: CommentRow[] | null;
  comments_count: number;
  sponsorships: number;
  sponsors: number;
  created_at: string;
};

export type CreateCommentPayload = {
  post_id: number;
  content: string;
  parent_comment_id?: number;
};

export type CreateCommentResponse = { success: boolean }; // adapt if backend returns more


export type VotePayload = {
  post_id: number;
  amount: number; // number of sponsorship “units”
};

export type VoteResponse = {
  success: boolean;
  message?: string;
  new_balance?: number; // if backend returns updated balance
};