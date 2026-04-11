import type { LicenseStatus, PaymentStatus } from "../../../../components/chips/StatusChipDropdown";

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


export type LicenseCards = {
  teams_with_active_licenses: number;
  teams_without_active_licenses: number;
  unconfirmed_non_active_licenses: number;
  active_licenses: number;
  total_license_value: number;
  total_licenses: number;
};

export type BankInfo = {
  bank_name: string;
  account_name: string;
  account_number: string;
};

export type LicenseApiRow = {
  id: number;
  payment_date: string; // ISO
  payment_amount: number;
  payment_slip: string | null;
  payment_into: BankInfo | null;
  payment_from: BankInfo | null;
  status?: string | null; // e.g. 'active'
  payment_status: 'pending' | 'confirmed' | 'failed' | string;
  license_status: 'pending' | 'processing' | 'processed' | string;
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

export type LicensePayload = {
  cards: LicenseCards;
  table: {
    data: LicenseApiRow[];
    metadata: PageMeta;
  };
};

export type FetchLicensesParams = {
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  page: number; // 1-based
  page_size: number;
  search?: string;
};


export type TeamLicenseHistoryResponse = {
  data: LicenseApiRow[];
  metadata: PageMeta;
};

export type FetchTeamLicenseHistoryParams = {
  team_id: number;
  page: number; //1-based
  page_size: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  search?: string;
}



export type UpdateLicenseStatusPayload = {
  license_id: number;
  payment_status: PaymentStatus; // 'pending' | 'confirmed' | 'failed'
  license_status: LicenseStatus; // 'pending' | 'processing' | 'failed' | 'processed'
};