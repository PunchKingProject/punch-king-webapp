// pages/admin/Licensing/ui/fields.ts
import type { Field } from '../../components/ScrollableSection';

export type LicenseListItem = {
  id?: number;
  team_id: number; // ⬅️ add this
  team_name: string;
  phone_number: string;
  payment_confirmation_status: 'Pending' | 'Failed' | 'Confirmed' | '—';
  licensing_status: 'Pending' | 'Processing' | 'Failed' | 'Processed' | '—';
};
export type HistoryRow = {
  id: number;
  licensing_name: string;
  payment_date: string;
  start_date: string;
  end_date: string;
};

export const licenseFieldData: Field<LicenseListItem>[] = [
  { key: 'team_name', label: 'Team name' },
  { key: 'phone_number', label: 'Phone number' },
  { key: 'payment_confirmation_status', label: 'Payment status' },
  { key: 'licensing_status', label: 'Licensing status' },
];

/** fields for the mobile subscription history list */
export const historyFieldData: Field<HistoryRow>[] = [
  { key: 'licensing_name', label: 'Subscription category' },
  { key: 'payment_date', label: 'Payment date' },
  { key: 'start_date', label: 'Subscription start date' },
  { key: 'end_date', label: 'Subscription end date' },
];
