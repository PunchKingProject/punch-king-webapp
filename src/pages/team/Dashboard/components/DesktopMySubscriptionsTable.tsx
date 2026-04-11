// pages/team/Dashboard/components/DesktopMySubscriptionsTable.tsx
import { Box } from '@mui/material';
import PaginatedTable, {
  type TableColumn,
} from '../../../../components/tables/PaginatedTable.tsx';
import StatusChip from '../../../../components/chips/StatusChip.tsx';

export type MySubscriptionRow = {
  id: number;
  subscription_type: string;
  start_date: string;
  end_date: string;
  amount_paid: string;
  status: string; // "Active" | "Expired"
};

type Props = {
  rows: MySubscriptionRow[];
  loading?: boolean;
  totalCount?: number;
  pageIndex: number; // 0-based
  rowsPerPage: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (s: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
  onView?: (row: MySubscriptionRow) => void;
};

export default function DesktopMySubscriptionsTable({
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
  const baseCols: TableColumn<MySubscriptionRow>[] = [
    { field: 'subscription_type', header: 'Subscription type' },
    { field: 'start_date', header: 'Start date' },
    { field: 'end_date', header: 'End date' },
    { field: 'amount_paid', header: 'Amount paid' },
    {
      field: 'status',
      header: 'Status',
      render: (v) => <StatusChip label={String(v)} />,
    },
  ];

  const columns: TableColumn<MySubscriptionRow>[] = onView
    ? [
        ...baseCols,
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
    : baseCols;

  return (
    <Box sx={{ mt: 6 }}>
      <PaginatedTable<MySubscriptionRow>
        title='MY SUBSCRIPTIONS HISTORY'
        mode='server'
        rows={rows}
        columns={columns}
        loading={loading}
        totalCount={totalCount}
        pageIndex={pageIndex}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        searchFields={['subscription_type']}
        searchPlaceholder='Search'
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        maxBodyHeight={420}
        getRowKey={(r) => String(r.id)}
      />
    </Box>
  );
}
