// pages/admin/Subscription/components/DesktopSubscriptionConfirmationSection.tsx
import { Box, Typography } from '@mui/material';
import StatusChipDropdown, {
    type PaymentStatus,
    type SubscriptionStatus,
} from '../../../../components/chips/StatusChipDropdown';
import type { SubApiRow } from '../api/subscriptions.types';

type Props = {
     entry?: SubApiRow | null;
   draftPayment: PaymentStatus;
   draftSub: SubscriptionStatus;
   onChangePayment: (next: PaymentStatus) => void;
   onChangeSub: (next: SubscriptionStatus) => void;
   onConfirm: () => void; 

 };



export default function DesktopSubscriptionConfirmationSection({
  entry,
  draftPayment,
  draftSub,
  onChangePayment,
  onChangeSub,
}: Props) {
  const teamName = entry?.team?.team_name ?? 'this team';


  

  return (
    <Box sx={{ mt: 6 }}>
      <Typography component='h2' variant='h2' sx={{ fontWeight: 900, mb: 2 }}>
        CONFIRMATION
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4,
          alignItems: 'center',
          maxWidth: 720,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 1 }}>
            Payment confirmation status:
          </Typography>
          <StatusChipDropdown
            domain='payment'
            value={draftPayment}
            onChange={onChangePayment}
            aria-label={`Set payment status for ${teamName}`}
          />
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 1 }}>
            Subscription status:
          </Typography>
          <StatusChipDropdown
            domain='subscription'
            value={draftSub}
            onChange={onChangeSub}
            aria-label={`Set subscription status for ${teamName}`}
          />
        </Box>
      </Box>

  
    </Box>
  );
}
