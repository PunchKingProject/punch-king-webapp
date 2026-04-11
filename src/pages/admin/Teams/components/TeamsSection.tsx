import { Box, IconButton } from '@mui/material';
import type { TableColumn } from '../../../../components/tables/PaginatedTable.tsx';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaginatedTable from '../../../../components/tables/PaginatedTable.tsx';

export type TeamTableRow = {
    team_id: number;
  team_name: string;
  license_number: string | 'NIL';
  sponsors_accrued: number;
  ranking: string | number;
};

export type TeamsSectionProps = {
  title?: string;
  rows: TeamTableRow[];
  // server/client plumbing
  mode?: 'client' | 'server';
  loading?: boolean;
  totalCount?: number;
  pageIndex?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (size: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;

  // action
  onView?: (row: TeamTableRow) => void;
};

const TeamsSection = ({
  title = 'TEAMS TABLE',
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
}: TeamsSectionProps) => {
  // base columns for this table shape
  const baseColumns: TableColumn<TeamTableRow>[] = [
    { field: 'team_name', header: 'Team name' },
    { field: 'license_number', header: 'License number' },
    { field: 'sponsors_accrued', header: 'Sponsors accrued', align: 'right' },
    { field: 'ranking', header: 'Ranking', align: 'right' },
  ];

  // append “View” action when an onView handler is provided
  const columns: TableColumn<TeamTableRow>[] = onView
    ? [
        ...baseColumns,
        {
          field: 'view',
          header: 'View',
          align: 'center',
          width: 80,
          render: (_val, row) => (
            <IconButton
              aria-label='view'
              onClick={() => {
                onView(row);

                console.log(row.team_id);
              }}
            >
              <VisibilityIcon sx={{ color: '#f0c040' }} />
            </IconButton>
          ),
        },
      ]
    : baseColumns;
  return (
    <>
      <Box sx={{ mt: 4 }}>
        <PaginatedTable<TeamTableRow>
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
          searchFields={['team_name', 'license_number']}
          searchPlaceholder='Search'
          maxBodyHeight={420}
          getRowKey={(r) => String(r.team_id)}
        />
      </Box>
    </>
  );
};

export default TeamsSection;
