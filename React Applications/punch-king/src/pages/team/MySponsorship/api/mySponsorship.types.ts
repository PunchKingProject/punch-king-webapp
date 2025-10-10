export type TeamSponsorshipStatsParams = {
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
};

export type TeamSponsorshipStats = {
  team_id: number;
  team_name: string;
  team_rank: number;
  total_sponsorships: number;
  total_sponsors: number;
  sponsorship_value: number;
};

export type Envelope<T> = {
  meta: { message: string; code: number; status: string };
  data: T;
};


// ----- pagination meta (same shape as your other tables)
export type Meta = {
  current_page: number;
  page_size: number;
  total_count: number;
  last_page: number;
  next_page?: number;
};

// ----- sponsorship history row (API)
export type SponsorshipApiRow = {
  sponsor_id: number;
  sponsor_name: string;
  sponsorship_date: string;            // ISO
  sponsorship_amount: number;          // units (Qty)
  sponsorship_equivalent_cash: number; // NGN amount (may be 0/missing)
};

// ----- payload container
export type SponsorshipHistoryPayload = {
  data: SponsorshipApiRow[];
  metadata: Meta;
};

// ----- request params (NOTE: this endpoint uses DD-MM-YYYY)
export type FetchSponsorshipHistoryParams = {
  page: number;
  page_size: number;
  start_date: string; // DD-MM-YYYY
  end_date: string;   // DD-MM-YYYY
};

export type SponsorRelatedStatsParams = {
  sponsor_id: number;
  start_date: string; // DD-MM-YYYY
  end_date: string; // DD-MM-YYYY
};

export type SponsorRelatedStats = {
  total_points: number; // units
  total_cash: number; // NGN
};

export type SponsorRelatedApiRow = {
  id: number;
  units: number;
  equivalent_amount: number;
  team_name?: string | null;
  created_at: string; // ISO
};

export type SponsorRelatedPayload = {
  data: SponsorRelatedApiRow[];
  metadata: Meta;
};

export type SponsorRelatedParams = {
  sponsor_id: number;
  page: number; // 1-based
  page_size: number;
  start_date: string; // DD-MM-YYYY
  end_date: string; // DD-MM-YYYY
};