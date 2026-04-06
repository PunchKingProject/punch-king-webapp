// src/pages/admin/Teams/ui/fields.ts
import type { Field } from '../../components/ScrollableSection.tsx';
import type { Team } from '../../Dashboard/api/dashboard.types.ts';

export const teamFieldData: Field<Team>[] = [
  { key: 'team_name', label: 'Team name' },
  { key: 'license_no', label: 'License No' },
  { key: 'sponsors_accrued', label: 'Sponsors accrued' },
  { key: 'ranking', label: 'Ranking' },
];


export type SponsorRow = {
  sponsor_name: string;
  value: string; // formatted currency
  volume: number; // units
  date: string; // e.g., Sep 1, 2025
  time: string; // e.g., 11:44 AM
  source?: string; // not in API yet, keep for design parity
};

export const sponsorFieldData: Field<SponsorRow>[] = [
  { key: 'sponsor_name', label: 'Sponsor name' },
  { key: 'value', label: 'Value' },
  { key: 'volume', label: 'Volume' },
  { key: 'date', label: 'Date' },
  { key: 'time', label: 'Time' },
  { key: 'source', label: 'Source' },
];