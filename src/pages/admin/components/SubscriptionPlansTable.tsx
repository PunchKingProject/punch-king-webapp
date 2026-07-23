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
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

const tableBg = '#1A1A1A';
const textColor = '#EDEDED';
const gold = '#EFAF00';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit: (plan: any) => void;
};

// Temporary mock data so you can see the UI layout immediately.
// You will replace this with your React Query hook later!
const mockPlans = [
  { id: 1, name: 'Basic Team Plan', price: 5000, duration: 'monthly', status: 'active' },
  { id: 2, name: 'Pro Team Plan', price: 13500, duration: 'quarterly', status: 'active' },
  { id: 3, name: 'Elite Annual Plan', price: 50000, duration: 'yearly', status: 'inactive' },
];

export default function SubscriptionPlansTable({ onEdit }: Props) {
  // FUTURE HOOK IMPLEMENTATION:
  // const { data: plans, isLoading } = useGetSubscriptionPlans();
  const plans = mockPlans; 

  const handleDelete = (id: number) => {
    // Future delete mutation hook
    console.log('Trigger delete for plan ID:', id);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper} sx={{ bgcolor: tableBg, borderRadius: 2, border: '1px solid #333' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ borderBottom: '2px solid #333' }}>
              <TableCell sx={{ color: gold, fontWeight: 700 }}>Plan Name</TableCell>
              <TableCell sx={{ color: gold, fontWeight: 700 }}>Price</TableCell>
              <TableCell sx={{ color: gold, fontWeight: 700 }}>Duration</TableCell>
              <TableCell sx={{ color: gold, fontWeight: 700 }}>Status</TableCell>
              <TableCell align="right" sx={{ color: gold, fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {plans.map((plan) => (
              <TableRow
                key={plan.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={{ color: textColor, fontWeight: 600 }}>
                  {plan.name}
                </TableCell>
                
                <TableCell sx={{ color: textColor }}>
                  ₦ {plan.price.toLocaleString()}
                </TableCell>
                
                <TableCell sx={{ color: textColor, textTransform: 'capitalize' }}>
                  {plan.duration}
                </TableCell>
                
                <TableCell>
                  <Chip
                    label={plan.status}
                    size="small"
                    sx={{
                      bgcolor: plan.status === 'active' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                      color: plan.status === 'active' ? '#4caf50' : '#f44336',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      borderRadius: 1,
                    }}
                  />
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Edit Plan">
                    <IconButton
                      sx={{ color: '#4dabf5', mr: 1 }}
                      onClick={() => onEdit(plan)}
                    >
                      <EditRoundedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete Plan">
                    <IconButton
                      sx={{ color: '#f44336' }}
                      onClick={() => handleDelete(plan.id)}
                    >
                      <DeleteRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}