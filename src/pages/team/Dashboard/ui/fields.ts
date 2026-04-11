import type { Field } from '../../../admin/components/ScrollableSection';

/* ---------- Sponsorship History ---------- */
export type TeamSponsorshipRow = {
  idx: number;
  sponsor_name: string;
  date: string;
  amount_paid: string; // already formatted as NGN string
  units: number;
};

export const teamSponsorshipFields: Field<TeamSponsorshipRow>[] = [
  { key: 'sponsor_name', label: 'Sponsor name' },
  { key: 'date', label: 'Sponsorship date' },
  { key: 'amount_paid', label: 'Amount paid' },
  { key: 'units', label: 'Sponsorship units' },
];

/* ---------- Subscription History ---------- */
export type TeamSubscriptionRow = {
  idx: number;
  subscription_type: string;
  start_date: string;
  end_date: string;
  amount_paid: string; // NGN string
  status: string; // "Active" | "Expired" | "—"
};

export const teamSubscriptionFields: Field<TeamSubscriptionRow>[] = [
  { key: 'subscription_type', label: 'Subscription type' },
  { key: 'start_date', label: 'Start date' },
  { key: 'end_date', label: 'End date' },
  { key: 'amount_paid', label: 'Amount paid' },
  { key: 'status', label: 'Status' },
];

/* ---------- License History ---------- */
export type TeamLicenseRow = {
  idx: number;
  license_name: string;
  start_date: string;
  end_date: string;
  amount_paid: string; // NGN string
  status: string;
};

export const teamLicenseFields: Field<TeamLicenseRow>[] = [
  { key: 'license_name', label: 'LICENSE name' },
  { key: 'start_date', label: 'Start date' },
  { key: 'end_date', label: 'End date' },
  { key: 'amount_paid', label: 'Amount paid' },
  { key: 'status', label: 'Status' },
];
