// src/pages/team/MyLicensing/components/DesktopLicenseStatsCards.tsx
import { Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import type { LicenseSummary } from '../api/mylicensing.types';

type Props = {
  loading?: boolean;
  active?: LicenseSummary | null;
  total: number;
  onGetLicense?: () => void;
  onViewAll?: () => void;
};

const fmtDate = (iso?: string) =>
  iso ? dayjs(iso).format('M/D/YYYY') : '—';

const gold = '#EFAF00';
const cardSx = {
  bgcolor: '#111',
  border: `1px solid ${gold}`,
  borderRadius: '10px',
  p: 2,
  minHeight: 120,
};

export default function DesktopLicensingStatsCards({
  loading,
  active,
  total,
  onGetLicense,
  onViewAll,
}: Props) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: '420px 320px' },
        mb: 2,
      }}
    >
      {/* Active license */}
      <Box sx={cardSx}>
        <Typography sx={{ color: '#C9C9C9', fontWeight: 600, mb: 0.5 }}>
          Active License
        </Typography>

        {loading ? (
          <Typography sx={{ color: '#A2A2A2' }}>Loading…</Typography>
        ) : active && active.status === 'active' ? (
          <>
            <Typography sx={{ color: gold, fontSize: 12, mb: 0.5 }}>
              {/* If you later have a license number, show it here */}
              [LICENSE NUMBER]
            </Typography>
            <Typography sx={{ color: '#C9C9C9', fontSize: 12, mb: 1 }}>
              License expires {fmtDate(active.end_date)}
            </Typography>
          </>
        ) : (
          <Typography sx={{ color: '#A2A2A2', fontSize: 12, mb: 1 }}>
            No active license found
          </Typography>
        )}

        <Button
          onClick={onGetLicense}
          variant='contained'
          sx={{
            bgcolor: gold,
            color: '#000',
            textTransform: 'none',
            fontWeight: 700,
            px: 2,
            borderRadius: '8px',
            '&:hover': { bgcolor: '#ffd465' },
          }}
        >
          Get license
        </Button>
      </Box>

      {/* All licenses */}
      <Box sx={cardSx}>
        <Typography sx={{ color: '#C9C9C9', fontWeight: 600 }}>
          All licenses
        </Typography>
        <Typography
          sx={{ color: '#fff', fontSize: 24, fontWeight: 800, mt: 0.5 }}
        >
          {loading ? '—' : total}
        </Typography>

        <Button
          onClick={onViewAll}
          variant='text'
          sx={{
            mt: 1,
            color: gold,
            textTransform: 'none',
            fontWeight: 700,
            px: 0,
            minWidth: 0,
          }}
        >
          View
        </Button>
      </Box>
    </Box>
  );
}
