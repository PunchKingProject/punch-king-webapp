import { Box } from '@mui/material';
import PaginatedTable, {
  type TableColumn,
} from '../../../../components/tables/PaginatedTable.tsx';
import StatusChip from '../../../../components/chips/StatusChip.tsx';

export type MyLicenseRow = {
  id: number;
  license_name: string;
  start_date: string;
  end_date: string;
  amount_paid: string;
  status: string; // "Active" | "Expired"
};

type Props = {
  rows: MyLicenseRow[];
  loading?: boolean;
  totalCount?: number;
  pageIndex: number; // 0-based
  rowsPerPage: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (s: number) => void;
  // Search isn’t supported by the endpoint yet, but we keep the UI consistent:
  searchValue?: string;
  onSearchChange?: (q: string) => void;
  onView?: (row: MyLicenseRow) => void;
};

export default function DesktopMyLicensesTable({
  rows,
  loading,
  totalCount,
  pageIndex,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  searchValue,
  onSearchChange,
  onView,
}: Props) {
  const base: TableColumn<MyLicenseRow>[] = [
    { field: 'license_name', header: 'License name' },
    { field: 'start_date', header: 'Start date' },
    { field: 'end_date', header: 'End date' },
    { field: 'amount_paid', header: 'Amount paid' },
    {
      field: 'status',
      header: 'Status',
      render: (v) => <StatusChip label={String(v)} />,
    },
  ];

  const columns: TableColumn<MyLicenseRow>[] = onView
    ? [
        ...base,
        {
          field: 'view',
          header: 'View',
          align: 'center',
          width: 80,
          render: (_val, row) => (
            <span
              role='button'
              aria-label='view'
              style={{ cursor: 'pointer', color: '#f0c040', fontWeight: 700 }}
              onClick={() => onView(row)}
            >
              👁
            </span>
          ),
        },
      ]
    : base;

  return (
    <Box sx={{ mt: 6 }}>
      <PaginatedTable<MyLicenseRow>
        title='MY LICENSES HISTORY'
        mode='server'
        rows={rows}
        columns={columns}
        loading={loading}
        totalCount={totalCount}
        pageIndex={pageIndex}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        searchFields={['license_name']}
        searchPlaceholder='Search'
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        maxBodyHeight={420}
        getRowKey={(r) => String(r.id)}
      />
    </Box>
  );
}
