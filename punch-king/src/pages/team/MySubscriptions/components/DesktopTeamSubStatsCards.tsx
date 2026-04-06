import { Box, Button, Skeleton, Typography } from '@mui/material';
import dayjs from 'dayjs';

type ActiveSubCard = {
  planLabel: string;
  endLabel: string;
};

function planLabelFrom(type?: string) {
  if (!type) return '—';
  const t = type.toLowerCase();
  if (t.includes('semi')) return '6 months subscription';
  if (t.includes('6')) return '6 months subscription';
  return 'Annual subscription';
}

function fmtDate(iso?: string) {
  return iso ? dayjs(iso).format('M/D/YYYY') : '—';
}

type Props = {
  loading?: boolean;
  active?: {
    type?: string | null;
    end_date?: string | null;
  } | null;
  annualCount?: number;
  semiAnnualCount?: number;
  onSubscribe?: () => void;
};

export default function DesktopTeamSubStatsCards({
  loading,
  active,
  annualCount = 0,
  semiAnnualCount = 0,
  onSubscribe,
}: Props) {
  // Card 1 — Active sub
  const activeCard: ActiveSubCard = {
    planLabel: planLabelFrom(active?.type ?? undefined),
    endLabel: fmtDate(active?.end_date ?? undefined),
  };

  const Card = ({ children }: { children: React.ReactNode }) => (
    <Box
      sx={{
        bgcolor: '#1E1E1E',
        borderRadius: 2,
        border: '1px solid #2C2C2C',
        p: 2.25,
        minHeight: 120,
      }}
    >
      {children}
    </Box>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
          gap: 2,
          mt: 2,
        }}
      >
        <Card>
          <Skeleton height={20} width={160} sx={{ mb: 1 }} />
          <Skeleton height={18} width={200} sx={{ mb: 1 }} />
          <Skeleton height={36} width={120} />
        </Card>
        <Card>
          <Skeleton height={20} width={180} sx={{ mb: 1 }} />
          <Skeleton height={42} width={60} />
        </Card>
        <Card>
          <Skeleton height={20} width={200} sx={{ mb: 1 }} />
          <Skeleton height={42} width={60} />
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
        gap: 2,
        mt: 2,
      }}
    >
      {/* Active subscription */}
      <Card>
        <Typography sx={{ fontWeight: 800, fontSize: 14, color: '#CFCFCF' }}>
          Active subscription
        </Typography>

        {active ? (
          <>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: '#BDBDBD' }}>
              {activeCard.planLabel}
            </Typography>
            <Typography sx={{ mt: 0.25, fontSize: 13, color: '#BDBDBD' }}>
              Ends {activeCard.endLabel}
            </Typography>
          </>
        ) : (
          <Typography sx={{ mt: 0.5, fontSize: 13, color: '#BDBDBD' }}>
            No active subscription
          </Typography>
        )}

        <Box sx={{ mt: 1.25 }}>
          <Button
            onClick={onSubscribe}
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
            Subscribe
          </Button>
        </Box>
      </Card>

      {/* Annual count */}
      <Card>
        <Typography sx={{ fontWeight: 800, fontSize: 14, color: '#CFCFCF' }}>
          Annual subscriptions
        </Typography>
        <Typography sx={{ mt: 1, fontWeight: 800, fontSize: 28 }}>
          {annualCount}
        </Typography>
      </Card>

      {/* 6 months count */}
      <Card>
        <Typography sx={{ fontWeight: 800, fontSize: 14, color: '#CFCFCF' }}>
          6 months subscription
        </Typography>
        <Typography sx={{ mt: 1, fontWeight: 800, fontSize: 28 }}>
          {semiAnnualCount}
        </Typography>
      </Card>
    </Box>
  );
}
