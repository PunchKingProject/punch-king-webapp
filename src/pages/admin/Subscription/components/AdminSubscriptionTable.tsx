import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '../hooks/useSubscriptions.ts';
import ROUTES from '../../../../routes/routePath.ts';

const tableBg = '#1A1A1A';
const textColor = '#EDEDED';
const gold = '#EFAF00';

type Props = {
  page: number;
  pageSize: number;
  startDate: string;
  endDate: string;
  search: string;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
};

export default function AdminSubscriptionTable({
  page,
  pageSize,
  startDate,
  endDate,
  search,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const navigate = useNavigate();

  // Consume your perfectly structured React Query hook
  const { data, isLoading, isError } = useSubscriptions({
    page,
    page_size: pageSize,
    start_date: startDate,
    end_date: endDate,
    search,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress sx={{ color: gold }} />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Typography sx={{ color: '#f44336', mt: 2, textAlign: 'center' }}>
        Failed to load subscriptions. Please try again.
      </Typography>
    );
  }

  const { data: subs, metadata } = data;

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper} sx={{ bgcolor: tableBg, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ borderBottom: '2px solid #333' }}>
              <TableCell sx={{ color: gold, fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ color: gold, fontWeight: 700 }}>Team Name</TableCell>
              <TableCell sx={{ color: gold, fontWeight: 700 }}>Plan Type</TableCell>
              <TableCell sx={{ color: gold, fontWeight: 700 }}>Amount</TableCell>
              <TableCell sx={{ color: gold, fontWeight: 700 }}>Status</TableCell>
              <TableCell align="right" sx={{ color: gold, fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {subs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: '#A2A2A2', py: 4 }}>
                  No subscriptions found for this period.
                </TableCell>
              </TableRow>
            ) : (
              subs.map((sub) => {
                // Determine styling based on Go's model.SubscriptionStatus
                const isProcessed = sub.subscription_status === 'processed';

                return (
                  <TableRow
                    key={sub.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell sx={{ color: textColor }}>
                      {dayjs(sub.payment_date).format('DD MMM YYYY')}
                    </TableCell>
                    <TableCell sx={{ color: textColor, fontWeight: 600 }}>
                      {sub.team?.team_name || 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: textColor, textTransform: 'capitalize' }}>
                      {sub.type}
                    </TableCell>
                    <TableCell sx={{ color: textColor }}>
                      ₦ {sub.payment_amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={isProcessed ? 'Active' : 'Pending'}
                        size="small"
                        sx={{
                          bgcolor: isProcessed ? 'rgba(76, 175, 80, 0.1)' : 'rgba(239, 175, 0, 0.1)',
                          color: isProcessed ? '#4caf50' : gold,
                          fontWeight: 700,
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      {/* Action: Approve / Process Pending Subscriptions */}
                      {!isProcessed && (
                        <Tooltip title="Approve Subscription">
                          <IconButton
                            sx={{ color: '#4caf50', mr: 1 }}
                            onClick={() => {
                              // Hook this up to your updateSubStatus mutation
                              console.log('Trigger approval for:', sub.id);
                            }}
                          >
                            <CheckCircleOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Action: View Team Details */}
                      <Tooltip title="View Details">
                        <IconButton
                          sx={{ color: '#4dabf5' }}
                          onClick={() => {
                            // Route to the drill-down page holding the Team Details component
                            navigate(`${ROUTES.SUBSCRIPTION}/${sub.team?.id}`);
                          }}
                        >
                          <VisibilityRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Server-Side Pagination */}
        <TablePagination
          component="div"
          count={metadata.total_count || 0}
          page={page - 1} // MUI uses 0-indexed pages, your backend uses 1-indexed
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{
            color: textColor,
            borderTop: '1px solid #333',
            '.MuiTablePagination-selectIcon': { color: textColor },
          }}
        />
      </TableContainer>
    </Box>
  );
}