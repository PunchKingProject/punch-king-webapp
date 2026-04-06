import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import { Box, IconButton } from '@mui/material';
import PaginatedTable, {
  type TableColumn,
} from '../../../../components/tables/PaginatedTable.tsx';

export type PaymentHistoryRow = {
  id: number;
  username: string;
  payment_date: string; // M/D/YYYY
  amount_paid: string; // formatted NGN
  units: number;
  slip?: string | null;
};

type Props = {
  rows: PaymentHistoryRow[];
  mode?: 'client' | 'server';
  loading?: boolean;
  totalCount?: number;
  pageIndex?: number; // 0-based
  rowsPerPage?: number;
  onPageChange?: (p: number) => void;
  onRowsPerPageChange?: (s: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
  onViewSlip?: (row: PaymentHistoryRow) => void;
};

export default function DesktopSponsorshipPaymentHistoryTable({
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
  onViewSlip,
}: Props) {
  const columns: TableColumn<PaymentHistoryRow>[] = [
    { field: 'username', header: 'User name' },
    { field: 'payment_date', header: 'Payment date' },
    { field: 'amount_paid', header: 'Amount paid' },
    { field: 'units', header: 'Sponsorship units' },
    {
      // ✅ action column uses a dummy field to satisfy the type
      field: '_actions',
      header: 'View',
      width: 80,
      render: (_value, row) =>
        row.slip ? (
          <IconButton
            size='small'
            sx={{ color: '#EFAF00' }}
            onClick={() => onViewSlip?.(row)}
            aria-label='View'
          >
            <VisibilityRounded fontSize='small' />
          </IconButton>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <Box sx={{ mt: 6 }}>
      <PaginatedTable<PaymentHistoryRow>
        title='SPONSORSHIP PAYMENT HISTORY'
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
        searchFields={['username', 'payment_date']}
        searchPlaceholder='Search'
        maxBodyHeight={430}
        getRowKey={(r) => String(r.id)}
      />
    </Box>
  );
}
