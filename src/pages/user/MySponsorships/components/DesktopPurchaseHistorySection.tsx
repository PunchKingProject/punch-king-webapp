// NEW
import { Box, IconButton } from '@mui/material';
import PaginatedTable, {
  type TableColumn,
} from '../../../../components/tables/PaginatedTable.tsx';
import StatusChip from '../../../../components/chips/StatusChip.tsx';
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from 'dayjs';
import type { PurchaseHistoryRow } from '../api/mysponsorships.types.ts';

export type PurchaseRow = {
  id: number;
  payment_date: string; // formatted
  amount_paid: number;
  sponsorship_units: number;
  status: string; // purchase_status -> chip
  spent_units: string; // 'NA' | number as string
  payment_slip?: string;
};

type Props = {
  title?: string;
  rows: PurchaseRow[];
  mode?: 'client' | 'server';
  loading?: boolean;
  totalCount?: number;
  pageIndex?: number; // 0-based
  rowsPerPage?: number;
  onPageChange?: (p: number) => void;
  onRowsPerPageChange?: (s: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
  onViewSlip?: (row: PurchaseRow) => void;
};

export function mapApiToRows(apiRows: PurchaseHistoryRow[]): PurchaseRow[] {
  return apiRows.map((r) => ({
    id: r.id,
    payment_date: dayjs(r.payment_date).format('M/D/YYYY'),
    amount_paid: r.payment_amount,
    sponsorship_units: r.sponsorship_points,
    status: r.purchase_status,
    spent_units:
      r.purchase_status === 'processed' ? String(r.sponsorship_points) : 'NA',
    payment_slip: r.payment_slip,
  }));
}

export default function DesktopPurchaseHistorySection({
  title = 'SPONSORSHIP PURCHASE HISTORY',
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
  onViewSlip,
}: Props) {
  const columns: TableColumn<PurchaseRow>[] = [
    { field: 'payment_date', header: 'Payment date' },
    { field: 'amount_paid', header: 'Amount paid' },
    { field: 'sponsorship_units', header: 'Sponsorship units' },
    {
      field: 'status',
      header: 'Status',
      render: (v) => <StatusChip label={String(v)} />,
    },
    { field: 'spent_units', header: 'Spent units' },
    {
      field: 'view',
      header: 'View',
      align: 'center',
      width: 80,
      render: (_v, row) => (
        <IconButton
          aria-label='view'
          onClick={() => onViewSlip?.(row)}
          disabled={!row.payment_slip}
        >
          <VisibilityIcon sx={{ color: '#f0c040' }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <PaginatedTable<PurchaseRow>
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
        searchFields={['payment_date', 'status']}
        searchPlaceholder='Search'
        maxBodyHeight={420}
        getRowKey={(r) => String(r.id)}
      />
    </Box>
  );
}
