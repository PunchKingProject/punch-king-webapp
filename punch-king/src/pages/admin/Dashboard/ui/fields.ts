import type { Field } from '../../components/ScrollableSection.tsx';
import type { Team, UserSponsorship } from '../api/dashboard.types.ts';

export const teamFieldData: Field<Team>[] = [
  { key: 'team_name', label: 'Team name' },
  { key: 'license_no', label: 'License No' },
  { key: 'sponsors_accrued', label: 'Sponsors accrued' },
  { key: 'ranking', label: 'Ranking' },
];

export const userSponsorshipFieldData: Field<UserSponsorship>[] = [
  { key: 'user_name', label: 'User name' },
  { key: 'phone_number', label: 'Phone number' },
  { key: 'sponsors_purchased', label: 'Sponsors purchased' },
  { key: 'sponsors_used', label: 'Sponsors used' },
];
