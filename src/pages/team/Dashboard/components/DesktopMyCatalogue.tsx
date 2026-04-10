import {
  Box,
  Button,
  Skeleton,
  Typography,
  Link as MLink,
} from '@mui/material';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import dayjs from 'dayjs';
import type { TeamPost } from '../api/dashboard.types.ts';

type Props = {
  posts: TeamPost[];
  loading?: boolean;
  onViewPost?: (post: TeamPost) => void;
};

const cardBoxSx = {
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  border: '1px solid #3B3B3B',
  backgroundColor: '#1A1A1A',
  borderRadius: '10px',
  overflow: 'hidden',
};

const labelSx = {
  fontWeight: 800,
  fontSize: 13,
};

const textMutedSx = {
  color: '#A2A2A2',
  fontSize: 13,
};

function isVideo(url: string): boolean {
  return /\.(mp4|mov|webm|ogg|avi)(\?.*)?$/i.test(url);
}

export default function DesktopMyCatalogue({
  posts,
  loading,
  onViewPost,
}: Props) {
  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant='h5' sx={{ fontWeight: 900, color: '#fff' }}>
        MY CATALOGUE
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              variant='rectangular'
              height={360}
              sx={cardBoxSx}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          }}
        >
          {posts.map((p) => (
            <Box key={p.id} sx={cardBoxSx}>
              {/* media */}
              // DesktopMyCatalogue.tsx — only the media box changes

              {/* media */}
              <Box
                sx={{
                  width: '100%',
                  height: 220,          // fixed card height keeps the grid uniform
                  bgcolor: '#111',
                  borderBottom: '1px solid #3B3B3B',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {p.file_url ? (
                  isVideo(p.file_url) ? (
                    <video
                      src={p.file_url}
                      style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }}
                      // no autoplay — user initiates in the detail view
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={p.file_url}
                      alt={p.title || 'post'}
                      style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }}
                    />
                  )
                ) : (
                  <Typography sx={{ color: '#A2A2A2' }}>No media</Typography>
                )}
              </Box>

              {/* body */}
              <Box sx={{ p: 2.5, display: 'grid', gap: 1.25 }}>
                <Box>
                  <Typography sx={labelSx}>Caption:</Typography>
                  <Typography sx={{ ...textMutedSx, mt: 0.5 }}>
                    {p.caption || '—'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography sx={labelSx}>Posted:</Typography>
                    <Typography sx={{ fontSize: 13, mt: 0.5 }}>
                      {dayjs(p.created_at).format('M/D/YYYY')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={labelSx}>Comments:</Typography>
                    <ChatBubbleOutlineRoundedIcon fontSize='small' />
                    <Typography sx={{ fontSize: 13 }}>
                      {p.comments_count ?? 0}
                    </Typography>
                    <MLink
                      component='button'
                      onClick={() => onViewPost?.(p)}
                      underline='hover'
                      sx={{ color: '#f0c040', ml: 1, fontSize: 13 }}
                    >
                      View
                    </MLink>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={labelSx}>Sponsors:</Typography>
                    <PeopleOutlineRoundedIcon fontSize='small' />
                    <Typography sx={{ fontSize: 13 }}>
                      {p.sponsors ?? 0}
                    </Typography>
                    <MLink
                      component='button'
                      onClick={() => onViewPost?.(p)}
                      underline='hover'
                      sx={{ color: '#f0c040', ml: 1, fontSize: 13 }}
                    >
                      View
                    </MLink>
                  </Box>
                </Box>

                <Box sx={{ mt: 0.5 }}>
                  <Button
                    variant='outlined'
                    startIcon={<VisibilityRoundedIcon />}
                    onClick={() => onViewPost?.(p)}
                    sx={{
                      color: '#f0c040',
                      borderColor: '#f0c040',
                      textTransform: 'none',
                      fontWeight: 700,
                      px: 2,
                      '&:hover': { borderColor: '#fff' },
                    }}
                  >
                    View details
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
