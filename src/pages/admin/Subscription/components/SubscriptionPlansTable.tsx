import { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useGetAdminSubscriptionPlans, useDeleteSubscriptionPlan } from '../hooks/useAdminSubscriptionPlans.ts'; 

const tableBg = '#1A1A1A';
const textColor = '#EDEDED';
const gold = '#EFAF00';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit: (plan: any) => void;
};

export default function SubscriptionPlansTable({ onEdit }: Props) {
  const { data, isLoading, isError } = useGetAdminSubscriptionPlans();
  const deleteMutation = useDeleteSubscriptionPlan();

  // ⬇️ NEW: Professional Notification State ⬇️
  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleCloseNotify = () => setNotify({ ...notify, open: false });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          setNotify({ open: true, message: 'Subscription plan deleted successfully.', severity: 'success' });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          setNotify({ open: true, message: `Failed to delete plan: ${error?.response?.data?.message || error.message}`, severity: 'error' });
        }
      });
    }
  };

  if (isLoading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress sx={{ color: gold }} /></Box>;
  if (isError) return <Typography sx={{ color: '#f44336', p: 2 }}>Failed to load plans. Is the backend running?</Typography>;

  const plans = Array.isArray(data) ? data : (data?.data || data?.plans || []);

  return (
    <Box sx={{ width: '100%' }}>
      {(!plans || plans.length === 0) ? (
        <Typography sx={{ color: textColor, p: 2 }}>No subscription plans found. Create one!</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: tableBg, borderRadius: 2, border: '1px solid #333' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ borderBottom: '2px solid #333' }}>
                <TableCell sx={{ color: gold, fontWeight: 700 }}>Plan Name</TableCell>
                <TableCell sx={{ color: gold, fontWeight: 700 }}>Price</TableCell>
                <TableCell sx={{ color: gold, fontWeight: 700 }}>Duration</TableCell>
                <TableCell sx={{ color: gold, fontWeight: 700 }}>FLW Plan ID</TableCell>
                <TableCell sx={{ color: gold, fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ color: gold, fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {plans.map((plan: any) => (
                <TableRow key={plan.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ color: textColor, fontWeight: 600, textTransform: 'capitalize' }}>
                    {plan.type} Plan
                  </TableCell>
                  
                  <TableCell sx={{ color: textColor }}>
                    {plan.currency || 'USD'} {Number(plan.price).toLocaleString()}
                  </TableCell>
                  
                  <TableCell sx={{ color: textColor, textTransform: 'capitalize' }}>
                    {plan.type}
                  </TableCell>

                  <TableCell sx={{ color: '#A2A2A2', fontFamily: 'monospace' }}>
                    {plan.flw_plan_id || 'Not Set'}
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={'Active'} 
                      size="small"
                      sx={{
                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                        color: '#4caf50',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        borderRadius: 1,
                      }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Edit Plan">
                      <IconButton sx={{ color: '#4dabf5', mr: 1 }} onClick={() => onEdit(plan)}>
                        <EditRoundedIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Plan">
                      <IconButton sx={{ color: '#f44336' }} onClick={() => handleDelete(plan.id)} disabled={deleteMutation.isPending}>
                        <DeleteRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ⬇️ NEW: Professional MUI Snackbar ⬇️ */}
      <Snackbar 
        open={notify.open} 
        autoHideDuration={4000} 
        onClose={handleCloseNotify}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotify} severity={notify.severity} variant="filled" sx={{ width: '100%', fontWeight: 600 }}>
          {notify.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}