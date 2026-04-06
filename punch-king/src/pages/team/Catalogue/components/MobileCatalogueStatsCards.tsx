import { Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

type Props = {
  loading?: boolean;
  posts: number;
  comments: number;
  uniqueSponsors: number;
};

const cardSx = {
  background: '#1A1A1A',
  minWidth: 230,
  maxWidth: 489,
  width: '85vw',
  border: '1px solid #3B3B3B',
  height: 135,
  borderRadius: '10px',
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  p: '20px 10px',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '14px',
};

export default function MobileCatalogueStatsCards({
  loading,
  posts,
  comments,
  uniqueSponsors,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const secondRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // center the 2nd card slightly for the “peek” look
    secondRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
  }, []);

  const items = [
    { title: 'Total posts', value: posts },
    { title: 'Total comments', value: comments },
    { title: 'Unique sponsors', value: uniqueSponsors },
  ];

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        overflowX: 'auto',
        gap: '16px',
        px: 0.5,
        py: 0.5,
        scrollSnapType: 'x mandatory',
      }}
    >
      {loading
        ? Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant='rectangular' sx={cardSx} />
          ))
        : items.map((it, idx) => (
            <Box
              key={it.title}
              ref={idx === 1 ? secondRef : null}
              sx={{ ...cardSx, scrollSnapAlign: 'start' }}
            >
              <Typography
                sx={{ color: '#A2A2A2', fontWeight: 700, fontSize: 13 }}
              >
                {it.title.toUpperCase()}
              </Typography>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 28 }}>
                {it.value}
              </Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ color: '#9ED27B', fontSize: 12 }}>
                  you have 0% climbed
                </Typography>
              </Box>
            </Box>
          ))}
    </Box>
  );
}
