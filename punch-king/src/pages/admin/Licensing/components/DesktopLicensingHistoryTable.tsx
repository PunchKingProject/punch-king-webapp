// pages/admin/Licensing/components/DesktopLicensingHistoryTable.tsx
import { Box, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaginatedTable, {
  type TableColumn,
} from '../../../../components/tables/PaginatedTable.tsx';

export type LicenseHistoryRow = {
  id: number;
  licensing_name: string; // e.g. "Licensing 3134275" (or any label you want)
  payment_date: string; // already formatted for display, e.g. "6/16/2025"
  start_date: string; // "—" if null
  end_date: string; // "—" if null
};

type Props = {
  rows: LicenseHistoryRow[];
  // server/client plumbing (same API as your other sections if you want server mode later)
  mode?: 'client' | 'server';
  loading?: boolean;
  totalCount?: number;
  pageIndex?: number;
  rowsPerPage?: number;
  onPageChange?: (p: number) => void;
  onRowsPerPageChange?: (s: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
  onView?: (row: LicenseHistoryRow) => void;
};

export default function DesktopLicensingHistoryTable({
  rows,
  mode = 'client',
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
  const columns: TableColumn<LicenseHistoryRow>[] = [
    { field: 'licensing_name', header: 'Licensing name' },
    { field: 'payment_date', header: 'Payment date' },
    { field: 'start_date', header: 'Sub start date' },
    { field: 'end_date', header: 'Sub end date' },
    ...(onView
      ? ([
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
        ] as TableColumn<LicenseHistoryRow>[])
      : []),
  ];

  return (
    <Box sx={{ mt: 6 }}>
      <PaginatedTable<LicenseHistoryRow>
        title='LICENSING HISTORY'
        rows={rows}
        columns={columns}
        mode={mode}
        loading={loading}
        totalCount={totalCount}
        pageIndex={pageIndex}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onSearchChange={onSearchChange}
        searchValue={searchValue}
        searchFields={['licensing_name']}
        searchPlaceholder='Search'
        maxBodyHeight={430}
        getRowKey={(r) => String(r.id)}
      />
    </Box>
  );
}
