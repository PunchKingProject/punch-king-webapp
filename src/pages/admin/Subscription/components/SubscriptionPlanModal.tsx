import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { useCreateSubscriptionPlan, useUpdateSubscriptionPlan } from '../hooks/useAdminSubscriptionPlans.ts';

type Props = {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  planToEdit?: any | null; 
};

export default function SubscriptionPlanModal({ open, onClose, planToEdit }: Props) {
  const createMutation = useCreateSubscriptionPlan();
  const updateMutation = useUpdateSubscriptionPlan();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: 'monthly',
    description: '',
    flw_plan_id: '',
  });

  // ⬇️ NEW: Professional Notification State ⬇️
  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleCloseNotify = () => setNotify({ ...notify, open: false });

  useEffect(() => {
    if (planToEdit) {
      setFormData({
        name: planToEdit.type ? `${planToEdit.type} Plan` : '',
        price: planToEdit.price || '',
        duration: planToEdit.type ? planToEdit.type.toLowerCase() : 'monthly',
        description: planToEdit.description || '',
        flw_plan_id: planToEdit.flw_plan_id || '',
      });
    } else {
      setFormData({
        name: '',
        price: '',
        duration: 'monthly',
        description: '',
        flw_plan_id: '',
      });
    }
  }, [planToEdit, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const formattedPayload = {
      type: formData.duration.toLowerCase(),
      price: Number(formData.price),
      currency: "USD",
      flw_plan_id: formData.flw_plan_id, 
    };

    if (planToEdit) {
      updateMutation.mutate(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { id: planToEdit.id, ...formattedPayload } as any,
        { 
          onSuccess: () => {
            setNotify({ open: true, message: 'Subscription plan updated successfully.', severity: 'success' });
            setTimeout(() => onClose(), 1000); // Slight delay so admin sees the toast before modal closes
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            setNotify({ open: true, message: `Update failed: ${error?.response?.data?.message || error.message}`, severity: 'error' });
          }
        }
      );
    } else {
      createMutation.mutate(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formattedPayload as any, 
        { 
          onSuccess: () => {
            setNotify({ open: true, message: 'New subscription plan saved successfully.', severity: 'success' });
            setTimeout(() => onClose(), 1000); // Slight delay so admin sees the toast before modal closes
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            setNotify({ open: true, message: `Creation failed: ${error?.response?.data?.message || error.message}`, severity: 'error' });
          }
        }
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#333' },
      '&:hover fieldset': { borderColor: '#EFAF00' },
      '&.Mui-focused fieldset': { borderColor: '#EFAF00' },
    },
    '& .MuiSvgIcon-root': { color: '#A2A2A2' }, 
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { bgcolor: '#1A1A1A', color: '#EDEDED', borderRadius: 2, border: '1px solid #333' },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#EFAF00', borderBottom: '1px solid #333' }}>
          {planToEdit ? 'Edit Subscription Plan' : 'Create New Plan'}
        </DialogTitle>

        <DialogContent sx={{ mt: 2, p: 4 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="Plan Name" name="name" value={formData.name} onChange={handleChange} fullWidth
              InputLabelProps={{ style: { color: '#A2A2A2' } }} InputProps={{ style: { color: '#FFF' } }} sx={inputStyles}
              helperText="For display purposes. Backend relies on Duration selection." FormHelperTextProps={{ style: { color: '#666' } }}
            />
            <TextField
              label="Flutterwave Plan ID" name="flw_plan_id" value={formData.flw_plan_id} onChange={handleChange} fullWidth
              placeholder="e.g., 23490, 87621" InputLabelProps={{ style: { color: '#A2A2A2' } }} InputProps={{ style: { color: '#FFF' } }} sx={inputStyles}
              helperText="The recurring plan ID generated from your Flutterwave dashboard." FormHelperTextProps={{ style: { color: '#666' } }}
            />
            <TextField
              label="Price ($)" name="price" type="number" value={formData.price} onChange={handleChange} fullWidth
              InputLabelProps={{ style: { color: '#A2A2A2' } }} InputProps={{ style: { color: '#FFF' } }} sx={inputStyles}
            />
            <TextField
              select label="Duration" name="duration" value={formData.duration} onChange={handleChange} fullWidth
              InputLabelProps={{ style: { color: '#A2A2A2' } }} InputProps={{ style: { color: '#FFF' } }} sx={inputStyles}
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="semi-annual">Semi-Annual</MenuItem>
              <MenuItem value="annual">Annual</MenuItem>
            </TextField>
            <TextField
              label="Description & Features" name="description" multiline rows={4} value={formData.description} onChange={handleChange} fullWidth
              placeholder="E.g. Access to premium content, advanced analytics..."
              InputLabelProps={{ style: { color: '#A2A2A2' } }} InputProps={{ style: { color: '#FFF' } }} sx={inputStyles}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid #333' }}>
          <Button onClick={onClose} disabled={isPending} sx={{ color: '#A2A2A2', '&:hover': { color: '#FFF' } }}>
            Cancel
          </Button>
          <Button
            variant="contained" onClick={handleSubmit} disabled={isPending}
            sx={{ bgcolor: '#EFAF00', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#d49b00' } }}
          >
            {isPending ? 'Saving...' : planToEdit ? 'Save Changes' : 'Create Plan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ⬇️ NEW: Professional MUI Snackbar for Modal ⬇️ */}
      <Snackbar 
        open={notify.open} 
        autoHideDuration={4000} 
        onClose={handleCloseNotify}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 9999 }} // Ensures it renders above the modal overlay
      >
        <Alert onClose={handleCloseNotify} severity={notify.severity} variant="filled" sx={{ width: '100%', fontWeight: 600 }}>
          {notify.message}
        </Alert>
      </Snackbar>
    </>
  );
}