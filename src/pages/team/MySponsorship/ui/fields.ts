// src/pages/team/MySponsorship/ui/fields.ts

import type { Field } from "../../../admin/components/ScrollableSection.tsx";

export type MobileSponsorshipItem = {
  sponsor_id: number;
  sponsor_name: string;
  sponsorship_date: string; // display-ready
  amount: string; // stringified USD
  qty: string; // stringified units
};

export const sponsorshipHistoryFieldData: Field<MobileSponsorshipItem>[] = [
  { key: 'sponsor_name', label: 'Sponsor' },
  { key: 'sponsorship_date', label: 'Date' },
  { key: 'qty', label: 'Units' },
  { key: 'amount', label: 'Amount' },
];

export type MobileSponsorRelatedItem = {
  id: number;
  date: string; // display-ready (D/M/YYYY)
  units: string; // stringified
  amount: string; // stringified
  team_name?: string | null;
};

export const sponsorRelatedFieldData: Field<MobileSponsorRelatedItem>[] = [
  { key: 'date', label: 'Date' },
  { key: 'units', label: 'Units' },
  { key: 'amount', label: 'Amount' },
  { key: 'team_name', label: 'Team' },
];
