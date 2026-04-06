export type DashboardStatsParams = {
  start_date: string; //YYYY-MM-DD
  end_date: string; //YYY-MM-DD
};

export type DashboardStats = {
  sponsorship_balance: number;
  total_sponsors: number;
  total_licenses: number;
  total_subscriptions: number;
};

export type Envelope<T> = {
  meta: { message: string; code: number; status: string };
  data: T;
};

export type Meta = {
  current_page: number;
  page_size: number;
  total_count: number;
  last_page: number;
};

export type TeamVoteRow = {
  id: number;
  units: number;
  equivalent_amount: number;
  sponsor_name: string;
  created_at: string; // ISO
};

export type TeamVoteHistory = {
  data: TeamVoteRow[];
  metadata: Meta;
};


export type FetchTeamVoteHistoryParams = {

  page: number; // 1-based
  page_size: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  search?: string;
};

export type BankInfo = {
  bank_name: string;
  account_name: string;
  account_number: string;
};

export type TeamSubApiRow = {
  id: number;
  type: string;
  payment_date: string | null;
  payment_amount: number | null;
  payment_slip?: string | null;
  payment_into?: BankInfo | null;
  payment_from?: BankInfo | null;
  payment_status?: string | null;
  subscription_status?: string | null;
  start_date: string | null;
  end_date: string | null;
  team?: { id: number; team_name?: string | null } | null;
};

export type TeamSubHistoryRaw = {
  data: TeamSubApiRow[];
  metadata: Meta;
};


export type TeamSubCards = {
  teams_with_active_subs: number;
  teams_without_active_subs: number;
  unconfirmed_non_active_subs: number;
  active_subs: number;
  total_value: number;
  total_subs: number;
};

export type TeamSubPayload = {
  cards?: TeamSubCards;
  table: {
    data: TeamSubApiRow[];
    metadata: Meta;
  };
};

export type FetchMySubsParams = {
  start_date: string; // YYYY-MM-DD
  end_date: string;
  page: number; // 1-based
  page_size: number;
  search?: string;
};

export type TeamLicenseRow = {
  id: number;
  payment_date: string | null;
  payment_amount: number | null;
  payment_slip?: string | null;
  payment_into?: BankInfo | null;
  payment_from?: BankInfo | null;
  status?: string | null; // "active" | "expired" (optional)
  payment_status?: string | null;
  license_status?: string | null; // "processed" | etc.
  start_date: string | null;
  end_date: string | null;
  team?: {
    id: number;
    team_name?: string | null;
    license_number?: string | null;
  } | null;
};

export type TeamLicenseHistory = {
  data: TeamLicenseRow[];
  metadata: Meta;
};


export type FetchTeamLicenseHistoryParams = {
//   team_id: number;
  page: number; // 1-based
  page_size: number;
  // (no search in the endpoint spec; add later if backend supports)
};

// --- add to the bottom with your other types ---
export type RankedTeam = {
  team_id: number;
  team_name: string;
  license_number: string;
  sponsorships: number;
  rank: number;
  // if backend later adds this, we’ll show it; otherwise we’ll default to 0
  contributors?: number;
  sponsors?:number
};

export type RankedTeamsPayload = {
  data: RankedTeam[];
  metadata: Meta;
};

export type FetchRankedTeamsParams = {
  page: number;       // 1-based
  page_size: number;
  search?: string;
};

export type PostComment = {
  id: number;
  post_id: number;
  content: string;
  commenter: string;
  replies: unknown | null;
  created_at: string; // ISO
};

export type TeamPost = {
  id: number;
  team: string; // team name
  title: string;
  caption: string;
  file_url: string | null; // image/video url
  comments: PostComment[];
  comments_count: number;
  sponsorships: number;
  sponsors: number;
  created_at: string; // ISO
};
