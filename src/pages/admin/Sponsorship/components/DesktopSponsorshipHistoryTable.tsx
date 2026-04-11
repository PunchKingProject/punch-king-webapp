import { Box } from '@mui/material';
import PaginatedTable, {
  type TableColumn,
} from '../../../../components/tables/PaginatedTable.tsx';
import type { SponsorVoteRow } from '../api/sponsorships.types.ts';

type Props = {
  rows: SponsorVoteRow[];
  mode?: 'client' | 'server';
  loading?: boolean;
  totalCount?: number;
  pageIndex?: number;
  rowsPerPage?: number;
  onPageChange?: (p: number) => void;
  onRowsPerPageChange?: (s: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
};

export default function DesktopSponsorshipHistoryTable({
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
}: Props) {
  const columns: TableColumn<SponsorVoteRow>[] = [
    { field: 'team_name', header: 'Team name' },
    { field: 'value', header: 'Value' },
    { field: 'volume', header: 'Volume' },
    { field: 'date', header: 'Date' },
    { field: 'time', header: 'Time' },
    // 👇 NO View column
  ];

  return (
    <Box sx={{ mt: 6 }}>
      <PaginatedTable<SponsorVoteRow>
        title='SPONSORSHIP HISTORY'
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
        searchFields={['team_name']}
        searchPlaceholder='Search'
        maxBodyHeight={430}
        getRowKey={(r) => String(r.id)}
      />
    </Box>
  );
}
