import type { TableColumn } from "../../../../components/tables/PaginatedTable.tsx";
import type { Team, UserSponsorship } from "../api/dashboard.types.ts";



export const teamColumns: TableColumn<Team>[] = [
  { field: 'team_name', header: 'Team name' },
  { field: 'license_no', header: 'License number' },
  { field: 'sponsors_accrued', header: 'Sponsors accrued', align: 'right' },
  { field: 'ranking', header: 'Ranking', align: 'right' },
];

export const rankedUserColumns: TableColumn<UserSponsorship>[] = [
  { field: 'user_name', header: 'User name' },
  { field: 'email', header: 'Email' },
  { field: 'phone_number', header: 'Phone number' },
  {
    field: 'sponsors_purchased',
    header: 'Points purchased',
    align: 'right',
  },
  {
    field: 'sponsors_used',
    header: 'Amount sponsored',
    align: 'right',
  },
];
