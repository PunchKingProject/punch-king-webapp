import { Box } from '@mui/material';
import dayjs from 'dayjs';
import PaginatedTable, {
  type TableColumn,
} from '../../../../components/tables/PaginatedTable.tsx';
import StatusChip from '../../../../components/chips/StatusChip.tsx';

export type SubHistoryRow = {
  id: number;
  subscription_type: string;
  start_date: string;
  end_date: string;
  amount_paid: string;
  status: string; // Active | Expired
};

type Props = {
  rows: SubHistoryRow[];
  loading?: boolean;
  totalCount?: number;
  pageIndex: number;
  rowsPerPage: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (s: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
};

const columns: TableColumn<SubHistoryRow>[] = [
  { field: 'subscription_type', header: 'Subscription type' },
  { field: 'start_date', header: 'start date' },
  { field: 'end_date', header: 'End date' },
  { field: 'amount_paid', header: 'Amount paid' },
  {
    field: 'status',
    header: 'Status',
    render: (v) => <StatusChip label={String(v)} />,
  },
];

export default function DesktopSubHistoryTable(props: Props) {
  return (
    <Box sx={{ mt: 6 }}>
      <PaginatedTable<SubHistoryRow>
        title='SUBSCRIPTION HISTORY'
        mode='server'
        rows={props.rows}
        columns={columns}
        loading={props.loading}
        totalCount={props.totalCount}
        pageIndex={props.pageIndex}
        rowsPerPage={props.rowsPerPage}
        onPageChange={props.onPageChange}
        onRowsPerPageChange={props.onRowsPerPageChange}
        searchFields={['subscription_type']}
        searchPlaceholder='Search'
        searchValue={props.searchValue}
        onSearchChange={props.onSearchChange}
        maxBodyHeight={420}
        getRowKey={(r) => String(r.id)}
      />
    </Box>
  );
}

/** mapper */
export const mapSubHistoryApiToRows = (
  list: Array<{
    id: number;
    type: string;
    start_date: string | null;
    end_date: string | null;
    amount_paid: number | null;
    subscription_status?: string | null;
  }>
) => {
  const fmtUSD = (n?: number | null) => {
    const v = typeof n === 'number' ? n : 0;
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      }).format(v);
    } catch {
      return `$${v.toLocaleString()}`;
    }
  };
  const status = (s?: string | null) =>
    (s ?? '').toLowerCase() === 'active' ? 'Active' : 'Expired';

  const labelize = (t?: string) =>
    (t ?? '—').replace(/[_-]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());

  return list.map((r) => ({
    id: r.id,
    subscription_type: labelize(r.type),
    start_date: r.start_date ? dayjs(r.start_date).format('M/D/YYYY') : '—',
    end_date: r.end_date ? dayjs(r.end_date).format('M/D/YYYY') : '—',
    amount_paid: fmtUSD(r.amount_paid),
    status: status(r.subscription_status),
  }));
};
