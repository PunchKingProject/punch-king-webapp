import { Box } from '@mui/material';
import type { TableColumn } from '../../../../components/tables/PaginatedTable.tsx';
import PaginatedTable from '../../../../components/tables/PaginatedTable.tsx';

export type MySponsorshipRow = {
  id: number;
  sponsor_name: string;
  units: number;
  amount: string; //formatted NGN
  created_at: string; // formatted local date+time
};

type Props = {
  rows: MySponsorshipRow[];
  loading?: boolean;
  totalCount?: number;
  pageIndex: number; // 0-based
  rowsPerPage: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (s: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
};

export default function DesktopMySponsorshipsTable({
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
  const columns: TableColumn<MySponsorshipRow>[] = [
    { field: 'sponsor_name', header: 'Sponsor name' },
    { field: 'units', header: 'Units' },
    { field: 'amount', header: 'Equivalent amount' },
    { field: 'created_at', header: 'Date & time' },
  ];

  return (
    <Box
      sx={{
        mt: 6,
      }}
    >
      <PaginatedTable<MySponsorshipRow>
        title='MY SPONSORSHIPS'
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
        getRowKey={(r) => String(r.id)}
      />
    </Box>
  );
}
