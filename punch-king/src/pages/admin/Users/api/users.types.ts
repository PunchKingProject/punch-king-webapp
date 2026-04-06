// pages/admin/Users/api/types.ts

export type ApiMeta = {
  message: string;
  code: number;
  status: 'success' | 'error';
};

export type ApiResponse<T> = {
  meta: ApiMeta;
  data: T;
};

/* ---------- Pagination ---------- */
export type PageMeta = {
  current_page: number;
  page_size: number;
  total_count: number;
  last_page: number;
};

export type Paged<T> = {
  data: T[];
  metadata: PageMeta;
};

/** Cards for the User Details (single user) */
export type SingleUserStats = {
  sponsorship_balance: number;
  total_amount_spent: number;
  distinct_teams_sponsored: number;
};

/* ====== Stats ====== */
export type UserDashboardStatsParams = {
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
};

export type UserDashboardStats = {
  total_sponsors_created: number;
  total_unique_sponsors: number;
  total_sponsorships: number;
};

/* ====== Table ====== */
export type UserTableParams = {
  start_date: string;
  end_date: string;
  search?: string;
  page: number; // 1-based
  page_size: number;
};

/** API row shape */
export type UserTableApiRow = {
  sponsor_id: number;
  name: string;
  email: string;
  phone_number: string;
  sponsorship_balance: number; // “Sponsor Units”
  total_amount_given: number; // “Sponsorships” (money given)
};

/** UI row for the table */
export type UserTableRow = {
  sponsor_id: number;
  user_name: string;
  phone_number: string;
  email: string;
  sponsorships: number; // total_amount_given
  sponsor_units: number; // sponsorship_balance
};

export type UseSingleUserStatsArgs = {
  sponsor_id: number;
  start_date?: string;
  end_date?: string;
};

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  country: string | null;
  state: string | null;
  gender: string | null; // server returns capitalized in your sample
  dob: string | null; // ISO string e.g. "2000-01-01T00:00:00Z"
  bio: string | null;
  profile_picture: string | null;
  last_login_date?: string | null;
  sponsorships?: number;
};

export type UpdateUserPayload = {
  phone_number?: string;
  address?: string;
  country?: string;
  state?: string;
  dob?: string;
  gender?: string;
  bio?: string;
  profile_picture?: string;
};

export type BankInfo = {
  bank_name: string;
  account_name: string;
  account_number: string;
};

export type UserPurchaseItem = {
  id: number;
  payment_date: string; // ISO
  sponsorship_points: number;
  payment_amount: number;
  payment_slip: string | null;
  payment_into: BankInfo | null;
  payment_from: BankInfo | null;
  purchase_status: 'pending' | 'processed' | 'failed' | string;
  payment_status: 'pending' | 'paid' | 'failed' | string;
};

export type UserPurchaseHistoryResponse = {
  data: UserPurchaseItem[];
  metadata: PageMeta;
};

export type FetchUserPurchaseHistoryParams = {
  sponsor_id: number;
  page: number; // 1-based for API
  page_size: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  search?: string; // optional — backend may ignore, harmless to send
};

// --- Sponsor Vote History ---
export type SponsorVoteItem = {
  id: number;
  units: number; // “Volume”
  equivalent_amount: number; // “Value” (NGN)
  team_name: string;
  created_at: string; // ISO datetime
};

export type SponsorVoteHistoryResponse = {
  data: SponsorVoteItem[];
  metadata: PageMeta;
};

export type FetchSponsorVoteHistoryParams = {
  sponsor_id: number;
  page: number; // 1-based
  page_size: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  search?: string;
};
