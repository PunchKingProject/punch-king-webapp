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
  useMediaQuery 
} from "@mui/material";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { colors } from "../../../../../../theme/colors.ts";
import type { TeamPost } from "../../../api/teams.types.ts";
import { useTeamPosts } from "../../../hooks/useTeamPosts.tsx";
import MobilePostModal from "./MobilePostModal.tsx";

// IMPORTANT: Ensure this path correctly points to your PostMedia component
import PostMedia from "../../../../../../components/media/PostMedia.tsx";

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

function MobileTeamPostCarousel({ teamId, title = 'TEAM CATALOGUE' }: Props) {
  const { data, isLoading } = useTeamPosts(teamId);
  const items = data ?? [];
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<TeamPost | null>(null);
  const isSm = useMediaQuery('(max-width:600px)');

  const cardWidth = isSm ? 280 : 320;
  const gap = 24;

  const [showLeft, showRight] = useMemo(() => {
    const el = scrollerRef.current;
    if (!el) return [false, false];
    const canLeft = el.scrollLeft > 0;
    const canRight = el.scrollWidth - el.clientWidth - el.scrollLeft > 4;
    return [canLeft, canRight];
  }, []); 

  const updateArrows = () => {
    // This function can trigger a state update if you decide to make 
    // arrows dynamically appear/disappear on scroll for mobile
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
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 3 }}>
      <Typography variant='h6' sx={{ color: '#fff', fontWeight: 900, mb: 2 }}>
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
            gap: 3,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            pb: 2, // padding for card shadows
          }}
        >
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant='rectangular'
                  sx={{ 
                    minWidth: cardWidth, 
                    height: 420, 
                    bgcolor: '#111', 
                    borderRadius: 4 
                  }}
                />
              ))
            : items.map((it) => (
                <Box key={it.id} sx={{ scrollSnapAlign: 'start' }}>
                  <AdminPremiumMobilePostCard
                    item={it}
                    onOpen={() => setSelected(it)}
                  />
                </Box>
              ))}
        </Box>
      </Box>

      {/* Mobile modal */}
      <MobilePostModal
        open={!!selected}
        onClose={() => setSelected(null)}
        media={
          selected ? (
            <PostMedia
              src={selected.file_url}
              alt={selected.title}
              title={selected.title}
              height={280}
              maxHeight={280}
              objectFit='cover'
              borderRadius={0}
              controls={true}
            />
          ) : null
        }
        body={
          selected && (
            <Box sx={{ color: '#fff', mt: 2 }}>
              <Typography sx={{ color: colors.Accent, fontWeight: 700 }}>
                Title:
              </Typography>
              <Typography sx={{ mb: 2, fontWeight: 600 }}>{selected.title}</Typography>

              <Typography sx={{ color: colors.Accent, fontWeight: 700 }}>
                Caption:
              </Typography>
              <Typography sx={{ mb: 2, color: 'rgba(255,255,255,0.75)' }}>
                {selected.caption || 'No caption provided.'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 4, mt: 3 }}>
                <Box>
                  <Typography variant='headerBold' component='p'>
                    {selected.sponsorships || 0}
                  </Typography>
                  <Typography variant='bodyTextMilkDefault' sx={{ color: colors.Accent }}>
                    Sponsorships
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='headerBold' component='p'>
                    {selected.sponsors || 0}
                  </Typography>
                  <Typography variant='bodyTextMilkDefault' sx={{ color: colors.Accent }}>
                    Sponsors
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='headerBold' component='p'>
                    {selected.comments_count || 0}
                  </Typography>
                  <Typography variant='bodyTextMilkDefault' sx={{ color: colors.Accent }}>
                    Comments
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

/* 
|--------------------------------------------------------------------------
| Premium Mobile Admin Post Card
|--------------------------------------------------------------------------
*/

const AdminPremiumMobilePostCard = ({
  item,
  onOpen,
}: {
  item: TeamPost;
  onOpen: () => void;
}) => {
  const extendedItem = item as any;

  return (
    <Card
      sx={{
        bgcolor: '#111',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 4,
        overflow: 'hidden',
        minWidth: { xs: 280, sm: 320 },
        width: { xs: 280, sm: 320 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <PostMedia
          src={item.file_url}
          alt={extendedItem.boxer_name || item.title}
          title={item.title}
          height={190}
          maxHeight={190}
          objectFit='cover'
          borderRadius={0}
          controls={true}
        />
      </Box>

      <CardContent
        sx={{
          p: 2,
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
              maxWidth: '65%',
              '& .MuiChip-label': { fontSize: '0.75rem' }
            }}
          />

          <Typography
            sx={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '0.7rem',
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
            fontSize: '1.1rem',
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
            fontSize: '0.85rem',
            lineHeight: 1.6,
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
            py: 0.8,
            fontSize: '0.85rem',
            '&:hover': {
              borderColor: colors.Accent,
              bgcolor: 'rgba(239,175,0,0.05)',
              color: colors.Accent,
            },
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

const MetadataRow = ({ icon, text }: { icon: ReactNode; text: string }) => (
  <Stack direction='row' spacing={1} alignItems='center'>
    <Box sx={{ color: colors.Accent, display: 'flex', '& svg': { fontSize: 16 } }}>
      {icon}
    </Box>
    <Typography component='span' sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.8rem' }}>
      {text}
    </Typography>
  </Stack>
);

export default MobileTeamPostCarousel;