// src/pages/team/MyLicensing/api/mylicensing.types.ts
export type ApiMeta = { message: string; code: number; status: string };
export type Envelope<T> = { meta: ApiMeta; data: T };

export type LicenseSummary = {
  id: number;
  start_date: string; // ISO string
  end_date: string; // ISO string
  amount_paid: number;
  status: 'active' | 'expired' | 'inactive' | string;
};

export type TeamLicenseStats = {
  active_sub: LicenseSummary | null;
  total_licenses: number;
};

export type LicenseStatus =
  | 'active'
  | 'expired'
  | 'inactive'
  | 'processed'
  | string;
export type PaymentStatus = 'confirmed' | 'pending' | 'failed' | string;


/** ===== License History ===== */
export type TeamLite = {
  id: number;
  team_name: string;
  email: string;
  phone_number: string;
  address: string;
  country: string;
  state: string;
  date_of_establishment: string;
  coach_1?: string;
  coach_2?: string;
  license_number?: string;
  bio?: string;
  profile_picture?: string;
  last_login_date?: string;
  sponsorships?: number;
  has_active_subscription?: boolean;
  has_active_license?: boolean;
  license_certificate?: string;
};

export type BankRef = {
  bank_name: string;
  account_name: string;
  account_number: string;
};


export type LicenseHistoryRow = {
  id: number;
  payment_date: string | null; // ← nullable
  payment_amount: number | null; // ← nullable
  payment_slip?: string | null;

  payment_into?: BankRef | null; // ← optional + nullable
  payment_from?: BankRef | null; // ← optional + nullable

  status?: LicenseStatus | null; // ← optional + nullable
  payment_status?: PaymentStatus | null; // ← optional + nullable
  license_status?: string | null; // ← optional + nullable

  start_date: string | null; // ← nullable
  end_date: string | null; // ← nullable

  team?: TeamLite | null; // ← optional + nullable

  /** Optional if backend later sends it; used for "License type" column */
  license_type?: string | null;
};

// ---------- Pagination container ----------
export type Meta = {
  current_page: number;
  page_size: number;
  total_count: number;
  last_page: number;
};


export type TeamLicenseHistory = {
  data: LicenseHistoryRow[];
  metadata: Meta;
};

// Request params for history endpoint (uses ISO dates)
export type FetchLicenseHistoryParams = {
  page: number;        // 1-based
  page_size: number;
  start_date: string;  // YYYY-MM-DD
  end_date: string;    // YYYY-MM-DD
};


// (Optional generic if you like it elsewhere; not required for the history call)
export type PagedEnvelope<T> = Envelope<{
  data: T[];
  metadata: Meta;
}>;


// --- Active/Inactive license list (table) ---

export type LicenseHistoryListRow = {
  id: number;
  start_date: string | null;
  end_date: string | null;
  amount_paid: number | null;
  status: 'active' | 'expired' | string;
  // backend doesn't return it right now, but we keep the field
  // so the UI has a place to show it if it arrives later.
  license_number?: string | null;
};

export type LicenseHistoryList = {
  data: LicenseHistoryListRow[];
  metadata: Meta;
};

export type FetchLicenseHistoryListParams = {
  page: number;      // 1-based
  page_size: number;
  search?: string;
};


export type CreateLicensePaymentRequest = {
  plan_id: number;
  payment_date: string;  // hard-coded
};


export interface CreateLicenseResponse {
  data: string;
}

export type LicensePlansPayload = {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
}

export type LicensePlansResponse = {
  data: LicensePlansPayload[];
}


export type CreateArgs = {
  payment_amount: number;
  payment_slip: string; // url already uploaded
};
