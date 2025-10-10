// src/pages/team/MyLicensing/components/DesktopLicensePaymentHistoryTable.tsx
import { Box, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from 'dayjs';
import PaginatedTable, {
  type TableColumn,
} from '../../../../components/tables/PaginatedTable';
import StatusChip from '../../../../components/chips/StatusChip';
import { useEffect, useMemo, useState } from 'react';
import { useLicensePaymentHistory } from '../hooks/useLicensePaymentHistory';

export type LicensePaymentRow = {
  id: number;
  license_type: string; // shown in UI
  amount_paid: string; // formatted
  payment_date: string; // formatted M/D/YYYY
  status: string; // license_status || payment_status || status
  payment_slip?: string | null;
};

type Props = {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  onViewSlip?: (url?: string | null) => void; // optional handler
};

export default function DesktopLicensePaymentHistoryTable({
  startDate,
  endDate,
  onViewSlip,
}: Props) {
  const [pageIndex, setPageIndex] = useState(0); // 0-based for UI
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState(''); // UI only (endpoint has no search)

  // reset to first page when filter changes
  useEffect(() => setPageIndex(0), [startDate, endDate]);

  const { data, isLoading } = useLicensePaymentHistory({
    page: pageIndex + 1,
    page_size: rowsPerPage,
    start_date: startDate,
    end_date: endDate,
  });

  const rows: LicensePaymentRow[] = useMemo(() => {
    const list = data?.data ?? [];
    const fmtNGN = (n?: number | null) =>
      new Intl.NumberFormat('en-NG').format(typeof n === 'number' ? n : 0);
    const nice = (s?: string | null) => (s ? dayjs(s).format('M/D/YYYY') : '—');

    return list.map((r) => ({
      id: r.id,
      license_type: r.license_type ?? r.team?.license_number ?? '—',
      amount_paid: fmtNGN(r.payment_amount),
      payment_date: nice(r.payment_date),
      status: String(
        r.license_status ?? r.payment_status ?? r.status ?? 'Pending'
      ),
      payment_slip: r.payment_slip ?? null,
    }));
  }, [data]);

  const total = data?.metadata.total_count ?? 0;

  const columns: TableColumn<LicensePaymentRow>[] = [
    { field: 'license_type', header: 'License type' },
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
      render: (_val, row) => (
        <IconButton
          aria-label='view'
          size='small'
          sx={{ color: '#f0c040' }}
          onClick={() => onViewSlip?.(row.payment_slip)}
        >
          <VisibilityIcon fontSize='small' />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 6 }}>
      <PaginatedTable<LicensePaymentRow>
        title='LICENSE PAYMENT HISTORY'
        mode='server'
        rows={rows}
        columns={columns}
        loading={isLoading}
        totalCount={total}
        pageIndex={pageIndex}
        rowsPerPage={rowsPerPage}
        onPageChange={setPageIndex}
        onRowsPerPageChange={setRowsPerPage}
        searchFields={['license_type']}
        searchPlaceholder='Search'
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        maxBodyHeight={420}
        getRowKey={(r) => String(r.id)}
      />
    </Box>
  );
}
