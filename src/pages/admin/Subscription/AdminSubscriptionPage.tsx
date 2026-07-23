import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminSection from '../components/AdminSection.tsx'; 
import SubscriptionPlanModal from './components/SubscriptionPlanModal.tsx';
import SubscriptionPlansTable from './components/SubscriptionPlansTable.tsx';
import { colors } from '../../../theme/colors.ts';

export default function AdminSubscriptionPage() {
  const [modalOpen, setModalOpen] = useState(false);
  
  // We store the plan being edited here. If null, the modal is in "Create" mode.
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

  const handleOpenCreate = () => {
    setSelectedPlan(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (plan: any) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setModalOpen(false);
  };
  
  return (
    <AdminSection title="SUBSCRIPTION MANAGEMENT">
      <Box sx={{ px: 4, py: 3 }}>
        {/* Header Action Area */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
          <Typography variant="h5" sx={{ color: colors.Freeze, fontWeight: 700 }}>
            Active Subscription Plans
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{
              bgcolor: '#EFAF00',
              color: '#000',
              fontWeight: 700,
              '&:hover': { bgcolor: '#d49b00' },
            }}
          >
            Create New Plan
          </Button>
        </Box>

        {/* The Data Table */}
        <SubscriptionPlansTable onEdit={handleOpenEdit} />

        {/* The Smart Modal we built earlier */}
        <SubscriptionPlanModal
          open={modalOpen}
          onClose={handleCloseModal}
          planToEdit={selectedPlan}
        />
      </Box>
    </AdminSection>
  );
}
// 🛑 END OF FILE. Nothing else goes below this!