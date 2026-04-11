// pages/admin/Subscription/components/DesktopSubscriptionsSection.tsx
import { Box, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaginatedTable, {
  type TableColumn,
} from '../../../../components/tables/PaginatedTable.tsx';
import StatusChip from '../../../../components/chips/StatusChip.tsx';

export type SubRow = {
  id: number;
  team_id: number;
  team_name: string;
  phone_number: string;
  payment_confirmation_status: string; // from payment_status
  subs_status: string; // from subscription_status
};

type Props = {
  title?: string;
  rows: SubRow[];
  mode?: 'client' | 'server';
  loading?: boolean;
  totalCount?: number;
  pageIndex?: number; // 0-based
  rowsPerPage?: number;
  onPageChange?: (p: number) => void;
  onRowsPerPageChange?: (s: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
  onView?: (row: SubRow) => void;
};

export default function DesktopSubscriptionsSection({
  title = 'SUBSCRIPTION REQUESTS',
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
}: Props) {
  const baseCols: TableColumn<SubRow>[] = [
    { field: 'team_name', header: 'Team name' },
    { field: 'phone_number', header: 'Phone number' },
    {
      field: 'payment_confirmation_status',
      header: 'Payment confirmation status',
      render: (v) => <StatusChip label={v as string} />,
    },
    {
      field: 'subs_status',
      header: 'Subs. Status',
      render: (v) => <StatusChip label={v as string} />,
    },
  ];

  const columns: TableColumn<SubRow>[] = onView
    ? [
        ...baseCols,
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
    : baseCols;

  return (
    <Box sx={{ mt: 4 }}>
      <PaginatedTable<SubRow>
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
