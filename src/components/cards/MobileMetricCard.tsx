// src/pages/admin/components/MobileMetricCard.tsx
import { forwardRef } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { colors } from '../../theme/colors.ts';

type Props = {
  title: string;
  value: React.ReactNode;
  trendLabel?: string; // e.g. "—", "You have 30% climb"
  trendUp?: boolean; // choose success/caution color
  loading?: boolean; // show skeletons
  sx?: SxProps<Theme>; // optional extra styles
};

const MobileMetricCard = forwardRef<HTMLDivElement, Props>(
  (
    { title, value, trendLabel = '—', trendUp = true, loading = false, sx },
    ref
  ) => (
    <Box
      ref={ref}
      sx={{
        background: colors.Card,
        minWidth: '230px',
        width: '110vw',
        maxWidth: '489px',
        border: '1px solid #3B3B3B',
        height: '135px',
        borderRadius: '10px',
        boxShadow: '2px 2px 10px 2px #2B2B2BB0',
        p: '20px 10px',
        gap: '25px',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      {loading ? (
        <>
          <Skeleton variant='text' width='40%' sx={{ bgcolor: '#333' }} />
          <Skeleton variant='text' width='60%' sx={{ bgcolor: '#333' }} />
          <Skeleton
            variant='text'
            width='30%'
            sx={{ bgcolor: '#333', alignSelf: 'flex-end' }}
          />
        </>
      ) : (
        <>
          <Typography
            variant='mediumHeaderBold'
            component='p'
            sx={{ textTransform: 'uppercase', color: colors.Freeze }}
          >
            {title}
          </Typography>

          <Typography
            variant='bodyTextMilkDefault'
            component='p'
            sx={{ fontWeight: 700, color: colors.Freeze }}
          >
            {value}
          </Typography>

          <Box sx={{ width: '100%', textAlign: 'right' }}>
            <Typography
              variant='bodyTextMilkDefault'
              component='p'
              sx={{
                fontWeight: 500,
                color: trendUp ? colors.Success : colors.Caution,
              }}
            >
              {trendLabel}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  )
);

export default MobileMetricCard;
