



// NEW — Sponsorship purchase history
export type BankRef = {
  bank_name: string;
  account_name: string;
  account_number: string;
};

export type PurchaseHistoryRow = {
  id: number;
  payment_date: string; // ISO
  sponsorship_points: number; // units purchased
  payment_amount: number; // amount paid
  payment_slip: string;
  payment_into: BankRef;
  payment_from: BankRef;
  purchase_status: 'pending' | 'processing' | 'failed' | 'processed';
  payment_status: string; // e.g. "confirmed"
  team?: {
    id: number;
    username: string;
    email: string;
    phone_number: string;
    address: string;
    country: string;
    state: string;
    gender: string;
    dob: string;
    bio: string;
    profile_picture: string;
    last_login_date: string;
    sponsorships: number;
  } | null;
};

export type PurchaseHistoryMeta = {
  current_page: number;
  page_size: number;
  total_count: number;
  last_page: number;
};

// export type PurchaseHistoryPayload = {
//   data: PurchaseHistoryRow[];
//   metadata: PurchaseHistoryMeta;
// };

export type FetchPurchaseHistoryParams = {
  page: number; // 1-based
  page_size: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
};

export type ApiMeta = { message: string; code: number; status: string };
export type Envelope<T> = { meta: ApiMeta; data: T };

export type Meta = {
  current_page: number;
  page_size: number;
  total_count: number;
  last_page: number;
};



export type CreatePurchaseInput = {
  /** number of sponsorship units being purchased */
  points: number;
  /** computed client-side = points × unit price (NGN) */
  payment_amount: number;
  /** local image file (we'll upload it to /img to get a URL) */
  payment_slip_file: File;
};

export type CreatePurchaseBody =
  | {
      payment_date: string; // ISO
      payment_amount: number;
      points: number;
      payment_slip: string; // if you already have a hosted url
      source_bank_name: string;
      source_bank_account_name: string;
      source_bank_account_number: string;
    }
  // multipart case; sent as FormData (preferred)
  | FormData;


//   export type CreateSponsorPurchaseRequest = {
//     payment_date: string; // ISO
//     payment_amount: number;
//     points: number;
//     payment_slip: string; // hosted URL
//     source_bank_name: string;
//     source_bank_account_name: string;
//     source_bank_account_number: string;
//   };


  export type PurchaseHistoryParams = {
    page: number; // 1-based
    page_size: number;
    start_date: string; // YYYY-MM-DD
    end_date: string; // YYYY-MM-DD
  };

  export type BankInfo = {
    bank_name: string;
    account_name: string;
    account_number: string;
  };

  export type TeamInfo = {
    id: number;
    username?: string;
    email?: string;
    phone_number?: string;
    address?: string;
    country?: string;
    state?: string;
    gender?: string;
    dob?: string;
    bio?: string;
    profile_picture?: string;
    last_login_date?: string;
    sponsorships?: number;
    team_name?: string;
    license_number?: string;
  };

  export type PurchaseHistoryItem = {
    id: number;
    payment_date: string; // ISO
    sponsorship_points: number;
    payment_amount: number;
    payment_slip: string;
    payment_into: BankInfo;
    payment_from: BankInfo;
    purchase_status: 'pending' | 'processing' | 'failed' | 'processed'; // ⬅️ tighten
    payment_status: 'pending' | 'confirmed' | 'failed';
    team?: TeamInfo;
  };

  export type PurchaseHistoryPayload = {
    data: PurchaseHistoryItem[] | null;
    metadata: {
      current_page: number;
      page_size: number;
      total_count: number;
      last_page: number;
    };
  };

  export type CreateSponsorPurchaseRequest = {
    payment_date: string; // today in ISO
    payment_amount: number;
    points: number;
    payment_slip: string; // URL string
    source_bank_name: string;
    source_bank_account_name: string;
    source_bank_account_number: string;
  };