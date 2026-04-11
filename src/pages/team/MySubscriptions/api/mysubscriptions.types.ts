// Generic envelope
export type ApiMeta = { message: string; code: number; status: string };
export type Envelope<T> = { meta: ApiMeta; data: T };


// ✅ ADD this pagination meta type
export type Meta = {
  current_page: number;
  page_size: number;
  total_count: number;
  last_page: number;
};


/** ==== Team Subscriptions Stats (cards) ==== */
export type ActiveSub = {
  id: number;
  type: 'annual' | 'semi_annual' | string; // backend uses 'semi_annual' for 6 months
  start_date: string; // ISO
  end_date: string; // ISO
  amount_paid: number;
  subscription_status: 'active' | 'inactive' | string;
};

export type TeamSubStats = {
  active_sub: ActiveSub | null;
  annual_count: number;
  semi_annual_count: number;
};

// Request params (stats endpoint uses DD-MM-YYYY)
export type TeamSubStatsParams = {
  start_date: string; // DD-MM-YYYY
  end_date: string; // DD-MM-YYYY
};


/** ---------- /sub/single-team ---------- */
export type SubPaymentApiRow = {
  id: number;
  type: string; // 'annual' | 'semi_annual' | etc.
  payment_date: string | null;
  payment_amount: number | null;
  payment_slip?: string | null;
  payment_status?: string | null;          // confirmed | pending | failed
  subscription_status?: string | null;     // processed | processing | failed
};
export type SubPaymentPayload = { data: SubPaymentApiRow[]; metadata: Meta };


/** ---------- /sub/active-inactive ---------- */
export type SubHistoryApiRow = {
  id: number;
  type: string;                    // 'annual' | 'semi_annual'
  start_date: string | null;
  end_date: string | null;
  amount_paid: number | null;
  subscription_status?: string | null; // active | expired
};
export type SubHistoryPayload = { data: SubHistoryApiRow[]; metadata: Meta };

export type CreateSubBody = {
  type: 'annual' | 'semi-annual';
  payment_date: string; // ISO, T00:00:00Z
  payment_amount: number;
  payment_slip: string;
  source_bank_name: string;
  source_bank_account_name: string;
  source_bank_account_number: string;
};

