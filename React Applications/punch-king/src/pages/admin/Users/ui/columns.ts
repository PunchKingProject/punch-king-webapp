import type { TableColumn } from '../../../../components/tables/PaginatedTable';
import type { UserTableRow } from '../api/users.types';
import type { UserPurchaseRow } from '../components/DesktopUserPurchaseHistorySection';
import type { UserSponsorRow } from '../components/DesktopUserSponsorHistorySection';

export const userTableColumns: TableColumn<UserTableRow>[] = [
  { field: 'user_name', header: 'User name' },
  { field: 'phone_number', header: 'Phone number' },
  { field: 'email', header: 'Email' },
  { field: 'sponsorships', header: 'sponsorships', align: 'right' },
  { field: 'sponsor_units', header: 'sponsor Units', align: 'right' },
  // If you want an “eye” column, keep your table’s render prop/onView just like TeamsSection.
];


export const userPurchaseColumns: TableColumn<UserPurchaseRow>[] = [
  { field: 'value', header: 'Value', align: 'right' },
  { field: 'volume', header: 'Volume', align: 'right' },
  { field: 'date', header: 'Date' },
  { field: 'time', header: 'Time' },
  { field: 'source', header: 'Source' },
];

// For SPONSOR HISTORY
export const userSponsorColumns: TableColumn<UserSponsorRow>[] = [
  { field: 'team_name', header: 'Team name' },
  { field: 'value',     header: 'Value',  align: 'right' },
  { field: 'volume',    header: 'Volume', align: 'right' },
  { field: 'date',      header: 'Date' },
  { field: 'time',      header: 'Time' },
];