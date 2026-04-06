import { Box } from '@mui/material';
import dayjs from 'dayjs';
import PaginatedTable, {
  type TableColumn,
} from '../../../../components/tables/PaginatedTable.tsx';

export type SponsorRelatedTableRow = {
  id: number;
  date: string; // M/D/YYYY
  amount: string; // ₦ formatted
  qty: number; // units
};


type Props = {
  rows: SponsorRelatedTableRow[];
  loading?: boolean;
  totalCount?: number;
  pageIndex: number; // 0-based
  rowsPerPage: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (s: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
};

export default function DesktopSponsorRelatedHistoryTable({
  rows,
  loading,
  totalCount,
  pageIndex,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  searchValue,
  onSearchChange,
}: Props) {
  const columns: TableColumn<SponsorRelatedTableRow>[] = [
    { field: 'date', header: 'sponsorship date' },
    { field: 'amount', header: 'amount' },
    { field: 'qty', header: 'Qty', align: 'right', width: 80 },
  ];

  return (
    <Box sx={{ mt: 6 }}>
      <PaginatedTable<SponsorRelatedTableRow>
        title='SPONSORSHIP HISTORY'
        mode='server'
        rows={rows}
        columns={columns}
        loading={loading}
        totalCount={totalCount}
        pageIndex={pageIndex}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        searchFields={['date']} // simple client search by date text
        searchPlaceholder='Search'
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        maxBodyHeight={420}
        getRowKey={(r) => String(r.id)}
      />
    </Box>
  );
}

/* ---------- mapper ---------- */
function fmtNGN(n: number) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `₦${n.toLocaleString()}`;
  }
}

/** API -> table rows (fallback: units * unitPrice when equivalent_amount is 0) */
export function mapSponsorRelatedApiToRows(
  list: Array<{
    id: number;
    units: number;
    equivalent_amount: number;
    created_at: string;
  }>,
  unitPrice = 1000
): SponsorRelatedTableRow[] {
  return list.map((r) => ({
    id: r.id,
    date: dayjs(r.created_at).format('M/D/YYYY'),
    amount: fmtNGN(
      r.equivalent_amount > 0 ? r.equivalent_amount : r.units * unitPrice
    ),
    qty: r.units ?? 0,
  }));
}
