import { Box, Button, Skeleton, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

type Props = {
  loading?: boolean;
  myUnits: number;
  spentUnits: number;
  onBuy: () => void;
  sx?: SxProps<Theme>;
};

export default function MobileSponsorshipTwoCards({
  loading = false,
  myUnits,
  spentUnits,
  onBuy,
  sx,
}: Props) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.25,
        gridTemplateColumns: '1fr',
        ...sx,
      }}
    >
      {/* Card 1: My Sponsorship Units + Buy */}
      <Box
        sx={{
          background: '#1A1A1A',
          border: '1px solid #3B3B3B',
          boxShadow: '2px 2px 10px 2px #2B2B2BB0',
          borderRadius: '10px',
          p: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 92,
        }}
      >
        <Box>
          <Typography
            sx={{ color: '#FFFCF4', fontWeight: 900, fontSize: 14, mb: 0.5 }}
          >
            My Sponsorship Units
          </Typography>
          {loading ? (
            <Skeleton variant='text' width={80} sx={{ bgcolor: '#333' }} />
          ) : (
            <Typography
              sx={{ color: '#EDEDED', fontWeight: 700, fontSize: 18 }}
            >
              {myUnits}
            </Typography>
          )}
        </Box>

        <Button
          variant='contained'
          onClick={onBuy}
          sx={{
            bgcolor: '#EFAF00',
            color: '#000',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '8px',
            height: 36,
            px: 2,
          }}
        >
          Buy
        </Button>
      </Box>

      {/* Card 2: Spent Units */}
      <Box
        sx={{
          background: '#1A1A1A',
          border: '1px solid #3B3B3B',
          boxShadow: '2px 2px 10px 2px #2B2B2BB0',
          borderRadius: '10px',
          p: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 92,
        }}
      >
        <Box>
          <Typography
            sx={{ color: '#FFFCF4', fontWeight: 900, fontSize: 14, mb: 0.5 }}
          >
            Spent Units
          </Typography>
          {loading ? (
            <Skeleton variant='text' width={80} sx={{ bgcolor: '#333' }} />
          ) : (
            <Typography
              sx={{ color: '#EDEDED', fontWeight: 700, fontSize: 18 }}
            >
              {spentUnits}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
