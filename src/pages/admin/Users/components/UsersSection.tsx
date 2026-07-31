import { 
  Box, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack
} from '@mui/material';
import { useState } from 'react';
import type { TableColumn } from '../../../../components/tables/PaginatedTable.tsx';
import PaginatedTable from '../../../../components/tables/PaginatedTable.tsx';
import type { UserTableRow } from '../api/users.types.ts';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

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
  onDelete?: (userId: number) => void; // ✅ New optional delete handler
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
  onDelete, // ✅ Extracted prop
}: Props) {
  
  // ✅ Modal State
  const [userToDelete, setUserToDelete] = useState<UserTableRow | null>(null);

  // If onView or onDelete is provided, append a trailing actions column
  const computedColumns: TableColumn<UserTableRow>[] = (onView || onDelete)
    ? [
        ...columns,
        {
          field: '__actions__',
          header: 'Actions',
          align: 'center',
          width: 100,
          render: (_val, row) => (
            <Stack direction="row" spacing={0.5} justifyContent="center">
              {onView && (
                <IconButton
                  aria-label='view'
                  onClick={() => onView(row)}
                  size='small'
                >
                  <VisibilityIcon sx={{ color: '#f0c040', fontSize: '1.2rem' }} />
                </IconButton>
              )}
              {onDelete && (
                <IconButton
                  aria-label='delete'
                  onClick={() => setUserToDelete(row)}
                  size='small'
                >
                  <DeleteOutlineIcon sx={{ color: '#ff4444', fontSize: '1.2rem' }} />
                </IconButton>
              )}
            </Stack>
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

      {/* ✅ Beautiful Custom Confirmation Modal */}
      <Dialog 
        open={!!userToDelete} 
        onClose={() => setUserToDelete(null)}
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
            Are you sure you want to permanently delete this user? This action cannot be undone and will remove all associated data.
          </Typography>
          
          {userToDelete && (
            <Box sx={{ bgcolor: '#141414', border: '1px solid #222', borderRadius: 2, p: 2 }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography sx={{ color: '#f0c040', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>User Name</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 600 }}>{userToDelete.user_name}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: '#f0c040', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Email</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 600 }}>{userToDelete.email}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: '#f0c040', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Phone</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 600 }}>{userToDelete.phone_number}</Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button 
            onClick={() => setUserToDelete(null)} 
            sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (userToDelete && onDelete) {
                onDelete(userToDelete.sponsor_id);
                setUserToDelete(null);
              }
            }}
            sx={{ 
              bgcolor: '#ff4444', 
              color: '#fff', 
              fontWeight: 800,
              '&:hover': { bgcolor: '#cc0000' }
            }}
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}