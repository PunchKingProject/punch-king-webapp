// TeamsSection.tsx
import { Box, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { TableColumn } from '../../../../components/tables/PaginatedTable.tsx';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaginatedTable from '../../../../components/tables/PaginatedTable.tsx';

export type TeamTableRow = {
  team_id: number;
  team_name: string;
  license_number: string | 'NIL';
  sponsors_accrued: number;
  email: string;
  phone_number: string;
  address: string;
  has_subscription: string;
  subscription_type: string;
  ranking: string | number;
};

export type TeamsSectionProps = {
  title?: string;
  rows: TeamTableRow[];
  mode?: 'client' | 'server';
  loading?: boolean;
  totalCount?: number;
  pageIndex?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (size: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
  onView?: (row: TeamTableRow) => void;

  // sort
  sortBy?: 'newest' | 'ranking';
  onSortChange?: (sort: 'newest' | 'ranking') => void;
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
                        sortBy = 'newest',
                        onSortChange,
                      }: TeamsSectionProps) => {
  const baseColumns: TableColumn<TeamTableRow>[] = [
    { field: 'team_name', header: 'Team name' },
    { field: 'license_number', header: 'License number' },
    { field: 'sponsors_accrued', header: 'Sponsors accrued', align: 'right' },
    { field: 'email', header: 'Email' },
    { field: 'phone_number', header: 'Phone number' },
    { field: 'address', header: 'Address' },
    { field: 'has_subscription', header: 'Has Subscription' },
    { field: 'subscription_type', header: 'Subscription type' },
    { field: 'ranking', header: 'Ranking', align: 'right' },
  ];

  const columns: TableColumn<TeamTableRow>[] = onView
    ? [
      ...baseColumns,
      {
        field: 'view',
        header: 'View',
        align: 'center',
        width: 80,
        render: (_val, row) => (
          <IconButton aria-label='view' onClick={() => onView(row)}>
            <VisibilityIcon sx={{ color: '#f0c040' }} />
          </IconButton>
        ),
      },
    ]
    : baseColumns;

  const sortToolbar = (
    <FormControl size='small' sx={{ minWidth: 160 }}>
      <InputLabel
        sx={{
          color: '#cfcfcf',
          '&.Mui-focused': { color: '#f0c040' },
        }}
      >
        Sort by
      </InputLabel>
      <Select
        value={sortBy}
        label='Sort by'
        onChange={(e: SelectChangeEvent) =>
          onSortChange?.(e.target.value as 'newest' | 'ranking')
        }
        sx={{
          color: '#EDEDED',
          bgcolor: '#1a1a1a',
          borderRadius: 2,
          '.MuiOutlinedInput-notchedOutline': { borderColor: '#3B3B3B' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#f0c040' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f0c040' },
          '.MuiSvgIcon-root': { color: '#cfcfcf' },
        }}
        MenuProps={{
          PaperProps: {
            sx: { bgcolor: '#1a1a1a', color: '#EDEDED' },
          },
        }}
      >
        <MenuItem value='newest'>Newest</MenuItem>
        <MenuItem value='ranking'>Ranking</MenuItem>
      </Select>
    </FormControl>
  );

  return (
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
        toolbar={sortToolbar}     // ← passes the dropdown into the table header
      />
    </Box>
  );
};

export default TeamsSection;


// import { Box, IconButton } from '@mui/material';
// import type { TableColumn } from '../../../../components/tables/PaginatedTable.tsx';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import PaginatedTable from '../../../../components/tables/PaginatedTable.tsx';
//
// export type TeamTableRow = {
//     team_id: number;
//   team_name: string;
//   license_number: string | 'NIL';
//   sponsors_accrued: number;
//   ranking: string | number;
// };
//
// export type TeamsSectionProps = {
//   title?: string;
//   rows: TeamTableRow[];
//   // server/client plumbing
//   mode?: 'client' | 'server';
//   loading?: boolean;
//   totalCount?: number;
//   pageIndex?: number;
//   rowsPerPage?: number;
//   onPageChange?: (page: number) => void;
//   onRowsPerPageChange?: (size: number) => void;
//   searchValue?: string;
//   onSearchChange?: (q: string) => void;
//
//   // action
//   onView?: (row: TeamTableRow) => void;
// };
//
// const TeamsSection = ({
//   title = 'TEAMS TABLE',
//   rows,
//   mode = 'server',
//   loading,
//   totalCount,
//   pageIndex,
//   rowsPerPage,
//   onPageChange,
//   onRowsPerPageChange,
//   searchValue,
//   onSearchChange,
//   onView,
// }: TeamsSectionProps) => {
//   // base columns for this table shape
//   const baseColumns: TableColumn<TeamTableRow>[] = [
//     { field: 'team_name', header: 'Team name' },
//     { field: 'license_number', header: 'License number' },
//     { field: 'sponsors_accrued', header: 'Sponsors accrued', align: 'right' },
//     { field: 'email', header: 'Email' },
//     { field: 'phone_number', header: 'Phone number' },
//     { field: 'address', header: 'Address' },
//     { field: 'has_subscription', header: 'Has Subscription' },
//     { field: 'subscription_type', header: 'Subscription type' },
//     { field: 'ranking', header: 'Ranking', align: 'right' },
//   ];
//
//   // append “View” action when an onView handler is provided
//   const columns: TableColumn<TeamTableRow>[] = onView
//     ? [
//         ...baseColumns,
//         {
//           field: 'view',
//           header: 'View',
//           align: 'center',
//           width: 80,
//           render: (_val, row) => (
//             <IconButton
//               aria-label='view'
//               onClick={() => {
//                 onView(row);
//
//                 console.log(row.team_id);
//               }}
//             >
//               <VisibilityIcon sx={{ color: '#f0c040' }} />
//             </IconButton>
//           ),
//         },
//       ]
//     : baseColumns;
//   return (
//     <>
//       <Box sx={{ mt: 4 }}>
//         <PaginatedTable<TeamTableRow>
//           title={title}
//           rows={rows}
//           columns={columns}
//           mode={mode}
//           loading={loading}
//           totalCount={totalCount}
//           pageIndex={pageIndex}
//           rowsPerPage={rowsPerPage}
//           onPageChange={onPageChange}
//           onRowsPerPageChange={onRowsPerPageChange}
//           searchValue={searchValue}
//           onSearchChange={onSearchChange}
//           searchFields={['team_name', 'license_number']}
//           searchPlaceholder='Search'
//           maxBodyHeight={420}
//           getRowKey={(r) => String(r.team_id)}
//         />
//       </Box>
//     </>
//   );
// };
//
// export default TeamsSection;
