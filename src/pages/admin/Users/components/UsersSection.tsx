import { Box, IconButton } from '@mui/material';
import type { TableColumn } from '../../../../components/tables/PaginatedTable.tsx';
import PaginatedTable from '../../../../components/tables/PaginatedTable.tsx';
import type { UserTableRow } from '../api/users.types.ts';
import VisibilityIcon from '@mui/icons-material/Visibility';

type Props = {
  title?: string;
  rows: UserTableRow[];
  columns: TableColumn<UserTableRow>[];
  mode: 'server';
  loading: boolean;
  totalCount: number;
  pageIndex: number; // 0-based UI
  rowsPerPage: number;
  onPageChange: (next: number) => void;
  onRowsPerPageChange: (n: number) => void;
  searchValue: string;
  onSearchChange: (q: string) => void;
  onView?: (row: UserTableRow) => void; // optional eye icon handler
};

export default function UsersSection({
  title = 'USERS TABLE',
  rows,
  columns,
  mode,
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
  // If onView is provided, append a trailing action column (same hack as Teams)
  const computedColumns: TableColumn<UserTableRow>[] = onView
    ? [
        ...columns,
        {
          field: '__view__',
          header: 'View',
          align: 'center',
          width: 80,
          render: (_val, row) => (
            <IconButton
              aria-label='view'
              onClick={() => onView(row)}
              size='small'
            >
              <VisibilityIcon sx={{ color: '#f0c040' }} />
            </IconButton>
          ),
        },
      ]
    : columns;
  return (
    <Box sx={{ mt: 4 }}>
      <PaginatedTable<UserTableRow>
        title={title}
        rows={rows}
        columns={computedColumns}
        mode={mode}
        loading={loading}
        totalCount={totalCount}
        pageIndex={pageIndex}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchFields={['user_name', 'phone_number', 'email']}
        searchPlaceholder='Search'
        maxBodyHeight={420}
        getRowKey={(r) => String(r.sponsor_id)}
      />
    </Box>
  );
}
