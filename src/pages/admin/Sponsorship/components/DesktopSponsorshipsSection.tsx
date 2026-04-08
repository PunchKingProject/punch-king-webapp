import { Box, IconButton } from "@mui/material";
import PaginatedTable, { type TableColumn } from "../../../../components/tables/PaginatedTable";
import StatusChip from "../../../../components/chips/StatusChip";
import VisibilityIcon from '@mui/icons-material/Visibility';



export type SponsorshipRow = {
  id: number;
  team_id: number; // 👈 add this
  sponsor_name: string;
  phone_number: string;
  payment_confirmation_status: string; // from payment_status
  sponsorship_status: string; // from purchase_status
};

type Props = {
  title?: string;
  rows: SponsorshipRow[];
  mode?: 'client' | 'server';
  loading?: boolean;
  totalCount?: number;
  pageIndex?: number; // 0-based
  rowsPerPage?: number;
  onPageChange?: (p: number) => void;
  onRowsPerPageChange?: (s: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
  onView?: (row: SponsorshipRow) => void;
};


export default function DesktopSponsorshipsSection({
  title = 'SPONSORSHIP REQUESTS',
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
  const baseCols: TableColumn<SponsorshipRow>[] = [
    { field: 'sponsor_name', header: 'Sponsor name' },
    { field: 'phone_number', header: 'Phone number' },
    {
      field: 'payment_confirmation_status',
      header: 'Payment confirmation status',
      render: (v) => <StatusChip label={v as string} />,
    },
    {
      field: 'sponsorship_status',
      header: 'Sponsorship Status',
      render: (v) => <StatusChip label={v as string} />,
    },
  ];

  const columns: TableColumn<SponsorshipRow>[] = onView
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
      <PaginatedTable<SponsorshipRow>
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
        searchFields={['sponsor_name', 'phone_number']}
        searchPlaceholder='Search'
        maxBodyHeight={420}
        getRowKey={(r) => String(r.id)}
      />
    </Box>
  );
}
