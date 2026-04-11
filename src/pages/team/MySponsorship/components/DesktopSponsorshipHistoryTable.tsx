import { Box } from '@mui/material';
import dayjs from 'dayjs';
import type { TableColumn } from '../../../../components/tables/PaginatedTable.tsx';
import PaginatedTable from '../../../../components/tables/PaginatedTable.tsx';

export type SponsorshipRow = {
  id: string;
  sponsor_id: number; // 👈 add this
  sponsor_name: string;
  date: string; // M/D/YYYY
  amount: string; // $ formatted
  qty: number; // units
};

type Props = {
  rows: SponsorshipRow[];
  loading?: boolean;
  totalCount?: number;
  pageIndex: number; // 0-based
  rowsPerPage: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (s: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
  onView?: (row: SponsorshipRow) => void;
};

export default function DesktopSponsorshipHistoryTable({
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
  const cols: TableColumn<SponsorshipRow>[] = [
    { field: 'sponsor_name', header: 'Sponsors name' },
    { field: 'date', header: 'sponsorship date' },
    { field: 'amount', header: 'amount' },
    { field: 'qty', header: 'Qty', align: 'right', width: 80 },
  ];

  const columns: TableColumn<SponsorshipRow>[] = onView
    ? [
        ...cols,
        {
          field: 'view',
          header: 'View',
          align: 'center',
          width: 80,
          render: (_v, row) => (
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
    : cols;

  return (
    <Box sx={{ mt: 6 }}>
      <PaginatedTable<SponsorshipRow>
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
        searchFields={['sponsor_name']}
        searchPlaceholder='Search'
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        maxBodyHeight={420}
        getRowKey={(r) => r.id}
      />
    </Box>
  );
}

// ---------- mapper ----------
function fmtUSD(n: number) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${n.toLocaleString()}`;
  }
}

/**
 * Map API -> table rows
 * If `sponsorship_equivalent_cash` is 0/missing, we fallback to qty * unitPrice.
 */
export function mapApiToRows(
  list: Array<{
    sponsor_id: number;
    sponsor_name: string;
    sponsorship_date: string;
    sponsorship_amount: number;
    sponsorship_equivalent_cash: number;
  }>,
  unitPrice = 1000
): SponsorshipRow[] {
  return list.map((r, idx) => {
    const qty = Number(r.sponsorship_amount ?? 0);
    const cash =
      typeof r.sponsorship_equivalent_cash === 'number' &&
      r.sponsorship_equivalent_cash > 0
        ? r.sponsorship_equivalent_cash
        : qty * unitPrice;

    return {
      id: `${r.sponsor_id}-${idx}-${r.sponsorship_date}`,
      sponsor_id: r.sponsor_id,
      sponsor_name: r.sponsor_name,
      date: dayjs(r.sponsorship_date).format('M/D/YYYY'),
      amount: fmtUSD(cash),
      qty,
    };
  });
}
