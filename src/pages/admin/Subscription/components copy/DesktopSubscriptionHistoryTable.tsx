import { Box, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaginatedTable, {
  type TableColumn,
} from '../../../../components/tables/PaginatedTable.tsx';

export type SubHistoryRow = {
  id: number;
  category: string; // monthly / annual, etc.
  payment_date: string;
  start_date: string; // '—' if null
  end_date: string; // '—' if null
};

type Props = {
  rows: SubHistoryRow[];
  onView?: (row: SubHistoryRow) => void;
};

export default function DesktopSubscriptionHistoryTable({
  rows,
  onView,
}: Props) {
  const columns: TableColumn<SubHistoryRow>[] = [
    { field: 'category', header: 'Subscription category' },
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
        ] as TableColumn<SubHistoryRow>[])
      : []),
  ];
  return (
    <Box sx={{ mt: 6 }}>
      <PaginatedTable<SubHistoryRow>
        title='SUBSCRIPTION HISTORY'
        rows={rows}
        columns={columns}
        mode='client'
        maxBodyHeight={430}
        searchFields={['category']}
        searchPlaceholder='Search'
        getRowKey={(r) => String(r.id)}
      />
    </Box>
  );
}
