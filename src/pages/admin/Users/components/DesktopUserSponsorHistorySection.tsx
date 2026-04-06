import { Box } from "@mui/material";
import type { TableColumn } from "../../../../components/tables/PaginatedTable.tsx";
import PaginatedTable from "../../../../components/tables/PaginatedTable.tsx";


export type UserSponsorRow = {
  id?: number | string;
  team_name: string;
  value: number; // NGN (equivalent_amount)
  volume: number; // units
  date: string; // 'YYYY-MM-DD'
  time: string; // 'hh:mma'
};

export type DesktopUserSponsorHistorySectionProps = {
  title?: string; // defaults to 'SPONSORSHIP HISTORY'
  rows: UserSponsorRow[];
  columns: TableColumn<UserSponsorRow>[];
  // server/client plumbing (consistent with your other sections)
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

function DesktopUserSponsorHistorySection({
  title = 'SPONSORSHIP HISTORY',
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
}: DesktopUserSponsorHistorySectionProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <PaginatedTable<UserSponsorRow>
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
        searchFields={['team_name']} // matches your design
        searchPlaceholder='Search'
        maxBodyHeight={420}
        getRowKey={(r) => String(r.id ?? `${r.team_name}-${r.date}-${r.time}`)}
      />
    </Box>
  );
}

export default DesktopUserSponsorHistorySection