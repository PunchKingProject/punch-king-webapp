// pages/admin/Sponsorships/ui/fields.ts
import type { Field } from '../../components/ScrollableSection.tsx';

export type SponsorshipListItem = {
  id?: number;
  team_id: number; // we need this to navigate to details
  sponsor_name: string;
  phone_number: string;
  payment_confirmation_status: 'Pending' | 'Failed' | 'Confirmed' | '—';
  sponsorship_status: 'Pending' | 'Processed' | 'Failed' | '—';
};

export const sponsorshipFieldData: Field<SponsorshipListItem>[] = [
  { key: 'sponsor_name', label: 'Team name' },
  { key: 'phone_number', label: 'Phone number' },
  { key: 'payment_confirmation_status', label: 'Payment confirmation status' },
  { key: 'sponsorship_status', label: 'Sponsorship status' },
];
