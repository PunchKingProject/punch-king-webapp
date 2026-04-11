import { Box } from "@mui/material";
import type { TableColumn } from "../../../../components/tables/PaginatedTable.tsx";
import PaginatedTable from "../../../../components/tables/PaginatedTable.tsx";



export type UserPurchaseRow = {
  id?: number | string;
  value: number; // USD amount
  volume: number; // sponsorship_points
  date: string; // 'YYYY-MM-DD'
  time: string; // 'hh:mma'
  source: string; // Bank/Cash/Paystack/etc.
};


export type DesktopUserPurchaseHistorySectionProps = {
  title?: string; // defaults to 'SPONSORSHIP PURCHASE HISTORY'
  rows: UserPurchaseRow[];
  columns: TableColumn<UserPurchaseRow>[];
  // server/client plumbing (same as Teams/Users)
  mode?: 'client' | 'server';
  loading?: boolean;
  totalCount?: number;
  pageIndex?: number; // 0-based
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (size: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
};


export default function DesktopUserPurchaseHistorySection({
  title = 'SPONSORSHIP PURCHASE HISTORY',
  rows,
  columns,
  mode = 'server',
  loading,
  totalCount,
  pageIndex,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  searchValue,
  onSearchChange,
}: DesktopUserPurchaseHistorySectionProps) {
  return (
    <Box  sx={{ mt: 4 }}>
      <PaginatedTable<UserPurchaseRow>
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
        searchFields={['source']} // table-side search field
        searchPlaceholder='Search'
        maxBodyHeight={420}
        getRowKey={(r) =>
          String(
            r.id ?? `${r.date}-${r.time}-${r.value}-${r.volume}-${r.source}`
          )
        }
      />
    </Box>
  );
}