// src/pages/admin/Teams/components/catalogue/TeamPostCarousel.tsx
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import {
  Box,
  IconButton,
  Skeleton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import type { TeamPost } from '../../../api/teams.types.ts';
import { useTeamPosts } from '../../../hooks/useTeamPosts.tsx';
import TeamPostCard from './DesktopTeamPostCard.tsx';
import TeamPostModal from './DesktopTeamPostModal.tsx';

type Props = { teamId: number; title?: string };

export default function TeamPostCarousel({
  teamId,
  title = 'TEAM CATALOGUE',
}: Props) {
  const { data, isLoading } = useTeamPosts(teamId);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<TeamPost | null>(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const isSm = useMediaQuery('(max-width:600px)');

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, clientWidth, scrollWidth } = el;

    // overflow exists?
    const hasOverflow = scrollWidth > clientWidth + 1; // +1 for rounding
    if (!hasOverflow) {
      setShowPrev(false);
      setShowNext(false);
      return;
    }
    const atStart = scrollLeft <= 0;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 1; // -1 for rounding
    setShowPrev(!atStart);
    setShowNext(!atEnd);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateArrows();

    const onScroll = () => updateArrows();
    el.addEventListener('scroll', onScroll, { passive: true });

    // Respond to size/content changes
    const ro = new ResizeObserver(() => updateArrows());
    ro.observe(el);

    // Also recheck on window resize (fonts/zoom)
    const onWinResize = () => updateArrows();
    window.addEventListener('resize', onWinResize);

    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
      window.removeEventListener('resize', onWinResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recalculate when data changes
  useEffect(() => {
    // next frame so the DOM renders first
    const id = requestAnimationFrame(updateArrows);
    return () => cancelAnimationFrame(id);
  }, [data]);

  const scrollBy = (dir: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = isSm ? 280 : 340;
    el.scrollBy({
      left: dir === 'left' ? -cardWidth - 24 : cardWidth + 24,
      behavior: 'smooth',
    });
  };

  return (
    <Box
      sx={{
        // border: '2px solid green',
        padding: '1.56em 6.98em',
        '@media (min-width:910px) and (max-width:1000px)': {
          padding: '1.56em 2em',
          pl: '3em',
        },
        '@media (min-width:1000px) and (max-width:1100px)': {
          px: '1em',
          pl: '2rem',
        },
      }}
    >
      <Typography variant='h5' sx={{ fontWeight: 900, color: '#fff', mb: 2 }}>
        {title}
      </Typography>

      <Box sx={{ position: 'relative' }}>
        {showPrev && (
          <IconButton
            aria-label='previous'
            onClick={() => scrollBy('left')}
            sx={{
              position: 'absolute',
              top: '40%',
              left: -12,
              zIndex: 2,
              bgcolor: '#111',
              border: '2px solid #EFAF00',
              color: '#EFAF00',
              '&:hover': { bgcolor: '#000' },
            }}
          >
            <ChevronLeftRounded />
          </IconButton>
        )}

        {showNext && (
          <IconButton
            aria-label='next'
            onClick={() => scrollBy('right')}
            sx={{
              position: 'absolute',
              top: '40%',
              right: -12,
              zIndex: 2,
              bgcolor: '#111',
              border: '2px solid #EFAF00',
              color: '#EFAF00',
              '&:hover': { bgcolor: '#000' },
            }}
          >
            <ChevronRightRounded />
          </IconButton>
        )}

        <Box
          ref={scrollerRef}
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            pr: 1,
          }}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant='rectangular'
                  width={320}
                  height={240}
                  sx={{ bgcolor: '#222', borderRadius: 2 }}
                />
              ))
            : ((data) ?? []).map(
                (it) => (
                  <TeamPostCard key={it.id} item={it} onOpen={setSelected} />
                )
              )}
        </Box>
      </Box>

      <TeamPostModal
        open={!!selected}
        onClose={() => setSelected(null)}
        item={selected}
      />
    </Box>
  );
}
