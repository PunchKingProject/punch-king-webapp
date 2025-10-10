import { Box, IconButton } from '@mui/material';
import type { TableColumn } from '../../../../components/tables/PaginatedTable';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaginatedTable from '../../../../components/tables/PaginatedTable';
import StatusChip from '../../../../components/chips/StatusChip';

export type LicenseRow = {
  id: number;
  team_id: number;
  team_name: string;
  phone_number: string;
  payment_confirmation_status: string; // from payment_status
  licensing_status: string; // from license_status
};

export type DesktopLicensesSectionProps = {
  title?: string;
  rows: LicenseRow[];
  mode?: 'client' | 'server';
  loading?: boolean;
  totalCount?: number;
  pageIndex?: number; // 0-based
  rowsPerPage?: number;
  onPageChange?: (p: number) => void;
  onRowsPerPageChange?: (s: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
  onView?: (row: LicenseRow) => void;
};

export default function DesktopLicensesSection({
  title = 'LICENSE REQUESTS',
  rows,
  mode = 'server',
  loading,
  totalCount,
  pageIndex,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  searchValue,
  onSearchChange,
  onView,
}: DesktopLicensesSectionProps) {
  const baseColumns: TableColumn<LicenseRow>[] = [
    { field: 'team_name', header: 'Team name' },
    { field: 'phone_number', header: 'Phone number' },
    {
      field: 'payment_confirmation_status',
      header: 'Payment confirmation status',
      render: (value) => <StatusChip label={value as string} />,
    },
    {
      field: 'licensing_status',
      header: 'Licensing Status',
      render: (value) => <StatusChip label={value as string} />,
    },
  ];

  const columns: TableColumn<LicenseRow>[] = onView
    ? [
        ...baseColumns,
        {
          field: 'view',
          header: 'View',
          align: 'center',
          width: 80,
          render: (_val, row) => (
            <IconButton aria-label='view' onClick={() => onView(row)}>
              <VisibilityIcon sx={{ color: '#f0c040' }} />
            </IconButton>
          ),
        },
      ]
    : baseColumns;

  return (
    <Box sx={{ mt: 4 }}>
      <PaginatedTable<LicenseRow>
        title={title}
        rows={rows}
        columns={columns}
        mode={mode}
        loading={loading}
        totalCount={totalCount}
        pageIndex={pageIndex}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchFields={['team_name', 'phone_number']}
        searchPlaceholder='Search'
        maxBodyHeight={420}
        getRowKey={(r) => String(r.id)}
      />
    </Box>
  );
}
