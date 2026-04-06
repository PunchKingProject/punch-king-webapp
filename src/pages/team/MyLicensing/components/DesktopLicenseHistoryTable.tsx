import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import StatusChip from '../../../../components/chips/StatusChip.tsx';
import PaginatedTable, {
  type TableColumn,
} from '../../../../components/tables/PaginatedTable.tsx';
import type {
  FetchLicenseHistoryListParams,
  LicenseHistoryList,
  LicenseHistoryListRow,
} from '../api/mylicensing.types.ts';
import { useLicenseActiveInactive } from '../hooks/useLicenseActiveInactive.ts';


export type LicenseUiRow = {
  id: number;
  license_number: string;
  start_date: string;
  end_date: string;
  amount_paid: string;
  status: string;
};

const fmt = (iso?: string | null) =>
  iso ? dayjs(iso).format('M/D/YYYY') : '—';
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

type Props = {
  searchValue?: string; // UI search box value
  onSearchChange?: (q: string) => void; // UI search handler
};

export default function DesktopLicenseHistoryTable({
  searchValue,
  onSearchChange,
}: Props) {
  // server-side pagination (like other tables)
  const [page, setPage] = useState(0); // 0-based UI
  const [pageSize, setPageSize] = useState(10);

  const params: FetchLicenseHistoryListParams = useMemo(
    () => ({
      page: page + 1,
      page_size: pageSize,
      search: searchValue || undefined,
    }),
    [page, pageSize, searchValue]
  );

  const { data, isLoading, isError } = useLicenseActiveInactive(params);

  useEffect(() => {
    if (isError) toast.error('Failed to fetch license history.');
  }, [isError]);

  const rows: LicenseUiRow[] = useMemo(() => {
    const list: LicenseHistoryListRow[] =
      (data as LicenseHistoryList | undefined)?.data ?? [];
    return list.map((r) => ({
      id: r.id,
      // backend currently doesn't send license_number; keep a placeholder
      license_number: r.license_number ?? '—',
      start_date: fmt(r.start_date),
      end_date: fmt(r.end_date),
      amount_paid: fmtNGN(r.amount_paid),
      status: (r.status || 'inactive')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (m) => m.toUpperCase()),
    }));
  }, [data]);

  const total =
    (data as LicenseHistoryList | undefined)?.metadata.total_count ?? 0;

  const columns: TableColumn<LicenseUiRow>[] = [
    { field: 'license_number', header: 'License Number' },
    { field: 'start_date', header: 'Start date' },
    { field: 'end_date', header: 'End date' },
    { field: 'amount_paid', header: 'Amount paid' },
    {
      field: 'status',
      header: 'Status',
      render: (v) => <StatusChip label={String(v)} />,
    },
    // {
    //   field: 'view',
    //   header: 'View',
    //   align: 'center',
    //   width: 80,
    // },
  ];

  return (
    <Box sx={{ mt: 6 }}>
      <PaginatedTable<LicenseUiRow>
        title='LICENSE HISTORY'
        mode='server'
        rows={rows}
        columns={columns}
        loading={isLoading}
        totalCount={total}
        pageIndex={page}
        rowsPerPage={pageSize}
        onPageChange={setPage}
        onRowsPerPageChange={setPageSize}
        searchFields={['license_number']} // client fields (UI only)
        searchPlaceholder='Search'
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        maxBodyHeight={420}
        getRowKey={(r) => String(r.id)}
      />
    </Box>
  );
}
