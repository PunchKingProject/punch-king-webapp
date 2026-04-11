import { Box, Button, Skeleton, Typography } from '@mui/material';
import dayjs from 'dayjs';

type ActiveSub = {
  type?: string | null;
  end_date?: string | null;
} | null;

type Props = {
  loading?: boolean;
  active: ActiveSub;
  annualCount: number;
  semiAnnualCount: number;
  onSubscribe: () => void;
};

const cardSx = {
  background: '#1A1A1A',
  border: '1px solid #3B3B3B',
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  borderRadius: '10px',
  minWidth: 230,
  width: '110vw',
  maxWidth: 489,
  p: '20px 10px',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px',
};

function planLabelFrom(type?: string | null): string {
  if (!type) return '—';
  const t = type.toLowerCase();
  if (t.includes('semi') || t.includes('6')) return '6 months subscription';
  return 'Annual subscription';
}

function fmtDate(iso?: string | null): string {
  return iso ? dayjs(iso).format('M/D/YYYY') : '—';
}

export default function MobileSubStatsStrip({
  loading,
  active,
  annualCount,
  semiAnnualCount,
  onSubscribe,
}: Props) {
  const gold = '#EFAF00';

  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        gap: '40px',
        px: 2,
        py: 1,
        scrollSnapType: 'x mandatory',
      }}
    >
      {/* Card 1: Active subscription */}
      <Box sx={{ ...cardSx, scrollSnapAlign: 'start' }}>
        {loading ? (
          <>
            <Skeleton width={160} height={18} sx={{ bgcolor: '#2a2a2a' }} />
            <Skeleton width={200} height={18} sx={{ bgcolor: '#2a2a2a' }} />
            <Skeleton width={120} height={36} sx={{ bgcolor: '#2a2a2a' }} />
          </>
        ) : (
          <>
            <Typography
              sx={{
                textTransform: 'uppercase',
                color: '#EDEDED',
                fontWeight: 700,
              }}
            >
              Active subscription
            </Typography>
            {active ? (
              <>
                <Typography sx={{ color: '#C9C9C9', fontWeight: 600 }}>
                  {planLabelFrom(active.type)}
                </Typography>
                <Typography sx={{ color: '#C9C9C9' }}>
                  Ends {fmtDate(active.end_date)}
                </Typography>
              </>
            ) : (
              <Typography sx={{ color: '#C9C9C9' }}>
                No active subscription
              </Typography>
            )}
            <Box sx={{ textAlign: 'right' }}>
              <Button
                onClick={onSubscribe}
                variant='contained'
                sx={{
                  bgcolor: gold,
                  color: '#000',
                  textTransform: 'none',
                  fontWeight: 700,
                  height: 36,
                  borderRadius: '10px',
                  px: 3,
                  '&:hover': { bgcolor: '#E9A600' },
                }}
              >
                Subscribe
              </Button>
            </Box>
          </>
        )}
      </Box>

      {/* Card 2: Annual count */}
      <Box sx={{ ...cardSx, scrollSnapAlign: 'start' }}>
        {loading ? (
          <>
            <Skeleton width={180} height={18} sx={{ bgcolor: '#2a2a2a' }} />
            <Skeleton width={60} height={42} sx={{ bgcolor: '#2a2a2a' }} />
          </>
        ) : (
          <>
            <Typography
              sx={{
                textTransform: 'uppercase',
                color: '#EDEDED',
                fontWeight: 700,
              }}
            >
              Annual subscriptions
            </Typography>
            <Typography
              sx={{ color: '#EDEDED', fontWeight: 800, fontSize: 28 }}
            >
              {annualCount}
            </Typography>
          </>
        )}
      </Box>

      {/* Card 3: 6 months count */}
      <Box sx={{ ...cardSx, scrollSnapAlign: 'start' }}>
        {loading ? (
          <>
            <Skeleton width={200} height={18} sx={{ bgcolor: '#2a2a2a' }} />
            <Skeleton width={60} height={42} sx={{ bgcolor: '#2a2a2a' }} />
          </>
        ) : (
          <>
            <Typography
              sx={{
                textTransform: 'uppercase',
                color: '#EDEDED',
                fontWeight: 700,
              }}
            >
              6 months subscription
            </Typography>
            <Typography
              sx={{ color: '#EDEDED', fontWeight: 800, fontSize: 28 }}
            >
              {semiAnnualCount}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}
