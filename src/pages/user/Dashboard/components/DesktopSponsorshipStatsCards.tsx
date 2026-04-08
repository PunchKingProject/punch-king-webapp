// src/pages/user/Sponsorship/components/DesktopSponsorshipStatsCards.tsx
import { Box, Button, Skeleton, Typography } from '@mui/material';

type Props = {
  loading?: boolean;
  myUnits?: number;
  spentUnits?: number;
  onBuy?: () => void;
};

const gold = '#EFAF00';

const cardSx = {
  background: '#1A1A1A',
  border: '1px solid #3B3B3B',
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  borderRadius: '12px',
  p: 2,
  minHeight: 130,
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'space-between',
};

const titleSx = {
  color: '#C9C9C9',
  fontWeight: 700,
  fontSize: 12,
  mb: 1,
};

const valueSx = {
  color: '#fff',
  fontWeight: 700,
  fontSize: 30,
  lineHeight: 1,
};

export default function DesktopSponsorshipStatsCards({
  loading,
  myUnits = 0,
  spentUnits = 0,
  onBuy,
}: Props) {
 

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(260px, 1fr))' },
      }}
    >
      {/* MY SPONSORSHIP UNITS */}
      <Box sx={cardSx}>
        <Box>
          <Typography sx={titleSx}>MY CHIPS</Typography>
          {loading ? (
            <Skeleton
              variant='text'
              width={60}
              sx={{ bgcolor: '#2a2a2a', height: 36, borderRadius: 1 }}
            />
          ) : (
            <Typography sx={valueSx}>{myUnits}</Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={onBuy}
            variant='text'
            sx={{
              color: gold,
              textTransform: 'none',
              fontWeight: 700,
              px: 0,
              minWidth: 0,
            }}
          >
            Buy
          </Button>
        </Box>
      </Box>
      {/* SPENT UNITS */}
      <Box sx={cardSx}>
        <Box>
          <Typography sx={titleSx}>SPENT UNITS</Typography>
          {loading ? (
            <Skeleton
              variant='text'
              width={60}
              sx={{ bgcolor: '#2a2a2a', height: 36, borderRadius: 1 }}
            />
          ) : (
            <Typography sx={valueSx}>{spentUnits}</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
