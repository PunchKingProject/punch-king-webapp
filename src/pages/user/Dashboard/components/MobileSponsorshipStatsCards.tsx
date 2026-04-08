// src/pages/user/Sponsorship/mobile/components/MobileSponsorshipStatsCards.tsx
import { Box, Button } from '@mui/material';
import MobileMetricCard from '../../../../components/cards/MobileMetricCard';

type Props = {
  loading?: boolean;
  myUnits: number;
  spentUnits: number;
  onBuy: () => void;
};

const fmt = (n: number) => {
  try {
    return new Intl.NumberFormat().format(n);
  } catch {
    return String(n);
  }
};

export default function MobileSponsorshipStatsCards({
  loading = false,
  myUnits,
  spentUnits,
  onBuy,
}: Props) {

  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        gap: 2,
        pb: 1,
        '& > *': { flex: '0 0 auto' },
      }}
    >
      {/* My Units (with Buy CTA) */}
      <Box sx={{ position: 'relative' }}>
        <MobileMetricCard
          title='MY SPONSORSHIP UNITS'
          value={loading ? '—' : fmt(myUnits)}
          trendLabel='—'
          trendUp
          loading={loading}
          sx={{ pr: '84px' /* extra space for the button */ }}
        />
        <Button
          variant='contained'
          onClick={onBuy}
          size='small'
          sx={{
            position: 'absolute',
            top: 16,
            right: 12,
            height: 28,
            borderRadius: '8px',
            fontWeight: 700,
            textTransform: 'none',
            bgcolor: '#EFAF00',
            color: '#000',
            '&:hover': { bgcolor: '#d99c00' },
          }}
        >Buy</Button>
      </Box>
      {/* Spent Units */}
      <MobileMetricCard
        title='SPENT UNITS'
        value={loading ? '—' : fmt(spentUnits)}
        trendLabel='—'
        trendUp={false}
        loading={loading}
      />
    </Box>
  );
}
