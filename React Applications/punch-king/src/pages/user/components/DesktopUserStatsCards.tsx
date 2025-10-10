// src/pages/user/components/DesktopUserStatsCards.tsx
import { Box, Button, Card, CardContent, Skeleton, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type Props = {
  loading?: boolean;
  myUnits?: number;
  spentUnits?: number;
  costOfUnits?: number;
  sponsoredTeams?: number;
  onBuy?: () => void;
  onViewSponsored?: () => void;

  // Legacy (still supported)
  buyVariant?: 'button' | 'text';
  buyLabel?: string;

  // New, agnostic CTA (preferred)
  cta?: ReactNode; // full override: render this node
  onCta?: () => void; // handler for default CTA
  ctaVariant?: 'button' | 'text'; // default: 'button'
  ctaLabel?: string; // default: 'Buy sponsor units' | 'Buy'
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
  fontSize: 12, // small like your screenshot; bump to 16 if you prefer the global card spec
  mb: 1,
};

const valueSx = {
  color: '#fff',
  fontWeight: 700,
  fontSize: 30,
  lineHeight: 1,
};

function fmtNumber(n?: number) {
  const v = typeof n === 'number' ? n : 0;
  return new Intl.NumberFormat('en-NG').format(v);
}

function Title({
  loading,
  children,
}: {
  loading?: boolean;
  children: React.ReactNode;
}) {
  return loading ? (
    <Skeleton
      variant='text'
      animation='wave'
      width={140}
      sx={{ bgcolor: '#2a2a2a', borderRadius: 1, height: 18 }}
    />
  ) : (
    <Typography sx={titleSx}>{children}</Typography>
  );
}

function Value({
  loading,
  children,
}: {
  loading?: boolean;
  children: React.ReactNode;
}) {
  return loading ? (
    <Skeleton
      variant='text'
      animation='wave'
      width={90}
      sx={{ bgcolor: '#2a2a2a', borderRadius: 1, height: 36 }}
    />
  ) : (
    <Typography sx={valueSx}>{children}</Typography>
  );
}

function CtaSkeleton() {
  return (
    <Skeleton
      variant='rectangular'
      animation='wave'
      width={44}
      height={18}
      sx={{ bgcolor: '#2a2a2a', borderRadius: '4px' }}
    />
  );
}


export default function DesktopUserStatsCards({
  loading,
  myUnits = 0,
  spentUnits = 0,
  costOfUnits = 0,
  sponsoredTeams = 0,
  // legacy
  onBuy,
  buyVariant,
  buyLabel,

  // new
  cta,
  onCta,
  ctaVariant,
  ctaLabel,
  onViewSponsored,
}: Props) {
  if (loading) return <Skeletons />;

  // Prefer new props; fall back to legacy
  const variant: 'button' | 'text' = cta
    ? 'button'
    : ctaVariant ?? buyVariant ?? 'button';
  const label =
    ctaLabel ?? buyLabel ?? (variant === 'text' ? 'Buy' : 'Buy sponsor units');
  const handle = onCta ?? onBuy;

  const ctaNode = cta ?? (
    <Button
      onClick={handle}
      variant={variant === 'button' ? 'contained' : 'text'}
      sx={{
        bgcolor: variant === 'button' ? gold : 'transparent',
        color: variant === 'button' ? '#000' : gold,
        textTransform: 'none',
        fontWeight: 700,
        borderRadius: '10px',
        px: variant === 'button' ? 2 : 0,
        minWidth: variant === 'button' ? undefined : 0,
      }}
    >
      {label}
    </Button>
  );

  // ★ Decide alignment: text CTAs right-align; button/custom left-align.
  const ctaJustify: 'flex-start' | 'flex-end' = cta
    ? 'flex-start'
    : variant === 'text'
    ? 'flex-end'
    : 'flex-start';

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        width: '100%',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(260px, 1fr))' },
      }}
    >
      {/* MY SPONSORSHIP UNITS */}
      <Box sx={cardSx}>
        <Box>
          <Title loading={loading}>MY CHIPS</Title>
          <Value loading={loading}>{myUnits}</Value>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: ctaJustify }}>
          {loading ? <CtaSkeleton /> : ctaNode}{' '}
        </Box>
      </Box>

      {/* SPENT UNITS */}
      <Box sx={cardSx}>
        <Box>
          <Title loading={loading}>SPENT UNITS</Title>
          <Value loading={loading}>{spentUnits}</Value>
        </Box>
      </Box>

      {/* COST OF UNITS (number only, no NGN symbol per your card guidance) */}
      <Box sx={cardSx}>
        <Box>
          <Title loading={loading}>COST OF UNITS</Title>
          <Value loading={loading}>{fmtNumber(costOfUnits)}</Value>
        </Box>
      </Box>

      {/* SPONSORED TEAMS (second row) */}
      <Box sx={{ ...cardSx }}>
        <Box>
          <Title loading={loading}>SPONSORED TEAMS</Title>
          <Value loading={loading}>{sponsoredTeams}</Value>
        </Box>

        {(() => {
          const showView = typeof onViewSponsored === 'function';
          return (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {loading ? (
                showView ? (
                  <CtaSkeleton />
                ) : null
              ) : showView ? (
                <Button
                  onClick={onViewSponsored}
                  variant='text'
                  sx={{
                    color: gold,
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 0,
                    minWidth: 0,
                  }}
                >
                  View
                </Button>
              ) : null}
            </Box>
          );
        })()}
      </Box>
    </Box>
  );
}


function Skeletons() {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
      }}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} sx={cardSx}>
          <CardContent>
            <Skeleton variant='text' width='60%' />
            <Skeleton variant='text' width='30%' />
            <Skeleton variant='rectangular' height={36} sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
