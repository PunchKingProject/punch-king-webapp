import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import SportsMmaOutlinedIcon from '@mui/icons-material/SportsMmaOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import type { TeamPost } from '../../../api/teams.types.ts';
import { useTeamPosts } from '../../../hooks/useTeamPosts.tsx';
import TeamPostModal from './DesktopTeamPostModal.tsx';

// Note: Ensure this import path correctly points to your PostMedia component based on your folder structure!
import PostMedia from '../../../../../../components/media/PostMedia.tsx'; 
import { colors } from '../../../../../../theme/colors.ts';

type Props = { teamId: number; title?: string };

// Helper to format dates beautifully
function formatDate(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

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

    const hasOverflow = scrollWidth > clientWidth + 1; 
    if (!hasOverflow) {
      setShowPrev(false);
      setShowNext(false);
      return;
    }
    const atStart = scrollLeft <= 0;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 1; 
    setShowPrev(!atStart);
    setShowNext(!atEnd);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateArrows();

    const onScroll = () => updateArrows();
    el.addEventListener('scroll', onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateArrows());
    ro.observe(el);

    const onWinResize = () => updateArrows();
    window.addEventListener('resize', onWinResize);

    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
      window.removeEventListener('resize', onWinResize);
    };
  }, []);

  useEffect(() => {
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
      <Typography variant='h5' sx={{ fontWeight: 900, color: '#fff', mb: 3 }}>
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
              left: -20,
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
              right: -20,
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
            pb: 2, // padding bottom for shadow
          }}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant='rectangular'
                  sx={{
                    minWidth: 340,
                    height: 420,
                    bgcolor: '#111',
                    borderRadius: 4,
                  }}
                />
              ))
            : (data ?? []).map((it) => (
                <Box key={it.id} sx={{ scrollSnapAlign: 'start' }}>
                  <AdminPremiumPostCard item={it} onOpen={() => setSelected(it)} />
                </Box>
              ))}
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

/* 
|--------------------------------------------------------------------------
| Premium Admin Post Card
|--------------------------------------------------------------------------
| Brings the public catalogue UI to the admin dashboard.
| Video is fully playable (controls={true}).
*/

const AdminPremiumPostCard = ({
  item,
  onOpen,
}: {
  item: TeamPost;
  onOpen: () => void;
}) => {
  // We use "any" cast here to safely access metadata fields that might come from the backend 
  // but aren't strictly typed in TeamPost yet (like boxer_name, weight, etc)
  const extendedItem = item as any;

  return (
    <Card
      sx={{
        bgcolor: '#111',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 4,
        overflow: 'hidden',
        minWidth: 340,
        width: 340,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        transition: 'transform 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          borderColor: 'rgba(239,175,0,0.5)',
        },
      }}
    >
      <Box sx={{ width: '100%' }}>
        {/* controls={true} so the admin can play the video natively! */}
        <PostMedia
          src={item.file_url}
          alt={extendedItem.boxer_name || item.title}
          title={item.title}
          height={210}
          maxHeight={210}
          objectFit='cover'
          borderRadius={0}
          controls={true}
        />
      </Box>

      <CardContent
        sx={{
          p: 2.5,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          gap={1}
          mb={1.5}
        >
          <Chip
            icon={<SportsMmaOutlinedIcon />}
            label={extendedItem.boxer_name || 'Fighter Video'}
            size='small'
            sx={{
              bgcolor: 'rgba(239,175,0,0.12)',
              color: colors.Accent,
              fontWeight: 900,
              maxWidth: '70%',
            }}
          />

          <Typography
            sx={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '0.72rem',
              whiteSpace: 'nowrap',
            }}
          >
            {formatDate(item.created_at)}
          </Typography>
        </Stack>

        <Typography
          component='h2'
          sx={{
            color: '#fff',
            fontSize: '1.18rem',
            fontWeight: 900,
            lineHeight: 1.3,
            mb: 1,
          }}
        >
          {item.title}
        </Typography>

        <Typography
          sx={{
            color: 'rgba(255,255,255,0.62)',
            lineHeight: 1.65,
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.caption || 'No caption provided.'}
        </Typography>

        <Stack spacing={1} sx={{ mb: 2.5, color: 'rgba(255,255,255,0.72)' }}>
          <MetadataRow
            icon={<Groups2OutlinedIcon />}
            text={item.team || 'Professional Team'}
          />
          <MetadataRow
            icon={<MonetizationOnOutlinedIcon />}
            text={`${item.sponsorships || 0} Sponsorships`}
          />
          <MetadataRow
            icon={<PeopleAltOutlinedIcon />}
            text={`${item.sponsors || 0} Sponsors`}
          />
          <MetadataRow
            icon={<CommentOutlinedIcon />}
            text={`${item.comments_count || 0} Comments`}
          />
        </Stack>

        <Button
          fullWidth
          onClick={onOpen}
          variant="outlined"
          sx={{
            mt: 'auto',
            borderColor: 'rgba(255,255,255,0.2)',
            color: '#fff',
            fontWeight: 800,
            borderRadius: 999,
            py: 1,
            '&:hover': {
              borderColor: colors.Accent,
              bgcolor: 'rgba(239,175,0,0.05)',
              color: colors.Accent,
            },
          }}
        >
          View Details & Comments
        </Button>
      </CardContent>
    </Card>
  );
};

const MetadataRow = ({ icon, text }: { icon: ReactNode; text: string }) => (
  <Stack direction='row' spacing={1} alignItems='center'>
    <Box sx={{ color: colors.Accent, display: 'flex', '& svg': { fontSize: 18 } }}>
      {icon}
    </Box>
    <Typography component='span' sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.83rem' }}>
      {text}
    </Typography>
  </Stack>
);