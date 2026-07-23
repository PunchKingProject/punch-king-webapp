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
} from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  planToEdit?: any | null; 
};

export default function SubscriptionPlanModal({ open, onClose, planToEdit }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: 'monthly',
    description: '',
  });

  // Populate the form if we are editing, or reset it if we are creating a new one
  useEffect(() => {
    if (planToEdit) {
      setFormData({
        name: planToEdit.name || '',
        price: planToEdit.price || '',
        duration: planToEdit.duration || 'monthly',
        description: planToEdit.description || '',
      });
    } else {
      setFormData({
        name: '',
        price: '',
        duration: 'monthly',
        description: '',
      });
    }
  }, [planToEdit, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Here is where you will eventually hook up your React Query mutation
    console.log('Submitting Plan Data:', formData);
    onClose();
  };

  // Reusable styling for the dark mode inputs
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#333' },
      '&:hover fieldset': { borderColor: '#EFAF00' },
      '&.Mui-focused fieldset': { borderColor: '#EFAF00' },
    },
    '& .MuiSvgIcon-root': { color: '#A2A2A2' }, // For the select dropdown icon
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1A1A1A',
          color: '#EDEDED',
          borderRadius: 2,
          border: '1px solid #333',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: '#EFAF00', borderBottom: '1px solid #333' }}>
        {planToEdit ? 'Edit Subscription Plan' : 'Create New Plan'}
      </DialogTitle>

      <DialogContent sx={{ mt: 2, p: 4 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          
          <TextField
            label="Plan Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: '#A2A2A2' } }}
            InputProps={{ style: { color: '#FFF' } }}
            sx={inputStyles}
          />

          <TextField
            label="Price (₦)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: '#A2A2A2' } }}
            InputProps={{ style: { color: '#FFF' } }}
            sx={inputStyles}
          />

          <TextField
            select
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: '#A2A2A2' } }}
            InputProps={{ style: { color: '#FFF' } }}
            sx={inputStyles}
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="quarterly">Quarterly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </TextField>

          <TextField
            label="Description & Features"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            fullWidth
            placeholder="E.g. Access to premium content, advanced analytics..."
            InputLabelProps={{ style: { color: '#A2A2A2' } }}
            InputProps={{ style: { color: '#FFF' } }}
            sx={inputStyles}
          />

        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #333' }}>
        <Button onClick={onClose} sx={{ color: '#A2A2A2', '&:hover': { color: '#FFF' } }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: '#EFAF00',
            color: '#000',
            fontWeight: 700,
            '&:hover': { bgcolor: '#d49b00' },
          }}
        >
          {planToEdit ? 'Save Changes' : 'Create Plan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}