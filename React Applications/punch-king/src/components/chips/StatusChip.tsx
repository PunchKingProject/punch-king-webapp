import { Chip, type SxProps } from '@mui/material';

export type CanonicalStatus =
  | 'Pending'
  | 'Processing'
  | 'Processed'
  | 'Confirmed'
  | 'Failed'
  | 'Active'
  | 'Inactive'
  | 'Expired'
  | 'Not subscribed'
  | 'Subscribed';

export type StatusType = CanonicalStatus | Lowercase<CanonicalStatus>;

interface StatusChipProps {
  label?: string | null;
  sx?: SxProps; // extra custom styles if needed
}

const GOLD = '#EFAF00';

const statusColors: Record<CanonicalStatus, { bg: string; color: string }> = {
  Pending: { bg: 'transparent', color: '#FFC107' },
  Processing: { bg: 'transparent', color: '#FFC107' },
  Confirmed: { bg: 'transparent', color: '#4CAF50' },
  Processed: { bg: 'transparent', color: '#4CAF50' },
  Active: { bg: 'transparent', color: GOLD },
  Inactive: { bg: 'transparent', color: '#A2A2A2' },
  Expired: { bg: 'transparent', color: '#F44336' },

  Failed: { bg: 'transparent', color: '#F44336' },
  'Not subscribed': { bg: 'transparent', color: '#FFC107' },
  Subscribed: { bg: 'transparent', color: '#4CAF50' },
};

// Normalize API strings → our canonical keys
function normalizeStatus(input?: string | null): CanonicalStatus {
  const s = (input ?? '').trim().toLowerCase();
  switch (s) {
    case 'pending':
      return 'Pending';
    case 'processing':
      return 'Processing';
    case 'processed':
      return 'Processed';
    case 'confirmed':
      return 'Confirmed';
    case 'success':
    case 'successful':
    case 'completed':
      return 'Confirmed';

    case 'failed':
      return 'Failed';
    case 'declined':
    case 'rejected':
    case 'error':
      return 'Failed';
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'expired':
      return 'Expired';
    case 'not subscribed':
    case 'not_subscribed':
      return 'Not subscribed';
    case 'subscribed':
      return 'Subscribed';
    default:
      return 'Pending';
  }
}

const StatusChip = ({ label, sx }: StatusChipProps) => {
  const key = normalizeStatus(label);

  const { bg, color } = statusColors[key];

  // Prefer canonical label formatting for consistency in UI
  const display = key;

  return (
    <Chip
      label={display}
      sx={{
        border: `1px solid ${color}`,
        color,
        backgroundColor: bg,
        fontWeight: 600,
        borderRadius: '12px',
        height: '28px',
        ...sx,
      }}
    />
  );
};
export default StatusChip;
