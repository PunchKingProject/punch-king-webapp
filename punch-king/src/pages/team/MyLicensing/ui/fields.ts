// src/pages/team/MyLicensing/ui/fields.ts
import type { Field } from '../../../admin/components/ScrollableSection.tsx';

export type LicensePaymentRow = {
  id: number;
  license_name: string; // e.g. "NBDC"
  amount_paid: string; // formatted NGN
  payment_date: string; // M/D/YYYY
  status: string; // "Processing" | "Processed" | "Failed"
  payment_slip?: string | null;
};

export const licensePaymentFields: Field<LicensePaymentRow>[] = [
  { key: 'license_name', label: 'License name' },
  { key: 'amount_paid', label: 'amount paid' },
  { key: 'payment_date', label: 'Payment date' },
  { key: 'status', label: 'Status' },
];

export type LicenseHistoryRow = {
  id: number;
  license_number: string;
  start_date: string;
  end_date: string;
  amount_paid: string;
  status: string; // "Active" | "Expired"
};

export const licenseHistoryFields: Field<LicenseHistoryRow>[] = [
  { key: 'license_number', label: 'License Number' },
  { key: 'start_date', label: 'Start date' },
  { key: 'end_date', label: 'End date' },
  { key: 'amount_paid', label: 'Amount paid' },
  { key: 'status', label: 'Status' },
];
