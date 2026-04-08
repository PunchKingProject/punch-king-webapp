import type { TableColumn } from "../../../../components/tables/PaginatedTable";
import type { LicenseRow } from "../components/DesktopLicensesSection";

export const licenseColumns: TableColumn<LicenseRow>[] = [
  { field: 'team_name', header: 'Team name' },
  { field: 'phone_number', header: 'Phone number' },
  {
    field: 'payment_confirmation_status',
    header: 'Payment confirmation status',
  },
  { field: 'licensing_status', header: 'Licensing Status' },
];
