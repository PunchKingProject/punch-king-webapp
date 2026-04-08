import * as React from 'react';
import { Box, Button, Skeleton, Typography } from '@mui/material';

const gold = '#EFAF00';

type Props = {
  loading?: boolean;
  sponsors: number;
  sponsorships: number;
  licenses: number;
  subscriptions: number;
  onViewSponsors?: () => void;
  onViewSponsorships?: () => void;
};

const card = {
  background: '#1A1A1A',
  border: '1px solid #3B3B3B',
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  borderRadius: '12px',
  p: 2,
  minHeight: 80,
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'space-between',
};

export default function MobileTeamStatsCards({
  loading,
  sponsors,
  sponsorships,
  licenses,
  subscriptions,
  onViewSponsors,
  onViewSponsorships,
}: Props) {
  

  const Title = ({ children }: { children: React.ReactNode }) =>
    loading ? (
      <Skeleton
        variant='text'
        width={120}
        sx={{ bgcolor: '#2a2a2a', height: 16 }}
      />
    ) : (
      <Typography sx={{ color: '#C9C9C9', fontWeight: 700, fontSize: 12 }}>
        {children}
      </Typography>
    );

  const Value = ({ children }: { children: React.ReactNode }) =>
    loading ? (
      <Skeleton
        variant='text'
        width={40}
        sx={{ bgcolor: '#2a2a2a', height: 28 }}
      />
    ) : (
      <Typography
        sx={{ color: '#fff', fontWeight: 800, fontSize: 22, lineHeight: 1 }}
      >
        {children}
      </Typography>
    );

  const View = ({ onClick }: { onClick?: () => void }) =>
    loading ? (
      <Skeleton
        variant='rectangular'
        width={36}
        height={18}
        sx={{ bgcolor: '#2a2a2a', borderRadius: 1 }}
      />
    ) : (
      <Button
        onClick={onClick}
        variant='text'
        sx={{
          color: gold,
          textTransform: 'none',
          fontWeight: 700,
          px: 0,
          minWidth: 0,
        }}
      >View</Button>
    );

  return (
    <Box sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: '1fr 1fr' }}>
      <Box sx={card}>
        <Box>
          <Title>SPONSORS</Title>
          <Value>{sponsors}</Value>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <View onClick={onViewSponsors} />
        </Box>
      </Box>
      <Box sx={card}>
        <Box>
          <Title>SPONSORSHIPS</Title>
          <Value>{sponsorships}</Value>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <View onClick={onViewSponsorships} />
        </Box>
      </Box>
      <Box sx={card}>
        <Box>
          <Title>MY LICENSES</Title>
          <Value>{licenses}</Value>
        </Box>
      </Box>
      <Box sx={card}>
        <Box>
          <Title>MY SUBSCRIPTIONS</Title>
          <Value>{subscriptions}</Value>
        </Box>
      </Box>
    </Box>
  );
}
