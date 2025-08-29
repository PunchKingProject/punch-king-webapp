import { Box } from '@mui/material';
import PaginatedTable, {
  type TableColumn,
} from '../../../components/tables/PaginatedTable';

export type TeamRow = {
  team_name: string;
  license_no: string;
  sponsors_accrued: number;
  ranking: string | number;
};

export type TeamsSectionProps = {
  title?: string;
  rows: TeamRow[];
  columns: TableColumn<TeamRow>[];
  // pass-throughs (so this section can work in client or server mode)
  mode?: 'client' | 'server';
  loading?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
  pageIndex?: number;
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (size: number) => void;
};

export default function TeamsSection({
  title = 'TEAMS by ranking',
  rows,
  columns,
  mode = 'client',
  loading,
  searchPlaceholder = 'Search',
  searchValue,
  onSearchChange,
  pageIndex,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
}: TeamsSectionProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <PaginatedTable<TeamRow>
        title={title}
        rows={rows}
        columns={columns}
        searchFields={['team_name', 'license_no']}
        searchPlaceholder={searchPlaceholder}
        // server-mode support
        mode={mode}
        loading={loading}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        pageIndex={pageIndex}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        getRowKey={(r) => `${r.team_name}-${r.license_no}`}
      />
    </Box>
  );
}
