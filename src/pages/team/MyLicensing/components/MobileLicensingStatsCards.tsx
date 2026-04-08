// src/pages/team/MyLicensing/components/MobileLicensingStatsCards.tsx
import { Box, Skeleton, Typography, Button } from '@mui/material';

type Active = { type?: string | null; end_date?: string | null } | null;

type Props = {
  loading?: boolean;
  active: Active;
  totalLicenses: number;
  onGetLicense?: () => void;
};

const cardSx = {
  background: '#1A1A1A',
  border: '1px solid #3B3B3B',
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  borderRadius: '10px',
  minWidth: '230px',
  width: '110vw',
  maxWidth: '489px',
  p: '16px 12px',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '10px',
};

export default function MobileLicensingStatsCards({
  loading,
  active,
  totalLicenses,
  onGetLicense,
}: Props) {


  if (loading) {
    return (
      <Box sx={{ display: 'flex', overflowX: 'auto', gap: 4, px: 2, py: 1 }}>
        {[0, 1].map((i) => (
          <Box key={i} sx={cardSx}>
            <Skeleton width='70%' height={18} />
            <Skeleton width='90%' height={16} />
            <Skeleton width={120} height={36} />
          </Box>
        ))}
      </Box>
    );
  }

  const planLabel = (() => {
    const t = (active?.type ?? '').toLowerCase();
    if (!t) return 'No active license';
    if (t.includes('semi') || t.includes('6')) return 'License (6 months)';
    return 'License (Annual)';
  })();

  return (
    <Box sx={{ display: 'flex', overflowX: 'auto', gap: 4, px: 2, py: 1 }}>
      {/* Active license */}
      <Box sx={cardSx}>
        <Typography sx={{ color: '#CFCFCF', fontWeight: 800, fontSize: 14 }}>
          {' '}
          Active License
        </Typography>
        <Typography sx={{ color: '#BDBDBD', fontSize: 13 }}>
          {planLabel}
        </Typography>
        {active?.end_date ? (
          <Typography sx={{ color: '#BDBDBD', fontSize: 13 }}>
            License expires {active.end_date}
          </Typography>
        ) : null}
        <Box sx={{ mt: 0.5 }}>
          <Button
            onClick={onGetLicense}
            variant='contained'
            sx={{
              bgcolor: '#EFAF00',
              color: '#000',
              textTransform: 'none',
              fontWeight: 700,
              height: 36,
              borderRadius: '10px',
              px: 3,
              '&:hover': { bgcolor: '#E9A600' },
            }}
          >
            Get license
          </Button>
        </Box>
      </Box>
      {/* All licenses */}
      <Box sx={cardSx}>
        <Typography sx={{ color: '#CFCFCF', fontWeight: 800, fontSize: 14 }}>
          All licenses
        </Typography>
        <Typography sx={{ fontWeight: 900, fontSize: 28 }}>
          {totalLicenses}
        </Typography>
      </Box>
    </Box>
  );
}
