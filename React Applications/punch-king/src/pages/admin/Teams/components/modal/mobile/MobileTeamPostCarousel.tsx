import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import { Box, IconButton, Skeleton, Typography, useMediaQuery } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { colors } from "../../../../../../theme/colors";
import type { TeamPost } from "../../../api/teams.types";
import { useTeamPosts } from "../../../hooks/useTeamPosts";
import MobilePostModal from "./MobilePostModal";
import MobileTeamPostCard from "./MobileTeamPostCard";


type Props = { teamId: number; title?: string };


function MobileTeamPostCarousel({ teamId, title = 'TEAM CATALOGUE' }: Props) {


    const { data, isLoading } = useTeamPosts(teamId);
    const items = data ?? [];
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const [selected, setSelected] = useState<TeamPost | null>(null);
    const isSm = useMediaQuery('(max-width:600px)');

    const cardWidth = isSm ? 300 : 340;
    const gap = 24;

    const [showLeft, showRight] = useMemo(() => {
      const el = scrollerRef.current;
      if (!el) return [false, false];
      const canLeft = el.scrollLeft > 0;
      const canRight = el.scrollWidth - el.clientWidth - el.scrollLeft > 4;
      return [canLeft, canRight];
    }, []); // recalculated only on mount

    const updateArrows = () => {
      // by reading scrollLeft/scrollWidth we trigger re-render via state below if needed,
      // but we can also just force a render by setting a dummy state if required.
    };

    const scrollBy = (dir: 'left' | 'right') => {
      const el = scrollerRef.current;
      if (!el) return;
      el.scrollBy({
        left: dir === 'left' ? -(cardWidth + gap) : cardWidth + gap,
        behavior: 'smooth',
      });
      setTimeout(updateArrows, 260);
    };


  return (
    <Box sx={{ px: 2, py: 2 }}>
      <Typography variant='h6' sx={{ color: '#fff', fontWeight: 900, mb: 1 }}>
        {title}
      </Typography>

      <Box sx={{ position: 'relative' }}>
        {showLeft && (
          <IconButton
            onClick={() => scrollBy('left')}
            sx={{
              position: 'absolute',
              left: -6,
              top: '40%',
              zIndex: 2,
              bgcolor: '#111',
              border: `1px solid ${colors.Accent}`,
              color: colors.Accent,
              '&:hover': { bgcolor: '#000' },
            }}
          >
            <ChevronLeftRounded />
          </IconButton>
        )}

        {showRight && (
          <IconButton
            onClick={() => scrollBy('right')}
            sx={{
              position: 'absolute',
              right: -6,
              top: '40%',
              zIndex: 2,
              bgcolor: '#111',
              border: `1px solid ${colors.Accent}`,
              color: colors.Accent,
              '&:hover': { bgcolor: '#000' },
            }}
          >
            <ChevronRightRounded />
          </IconButton>
        )}

        <Box
          ref={scrollerRef}
          onScroll={updateArrows}
          sx={{
            display: 'flex',
            gap:4,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            pr: 1,
          }}
        >
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant='rectangular'
                  width={cardWidth}
                  height={260}
                  sx={{ bgcolor: '#222', borderRadius: 2 }}
                />
              ))
            : ([...items, ...items, ...items, ...items]).map((it) => (
                <MobileTeamPostCard
                  key={it.id}
                  item={it}
                  onOpen={setSelected}
                />
              ))}
        </Box>
      </Box>

      {/* Mobile modal */}
      <MobilePostModal
        open={!!selected}
        onClose={() => setSelected(null)}
        media={
          selected ? (
            <img
              src={selected.file_url}
              alt={selected.title}
              style={{ width: '100%', height: 280, objectFit: 'cover' }}
            />
          ) : null
        }
        body={
          selected && (
            <Box sx={{ color: '#fff' }}>
              <Typography sx={{ color: colors.Accent, fontWeight: 700 }}>
                Title:
              </Typography>
              <Typography>{selected.title}</Typography>

              <Typography sx={{ color: colors.Accent, fontWeight: 700, mt: 1 }}>
                Comments:
              </Typography>
              <Typography>{selected.comments_count}</Typography>

              <Box sx={{ display: 'flex', gap: 6, mt: 2 }}>
                <Box>
                  <Typography variant='headerBold' component='p'>
                    {selected.sponsorships}
                  </Typography>
                  <Typography variant='bodyTextMilkDefault'>
                    Sponsorships
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='headerBold' component='p'>
                    {selected.sponsors}
                  </Typography>
                  <Typography variant='bodyTextMilkDefault'>
                    Sponsors
                  </Typography>
                </Box>
              </Box>
            </Box>
          )
        }
      />
    </Box>
  );
}

export default MobileTeamPostCarousel