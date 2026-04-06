import { Box } from '@mui/material';
import dayjs from 'dayjs';
import PaginatedTable, {
  type TableColumn,
} from '../../../../components/tables/PaginatedTable.tsx';
import StatusChip from '../../../../components/chips/StatusChip.tsx';

export type SubPaymentRow = {
  id: number;
  subscription_type: string;
  amount_paid: string;
  payment_date: string;
  status: string; // "Processing" | "Processed" | "Failed"
  payment_slip?: string | null;
};

type Props = {
  rows: SubPaymentRow[];
  loading?: boolean;
  totalCount?: number;
  pageIndex: number;
  rowsPerPage: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (s: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
  onViewSlip?: (row: SubPaymentRow) => void;
};

const columns: TableColumn<SubPaymentRow>[] = [
  { field: 'subscription_type', header: 'Subscription type' },
  { field: 'amount_paid', header: 'Amount paid' },
  { field: 'payment_date', header: 'Payment date' },
  {
    field: 'status',
    header: 'Status',
    render: (v) => <StatusChip label={String(v)} />,
  },
  {
    field: 'view',
    header: 'View',
    align: 'center',
    width: 80,
    render: (_v, row) =>
      row.payment_slip ? (
        <span
          role='button'
          aria-label='view'
          style={{ cursor: 'pointer', color: '#f0c040', fontWeight: 700 }}
          onClick={() =>
            window.open(row.payment_slip as string, '_blank', 'noopener')
          }
        >
          👁
        </span>
      ) : (
        '—'
      ),
  },
];

export default function DesktopSubPaymentHistoryTable(props: Props) {
  return (
    <Box sx={{ mt: 6 }}>
      <PaginatedTable<SubPaymentRow>
        title='SUBSCRIPTION PAYMENT HISTORY'
        mode='server'
        rows={props.rows}
        columns={columns}
        loading={props.loading}
        totalCount={props.totalCount}
        pageIndex={props.pageIndex}
        rowsPerPage={props.rowsPerPage}
        onPageChange={props.onPageChange}
        onRowsPerPageChange={props.onRowsPerPageChange}
        searchFields={['subscription_type']} // client filter inside component
        searchPlaceholder='Search'
        searchValue={props.searchValue}
        onSearchChange={props.onSearchChange}
        maxBodyHeight={420}
        getRowKey={(r) => String(r.id)}
      />
    </Box>
  );
}

/** helpers to map API → table rows */
export const mapPaymentApiToRows = (
  list: Array<{
    id: number;
    type: string;
    payment_date: string | null;
    payment_amount: number | null;
    payment_slip?: string | null;
    payment_status?: string | null;
  }>
) => {
  const fmtNGN = (n?: number | null) => {
    const v = typeof n === 'number' ? n : 0;
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 2,
      }).format(v);
    } catch {
      return `₦${v.toLocaleString()}`;
    }
  };
  const status = (s?: string | null) => {
    const v = (s ?? '').toLowerCase();
    if (v === 'confirmed' || v === 'processed' || v === 'success')
      return 'Processed';
    if (v === 'failed') return 'Failed';
    return 'Processing';
  };

  return list.map((r) => ({
    id: r.id,
    subscription_type:
      r.type?.replace(/[_-]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()) ||
      '—',
    amount_paid: fmtNGN(r.payment_amount),
    payment_date: r.payment_date
      ? dayjs(r.payment_date).format('M/D/YYYY')
      : '—',
    status: status(r.payment_status),
    payment_slip: r.payment_slip ?? undefined,
  }));
};
