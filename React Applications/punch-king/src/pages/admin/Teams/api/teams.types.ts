export type TeamDashboardStatsParams = {
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
};

export type TeamDashboardStats = {
  total_teams: number;
  teams_with_active_sub: number;
  teams_with_active_license: number;
  teams_without_active_sub: number;
  teams_without_active_license: number;
};


export type Envelope<T> = {
  meta: { message: string; code: number; status: string };
  data: T;
};

export type SingleTeamStatsParams = {
  team_id: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
};

export type SingleTeamStats = {
  team_id: number;
  team_name: string;
  team_rank: number;
  total_sponsorships: number;
  total_sponsors: number;
  sponsorship_value: number;
};


export type TeamProfile = {
  id: number;
  team_name: string;
  email: string;
  phone_number: string;
  address: string;
  country: string;
  state: string;
  date_of_establishment: string; // ISO
  coach_1: string;
  coach_2: string;
  license_number: string;
  bio: string;
  profile_picture: string;
  last_login_date: string;
  sponsorships: number;
};

export interface UpdateTeamPayload {
  phone_number?: string;
  address?: string;
  country?: string;
  state?: string;
  dob?: string; // ISO string with time
  bio?: string;
  coach_1?: string;
  coach_2?: string;
  profile_picture?: string;
  license_number?: string;
}

export type TeamPost = {
  id: number;
  team: string;
  title: string;
  caption: string;
  file_url: string; // image or video url
  comments: number; // API provides this
  sponsorships: number;
  sponsors: number;
  created_at: string;
};

export type VoteHistoryParams = {
  team_id: number;
  page: number; // 1-based
  page_size: number;
  search?: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
};

export type VoteHistoryItem = {
  id: number;
  sponsor_name: string;
  units: number; // volume
  equivalent_amount: number; // value (money)
  created_at: string; // ISO
};

export type VoteHistoryMeta = {
  current_page: number;
  page_size: number;
  total_count: number;
  last_page: number;
};

export type VoteHistoryEnvelope = {
  meta: { message: string; code: number; status: string };
  data: { data: VoteHistoryItem[]; metadata: VoteHistoryMeta };
};