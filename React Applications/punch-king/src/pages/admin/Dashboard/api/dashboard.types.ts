export type DashboardStatsParams = {
  start_date: string; //YYYY-MM-DD
  end_date: string; //YYYY-MM-DD
};

export type DashboardStats = {
  sponsor_count: number;
  team_count: number;
  subscriptions_in_range: number;
  licenses_in_range: number;
  sponsorship_purchases_range: number;
};


export type RankedTeam = {
  team_id: number;
  team_name: string;
  license_number: string;
  sponsorships: number;
  rank: number;
};


export type RankedUser = {
  user_id: number;
  name: string;
  email: string;
  phone_number: string;
  total_points_purchased: number;
  total_amount_sponsored: number;
};


export type RankedTeamsParams = {
  page: number; // 1-based
  page_size: number;
  search?: string;
};

export type RankedUsersParams = {
  page: number; // 1-based
  page_size: number;
  search?: string;
};

export type Meta = {
  current_page: number;
  page_size: number;
  total_count: number;
  last_page: number;
};

export type Envelope<T> = {
  meta: { message: string; code: number; status: string };
  data: T;
};

export type Paged<T> = {
  data: T[];
  metadata: Meta;
};


// UI types (used by components)
export type Team = {
  team_name: string;
  license_no: string;
  sponsors_accrued: number;
  ranking: number | string;
  team_id?: number; // <- add (optional) so we can navigate
};




// Shared user type (mobile + desktop)
export type UserSponsorship = {
  user_name: string;
  email?:string;
  phone_number: string;
  sponsors_purchased: number;
  sponsors_used: number;
};