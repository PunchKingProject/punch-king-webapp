export type ApiMeta = {
  message: string;
  code: number;
  status: 'success' | 'error';
};

export type ApiResponse<T> = {
  meta: ApiMeta;
  data: T;
};

export type PageMeta = {
  current_page: number;
 page_size: number;
  total_count: number;
  last_page: number;
};

export type LicensePlan = {
  id: number;
  name: string;
  description: string;
  currency: string;
  price: number;
  duration: number;
  is_active: boolean;
  created_at: string;
};

export type LicensePlansResponse = ApiResponse<LicensePlan[]>;

export type CreateLicensePlanPayload = {
  name: string;
  description: string;
  currency: string;
  price: number;
  duration: number;
};

export type UpdateLicensePlanPayload =
  Partial<CreateLicensePlanPayload>;

export type DeleteResponse = ApiResponse<null>;