// pages/admin/Subscription/api/subscriptions.types.ts
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

export type SubApiRow = {
  id: number;
  type: 'monthly' | 'annual' | string;
  payment_date: string; // ISO
  payment_amount: number;
  payment_slip: string | null;
  payment_into: BankInfo | null;
  payment_from: BankInfo | null;
  payment_status: 'pending' | 'confirmed' | 'failed' | string;
  subscription_status:
    | 'pending'
    | 'processing'
    | 'processed'
    | 'failed'
    | string;
  start_date: string | null;
  end_date: string | null;
  team: {
    id: number;
    team_name: string;
    email: string;
    phone_number: string;
    address?: string | null;
    country?: string | null;
    state?: string | null;
    license_number: string | null;
    profile_picture: string | null;
  };
};

export type SubCards = {
  teams_with_active_subs: number;
  teams_without_active_subs: number;
  unconfirmed_non_active_subs: number;
  active_subs: number;
  total_value: number;
  total_subs: number;
};

export type SubPayload = {
  cards: SubCards;
  table: {
    data: SubApiRow[];
    metadata: PageMeta;
  };
};

export type FetchSubsParams = {
  start_date: string; // YYYY-MM-DD
  end_date: string;
  page: number; // 1-based
  page_size: number;
  search?: string;
};


export type TeamSubHistoryResponse = {
  data: SubApiRow[];
  metadata: PageMeta;
};

export type FetchTeamSubHistoryParams = {
  team_id: number;
  page: number; // 1-based
  page_size: number;
  start_date: string;
  end_date: string;
  search?: string;
};

export type UpdateSubStatusPayload = {
  sub_id: number;
  payment_status: 'pending' | 'confirmed' | 'failed';
  subscription_status: 'pending' | 'processing' | 'processed' | 'failed';
};
