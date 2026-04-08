import type { Field } from '../../components/ScrollableSection.tsx';
import type { UserListItem } from '../MobileUserDashboard.tsx';

/** Card-style fields for the Mobile Users list */
export const userSponsorshipFieldData: Field<UserListItem>[] = [
  {
    key: 'user_name',
    label: 'User name',
  },
  {
    key: 'phone_number',
    label: 'Phone number',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'sponsorships',
    label: 'Sponsorships',
  },
  {
    key: 'sponsor_units',
    label: 'Sponsorship units',
  },
];


export type PurchaseRow = {
  value: string; // formatted USD string
  volume: number; // units
  date: string; // YYYY-MM-DD
  time: string; // hh:mma
  source: string; // bank/from/into or "—"
};

export const purchaseFieldData: Field<PurchaseRow>[] = [
  { key: 'value', label: 'Value' },
  { key: 'volume', label: 'Volume' },
  { key: 'date', label: 'Date' },
  { key: 'time', label: 'Time' },
  { key: 'source', label: 'Source' },
];

export type SponsorRow = {
  team_name: string;
  value: string; // formatted USD string
  volume: number; // units
  date: string; // YYYY-MM-DD
  time: string; // hh:mma
};

export const sponsorFieldData: Field<SponsorRow>[] = [
  { key: 'team_name', label: 'Team name' },
  { key: 'value', label: 'Value' },
  { key: 'volume', label: 'Volume' },
  { key: 'date', label: 'Date' },
  { key: 'time', label: 'Time' },
];