import { Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

type Props = {
  loading?: boolean;
  posts?: number;
  comments?: number;
  uniqueSponsors?: number;
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
  justifyContent: 'space-between',
  scrollSnapAlign: 'start',
};

export default function MobileCatalogueStatsCards({
  loading = false,
  posts = 0,
  comments = 0,
  uniqueSponsors = 0,
}: Props) {
  const secondCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    secondCardRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, []);

  const cards = [
    {
      title: 'TOTAL POSTS',
      value: posts,
      color: '#FFC107',
    },
    {
      title: 'TOTAL COMMENTS',
      value: comments,
      color: '#4CAF50',
    },
    {
      title: 'UNIQUE SPONSORS',
      value: uniqueSponsors,
      color: '#2196F3',
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        px: 1,
        pb: 1,
        scrollSnapType: 'x mandatory',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
      }}
    >
      {loading
        ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              sx={cardSx}
            />
          ))
        : cards.map((card, index) => (
            <Box
              key={card.title}
              ref={index === 1 ? secondCardRef : null}
              sx={cardSx}
            >
              <Typography
                sx={{
                  color: '#9E9E9E',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                {card.title}
              </Typography>

              <Typography
                sx={{
                  color: '#FFFFFF',
                  fontSize: 34,
                  fontWeight: 800,
                }}
              >
                {card.value.toLocaleString()}
              </Typography>

              <Typography
                sx={{
                  color: card.color,
                  fontSize: 12,
                  fontWeight: 600,
                  textAlign: 'right',
                }}
              >
                Live Statistics
              </Typography>
            </Box>
          ))}
    </Box>
  );
}