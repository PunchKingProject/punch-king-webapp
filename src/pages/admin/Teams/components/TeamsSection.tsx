import { 
  Box, 
  IconButton, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { TableColumn } from '../../../../components/tables/PaginatedTable.tsx';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PaginatedTable from '../../../../components/tables/PaginatedTable.tsx';
import { useState } from 'react';

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
  onDelete?: (teamId: number) => void; // ✅ New prop for deletion

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
  onDelete, // ✅ Extracted prop
  sortBy = 'newest',
  onSortChange,
}: TeamsSectionProps) => {

  // Modal State
  const [teamToDelete, setTeamToDelete] = useState<TeamTableRow | null>(null);

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

  // ✅ Transformed "View" column into an "Actions" column
  const columns: TableColumn<TeamTableRow>[] = (onView || onDelete)
    ? [
      ...baseColumns,
      {
        field: 'actions',
        header: 'Actions',
        align: 'center',
        width: 100,
        render: (_val, row) => (
          <Stack direction="row" spacing={0.5} justifyContent="center">
            {onView && (
              <IconButton aria-label='view' onClick={() => onView(row)}>
                <VisibilityIcon sx={{ color: '#f0c040', fontSize: '1.2rem' }} />
              </IconButton>
            )}
            {onDelete && (
              <IconButton aria-label='delete' onClick={() => setTeamToDelete(row)}>
                <DeleteOutlineIcon sx={{ color: '#ff4444', fontSize: '1.2rem' }} />
              </IconButton>
            )}
          </Stack>
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
        toolbar={sortToolbar}
      />

      {/* ✅ Beautiful Custom Confirmation Modal */}
      <Dialog 
        open={!!teamToDelete} 
        onClose={() => setTeamToDelete(null)}
        PaperProps={{
          sx: { 
            bgcolor: '#0a0a0a', 
            border: '1px solid rgba(255, 68, 68, 0.4)', 
            borderRadius: 3,
            minWidth: { xs: '90%', sm: 450 } 
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
          <WarningAmberIcon sx={{ color: '#ff4444', fontSize: 28 }} />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', mb: 3 }}>
            Are you sure you want to permanently delete this team? This action cannot be undone and will remove all associated data.
          </Typography>
          
          {teamToDelete && (
            <Box sx={{ bgcolor: '#141414', border: '1px solid #222', borderRadius: 2, p: 2 }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography sx={{ color: '#f0c040', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Team Name</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 600 }}>{teamToDelete.team_name}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: '#f0c040', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Email</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 600 }}>{teamToDelete.email}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: '#f0c040', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>License</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 600 }}>{teamToDelete.license_number}</Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button 
            onClick={() => setTeamToDelete(null)} 
            sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (teamToDelete && onDelete) {
                onDelete(teamToDelete.team_id);
                setTeamToDelete(null);
              }
            }}
            sx={{ 
              bgcolor: '#ff4444', 
              color: '#fff', 
              fontWeight: 800,
              '&:hover': { bgcolor: '#cc0000' }
            }}
          >
            Delete Team
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamsSection;