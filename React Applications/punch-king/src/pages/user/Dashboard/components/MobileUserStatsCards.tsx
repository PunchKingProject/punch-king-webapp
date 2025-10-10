import { Box, Button, Skeleton, Typography } from '@mui/material';
import * as React from 'react';

type Props = {
  loading?: boolean;
  myUnits?: number;
  spentUnits?: number;
  costOfUnits?: number;
  sponsoredTeams?: number;
  ctaLabel?: string;
  ctaVariant?: 'button' | 'text';
  onCta?: () => void;
  onViewSponsored?: () => void;
};

const gold = '#EFAF00';

const cardSx = {
  background: '#1A1A1A',
  border: '1px solid #3B3B3B',
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  borderRadius: '12px',
  p: 2,
  minHeight: 100,
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'space-between',
};

const titleSx = { color: '#C9C9C9', fontWeight: 700, fontSize: 12, mb: 0.75 };
const valueSx = { color: '#fff', fontWeight: 800, fontSize: 26, lineHeight: 1 };

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
      width={120}
      sx={{ bgcolor: '#2a2a2a', height: 18 }}
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
      width={70}
      sx={{ bgcolor: '#2a2a2a', height: 30 }}
    />
  ) : (
    <Typography sx={valueSx}>{children}</Typography>
  );
}

export default function MobileUserStatsCards({
  loading,
  myUnits = 0,
  spentUnits = 0,
  costOfUnits = 0,
  sponsoredTeams = 0,
  ctaLabel = 'Buy',
  ctaVariant = 'button',
  onCta,
  onViewSponsored,
}: Props) {
  return (
    <Box sx={{ display: 'grid', gap: 1.5 }}>
      {/* Row 1: My units + Cost of units */}
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: '1fr 1fr' }}>
        {/* My units w/ Buy button */}
        <Box sx={cardSx}>
          <Box>
            <Title loading={loading}>MY CHIPS</Title>
            <Value loading={loading}>{fmtNumber(myUnits)}</Value>
          </Box>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {loading ? (
              <Skeleton
                variant='rectangular'
                width={44}
                height={20}
                sx={{ bgcolor: '#2a2a2a', borderRadius: 1 }}
              />
            ) : (
              <Button
                onClick={onCta}
                variant={ctaVariant === 'button' ? 'contained' : 'text'}
                sx={{
                  bgcolor: ctaVariant === 'button' ? gold : 'transparent',
                  color: ctaVariant === 'button' ? '#000' : gold,
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: '10px',
                  px: ctaVariant === 'button' ? 2 : 0,
                  minWidth: ctaVariant === 'button' ? undefined : 0,
                  height: 28,
                }}
              >
                {ctaLabel}
              </Button>
            )}
          </Box>
        </Box>

        {/* Cost of units (just number) */}
        <Box sx={cardSx}>
          <Box>
            <Title loading={loading}>COST OF UNITS</Title>
            <Value loading={loading}>{fmtNumber(costOfUnits)}</Value>
          </Box>
        </Box>
      </Box>

      {/* Row 2: Spent units + Sponsored teams (with View) */}
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: '1fr 1fr' }}>
        <Box sx={cardSx}>
          <Box>
            <Title loading={loading}>SPENT UNITS</Title>
            <Value loading={loading}>{fmtNumber(spentUnits)}</Value>
          </Box>
        </Box>

        <Box sx={cardSx}>
          <Box>
            <Title loading={loading}>SPONSORED TEAMS</Title>
            <Value loading={loading}>{fmtNumber(sponsoredTeams)}</Value>
          </Box>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {loading ? (
              <Skeleton
                variant='rectangular'
                width={44}
                height={20}
                sx={{ bgcolor: '#2a2a2a', borderRadius: 1 }}
              />
            ) : onViewSponsored ? (
              <Button
                onClick={onViewSponsored}
                variant='text'
                sx={{
                  color: gold,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 0,
                  minWidth: 0,
                  height: 28,
                }}
              >
                View
              </Button>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
