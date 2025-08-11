import { Chip, type SxProps } from '@mui/material';

export type StatusType =
  | 'Pending'
  | 'Confirmed'
  | 'Failed'
  | 'Not subscribed'
  | 'Subscribed'
  | 'Processing'
  | 'Processed';

interface StatusChipProps {
  label: StatusType;
  sx?: SxProps; // extra custom styles if needed
}

const statusColors: Record<StatusType, { bg: string; color: string }> = {
  Pending: { bg: 'transparent', color: '#FFC107' }, // amber
  Processing: { bg: 'transparent', color: '#FFC107' }, // amber
  Confirmed: { bg: 'transparent', color: '#4CAF50' }, // green
  Processed: { bg: 'transparent', color: '#4CAF50' }, // green          
  Failed: { bg: 'transparent', color: '#F44336' }, // red
  'Not subscribed': { bg: 'transparent', color: '#FFC107' },
  Subscribed: { bg: 'transparent', color: '#4CAF50' },
};

const StatusChip = ({ label, sx }: StatusChipProps) => {
  const { bg, color } = statusColors[label];

  return (
    <Chip
      label={label}
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
