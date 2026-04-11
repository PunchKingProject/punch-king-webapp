import { Box, Typography } from '@mui/material';

import StatusChipDropdown, {
  type LicenseStatus,
  type PaymentStatus,
} from '../../../../components/chips/StatusChipDropdown';
import type { LicenseApiRow } from '../api/licensing.types';
import { useDisclosure } from '../../../../hooks/useDisclosure';
import { useEffect, useState } from 'react';
import { useUpdateLicenseStatus } from '../hooks/useUpdateLicenseStatus';
import WarningIcon from '../../../../assets/modalQuestionIcon.svg?react';
import SuccessIcon from '../../../../assets/modalSuccess.svg?react';
import NoticeModal from '../../../../components/modal/NoticeModal';

type Props = {
  entry?: LicenseApiRow | null;
};

function normalizePayment(s?: string | null): PaymentStatus {


  switch ((s ?? '').toLowerCase()) {
    case 'confirmed':
      return 'confirmed';
    case 'failed':
      return 'failed';
    case 'pending':
    default:
      return 'pending';
  }
}

function normalizeLicense(s?: string | null): LicenseStatus {
  switch ((s ?? '').toLowerCase()) {
    case 'processing':
      return 'processing';
    case 'processed':
      return 'processed';
    case 'failed':
      return 'failed';
    case 'pending':
    default:
      return 'pending';
  }
}

export default function DesktopLicenseConfirmationSection({ entry }: Props) {
  const confirm = useDisclosure(false);
  const success = useDisclosure(false);

  // keep local drafts for the chips
  const [draftPayment, setDraftPayment] = useState<PaymentStatus>('pending');
  const [draftLicense, setDraftLicense] = useState<LicenseStatus>('pending');

  // when entry changes, sync local state
  useEffect(() => {
    setDraftPayment(normalizePayment(entry?.payment_status));
    setDraftLicense(normalizeLicense(entry?.license_status));
  }, [entry]);

  const { mutateAsync: updateStatus, isPending } = useUpdateLicenseStatus();

  // called after user confirms in NoticeModal
  const handleConfirmUpdate = async () => {
    if (!entry) return;
    try {
      await updateStatus({
        license_id: entry.id,
        payment_status: draftPayment,
        license_status: draftLicense,
      });
      confirm.onClose();
      success.onOpen();
    } catch {
      // error toast is handled in the page or mutation onError if you add it
    }
  };

  const teamName = entry?.team?.team_name ?? 'this team';

  return (
    <Box sx={{ mt: 6 }}>
      <Typography component='h2' variant='h2' sx={{ fontWeight: 900, mb: 2 }}>Confirmation</Typography>
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
          <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 1 }}>Payment Confirmation Status</Typography>
          {/* <StatusChip label={(entry?.payment_status ?? 'pending') as any} /> */}
          <StatusChipDropdown
            domain='payment'
            value={draftPayment}
            onChange={(next) => {
              setDraftPayment(next);
              confirm.onOpen();
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 1 }}>Subscription Status</Typography>
          {/* <StatusChip label={(entry?.license_status ?? 'pending') as any} /> */}
          <StatusChipDropdown
            domain='license'
            value={draftLicense}
            onChange={(next) => {
              setDraftLicense(next);
              confirm.onOpen();
            }}
          />
        </Box>
      </Box>
      {/* Confirm modal */}
      <NoticeModal
        open={confirm.open}
        onClose={confirm.onClose}
        onContinue={handleConfirmUpdate}
        onSecondary={confirm.onClose}
        title='NOTICE!!!'
        message={`Are you sure you want to update ${teamName} license payment status?`}
        continueLabel={isPending ? 'Please wait…' : 'Update'}
        secondaryLabel='Cancel'
        icon={<WarningIcon />}
      />
      {/* Success modal */}
      <NoticeModal
        open={success.open}
        onClose={success.onClose}
        onContinue={success.onClose}
        title='NOTICE!!!'
        message={`You have successfully updated ${teamName} license payment status.`}
        continueLabel='Finish'
        icon={<SuccessIcon />}
      />
    </Box>
  );
}
