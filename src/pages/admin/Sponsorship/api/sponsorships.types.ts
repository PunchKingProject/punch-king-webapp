export type ApiMeta = {
  message: string;
  code: number;
  status: 'success' | 'error';
};
export type ApiEnvelope<T> = { meta: ApiMeta; data: T };

export type PageMeta = {
  current_page: number;
  page_size: number;
  total_count: number;
  last_page: number;
};

export type BankInfo = {
  bank_name: string;
  account_name: string;
  account_number: string;
};

export type SponsorshipApiRow = {
  id: number;
  payment_date: string | null;
  sponsorship_points: number | null;
  payment_amount: number | null;
  payment_slip?: string | null;
  payment_into?: BankInfo | null;
  payment_from?: BankInfo | null;
  purchase_status?: string | null; // pending | processing | processed | failed
  payment_status?: string | null; // pending | confirmed | failed
  sponsor_id?: number | null;
  team?: {
    id: number;
    username: string;
    team_name?: string | null;
    email?: string | null;
    phone_number?: string | null;
    address?: string | null;
    country?: string | null;
    state?: string | null;
    profile_picture?: string | null;
  } | null;
};

export type SponsorshipCards = {
  total_requests: number;
  total_points: number;
  total_amount: number;
  processed_requests: number;
  pending_requests: number;
};

export type SponsorshipPayload = {
  cards: SponsorshipCards;
  table: {
    data: SponsorshipApiRow[];
    metadata: PageMeta;
  };
};

export type FetchSponsorshipsParams = {
  start_date: string; // YYYY-MM-DD
  end_date: string;
  page: number; // 1-based
  page_size: number;
  search?: string;
};


export type PaymentStatus = 'pending' | 'confirmed' | 'failed';
export type PurchaseStatus = 'pending' | 'processing' | 'processed' | 'failed';

// Use your ApiEnvelope<ApiMeta> already defined
export type UpdateSponsorshipStatusBody = {
  purchase_id: number;
  payment_status: PaymentStatus;
  purchase_status: PurchaseStatus;
};

// If you want a dedicated “details” shape, you can reuse the row:
export type SponsorshipDetails = SponsorshipApiRow;

/**
 * Query args for the users purchase history list (details page source of truth).
 * Mirrors the API:
 * GET /sponsorship/users-purchase-history?page=&page_size=&sponsor_id=&start_date=&end_date=
 */

export type SponsorPurchaseHistoryQueryArgs = {
  sponsor_id: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  page: number; // 1-based
  page_size: number;
};

/**
 * Payload shape returned by the users purchase history endpoint.
 * Your sample shows: { meta, data: { data: [...], metadata: {...} } }
 */
export type SponsorPurchaseHistoryPayload = {
  data: SponsorshipApiRow[];
  metadata: PageMeta;
};

/** Envelope for the users purchase history response */
export type SponsorPurchaseHistoryEnvelope = ApiEnvelope<SponsorPurchaseHistoryPayload>;

/**
 * Lightweight row used by a client-side history table (optional, mirrors subscription’s history table).
 * Good for mapping to a `DesktopSponsorshipHistoryTable` later if you add it.
 */
export type SponsorshipHistoryRow = {
  id: number;
  category: string;              // If you later classify (e.g., "points purchase"); otherwise keep "—"
  payment_date: string;          // already formatted string for the table
  start_date?: string;           // keep for future parity (usually sponsorships don't have start/end)
  end_date?: string;
};

export type SponsorVoteHistoryApiRow = {
  id: number;
  units: number;
  equivalent_amount: number;
  team_name: string;
  created_at: string; // ISO
};

export type FetchSponsorVoteHistoryParams = {
  sponsor_id: number;
  page: number; // 1-based
  page_size: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  search?: string; // backend may ignore; keep for parity
};

export type SponsorVoteHistoryPayload = {
  data: SponsorVoteHistoryApiRow[];
  metadata: PageMeta;
};


// Row shape for the table UI
export type SponsorVoteRow = {
  id: number;
  team_name: string;
  value: string;   // formatted currency (e.g., ₦1,000.00)
  volume: number;  // units
  date: string;    // M/D/YYYY
  time: string;    // h:mma
};

