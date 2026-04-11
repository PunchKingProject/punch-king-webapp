import { Box, Typography } from '@mui/material';
import StatusChipDropdown, {
  type PaymentStatus as ChipPaymentStatus,
  type LicenseStatus as ChipProcessStatus, // reuse dropdown's "license" domain for sponsor processing
} from '../../../../components/chips/StatusChipDropdown';
import type { PaymentStatus, PurchaseStatus, SponsorshipApiRow } from '../api/sponsorships.types';

type Props = {
  entry?: SponsorshipApiRow | null;

  // current drafts held by parent
  draftPayment: PaymentStatus;
  draftPurchase: PurchaseStatus;

  // push changes up (parent will decide when to confirm and call API)
  onChangePayment: (next: PaymentStatus) => void;
  onChangePurchase: (next: PurchaseStatus) => void;

  // optional confirm button trigger (if you present one outside)
  onConfirm?: () => void;
};

export default function DesktopSponsorshipConfirmationSection({
  entry,
  draftPayment,
  draftPurchase,
  onChangePayment,
  onChangePurchase,
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
        {/* Payment confirmation */}
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 1 }}>
            Payment confirmation status:
          </Typography>
          <StatusChipDropdown
            domain='payment'
            value={draftPayment as ChipPaymentStatus}
            onChange={(next) => onChangePayment(next as PaymentStatus)}
          />
        </Box>

        {/* Sponsorship processing status */}
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 1 }}>
            Sponsorship status:
          </Typography>
          {/* We reuse the dropdown's "license" domain for the same set: pending | processing | processed | failed */}
          <StatusChipDropdown
            domain='license'
            value={draftPurchase as ChipProcessStatus}
            onChange={(next) => onChangePurchase(next as PurchaseStatus)}
          />
        </Box>
      </Box>
      <Typography sx={{ mt: 2, color: '#A2A2A2', fontSize: 13 }}>
        Update statuses for <b style={{ color: '#fff' }}>{teamName}</b>. You
        will be asked to confirm before changes are applied.
      </Typography>
    </Box>
  );
}
