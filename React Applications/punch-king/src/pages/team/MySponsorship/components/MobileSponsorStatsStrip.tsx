// src/pages/team/MySponsorship/components/MobileSponsorStatsStrip.tsx
import * as React from 'react';
import { Box, Skeleton, Typography } from '@mui/material';



const cardSx = {
  background: '#1A1A1A',
  minWidth: '230px',
  width: '110vw', // ⬅️ match MobileTeamMetricCards
  maxWidth: '489px', // ⬅️ match MobileTeamMetricCards
  border: '1px solid #3B3B3B',
  height: '135px',
  borderRadius: '10px',
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  p: '20px 10px',
  gap: '25px',
  display: 'flex',
  flexDirection: 'column' as const,
};

export default function MobileSponsorStatsStrip({
  loading,
  totalSponsorships,
  totalSponsors,
  sponsorshipValue,
  teamRank,
}: {
  loading?: boolean;
  totalSponsorships: number;
  totalSponsors: number;
  sponsorshipValue: number;
  teamRank: number;
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const secondRef = React.useRef<HTMLDivElement | null>(null);

  // Auto-scroll to card 2 like your team metrics component
  React.useEffect(() => {
    secondRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
  }, []);

  const items = [
    { title: 'CHIPS', total: totalSponsorships },
    { title: 'SPONSORS', total: totalSponsors },
    { title: 'VALUE', total: (sponsorshipValue) },
    { title: 'RANK', total: teamRank },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          overflow: 'auto',
          flexDirection: 'row',
          width: '100%',
          gap: '40px',
          px: 2,
          py: 1,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box key={i} sx={{ ...cardSx, opacity: 0.6 }}>
            <Skeleton variant='text' width='60%' />
            <Skeleton variant='text' width='40%' />
            <Skeleton variant='text' width='30%' sx={{ ml: 'auto' }} />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'row',
        width: '100%',
        gap: '40px', // ⬅️ match MobileTeamMetricCards
        px: 2,
        py: 1,
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {items.map((m, idx) => (
        <Box
          key={String(m.title)}
          ref={idx === 1 ? secondRef : null}
          sx={cardSx}
        >
          <Typography
            sx={{
              textTransform: 'uppercase',
              color: '#FFFCF4',
              fontWeight: 800,
            }}
          >
            {m.title}
          </Typography>

          <Typography sx={{ color: '#FFFCF4', fontWeight: 700, fontSize: 18 }}>
            {m.total}
          </Typography>

          <Box sx={{ width: '100%', textAlign: 'right' }}>
            {/* reserved space for trend text if you add later */}
          </Box>
        </Box>
      ))}
    </Box>
  );
}


