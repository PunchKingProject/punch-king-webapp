import {
  Box,
  Button,
  Link as MLink,
  Skeleton,
  Typography,
} from '@mui/material';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import dayjs from 'dayjs';
import type { TeamPost } from '../api/catalogue.types.ts';
import MediaPreview from "./MediaPreview.tsx";

// UPDATED: Removed hardcoded margin-bottom, made it a flex column so actions stick to the bottom
const postWrapSx = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%', 
};

// UPDATED: Removed maxWidth so the CSS Grid can properly size the items side-by-side
const imageFrameSx = {
  width: '100%',
  border: '1px solid #F0C040', 
  borderRadius: '6px',
  overflow: 'hidden',
  bgcolor: '#111',
};

const labelSx = { fontWeight: 800, fontSize: 13, lineHeight: 1.2 };
const dimSx = { color: '#A2A2A2', fontSize: 13 };

type Props = {
  posts: TeamPost[];
  loading?: boolean;
  onUpload?: () => void;
  onUpdate?: (p: TeamPost) => void;
  onDelete?: (p: TeamPost) => void;
  onViewSponsors?: (p: TeamPost) => void;
};

export default function DesktopMyCatalogueList({
  posts,
  loading,
  onUpload,
  onUpdate,
  onDelete,
  onViewSponsors,
}: Props) {
  return (
    <Box sx={{ mt: 5 }}>
      {/* upload button right */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button
          onClick={onUpload}
          variant='contained'
          sx={{
            bgcolor: '#f0c040',
            color: '#1f1f1f',
            textTransform: 'none',
            fontWeight: 700,
            px: 3,
            borderRadius: '8px',
            '&:hover': { bgcolor: '#ffd465' },
          }}
        >
          Upload Media
        </Button>
      </Box>

      {/* 
        ADDED: CSS Grid wrapper 
        This is what forces the items into a horizontal row and automatically wraps them!
      */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 4, 
          width: '100%'
        }}
      >
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} sx={postWrapSx}>
              <Skeleton variant='rectangular' height={220} sx={imageFrameSx} />
              <Skeleton variant='text' width='40%' sx={{ mt: 2 }} />
              <Skeleton variant='text' width='65%' />
              <Skeleton
                variant='rectangular'
                height={86}
                sx={{ mt: 2, borderRadius: 1 }}
              />
            </Box>
          ))
        ) : (
          posts.map((p) => (
            <Box key={p.id} sx={postWrapSx}>
              
              {/* media */}
              <Box sx={imageFrameSx}>
                <MediaPreview url={p.file_url} />
              </Box>

              {/* body */}
              <Box sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Box>
                  <Typography sx={labelSx}>Caption:</Typography>
                  <Typography sx={{ ...dimSx, mt: 0.5 }}>
                    {p.caption || '—'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 1.25 }}>
                  <Typography sx={labelSx}>Posted:</Typography>
                  <Typography sx={{ color: '#7BEA67', fontSize: 13 }}>
                    {dayjs(p.created_at).format('M/D/YYYY')}
                  </Typography>
                </Box>

                {/* comments */}
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                  >
                    <Typography sx={labelSx}>Comments:</Typography>
                    <ChatBubbleOutlineRoundedIcon fontSize='small' />
                    <Typography sx={{ fontSize: 13 }}>
                      {p.comments_count ?? p.comments?.length ?? 0} Comments
                    </Typography>
                  </Box>

                  <Box sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        maxHeight: 96,
                        overflow: 'auto',
                        pr: 4, 
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 1,
                      }}
                    >
                      {(p.comments ?? []).slice(0, 3).map((c) => (
                        <Box
                          key={c.id}
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: '120px 1fr',
                            gap: 1,
                            p: 1,
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <Typography sx={{ ...dimSx, fontWeight: 600 }}>
                            {c.commenter || '—'}
                          </Typography>
                          <Typography sx={{ fontSize: 13 }}>
                            {c.content}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* decorative up/down chevrons at the right (non-interactive) */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 10,
                        color: '#f0c040',
                      }}
                    >
                      <KeyboardArrowUpRoundedIcon fontSize='small' />
                      <KeyboardArrowDownRoundedIcon fontSize='small' />
                    </Box>
                  </Box>
                </Box>

                {/* spacer to push the action buttons to the bottom of the card perfectly */}
                <Box sx={{ flex: 1 }} />

                {/* sponsors + actions */}
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography sx={labelSx}>Sponsors:</Typography>
                  <PeopleOutlineRoundedIcon fontSize='small' />
                  <Typography sx={{ fontSize: 13 }}>{p.sponsors ?? 0}</Typography>
                  <MLink
                    component='button'
                    underline='hover'
                    onClick={() => onViewSponsors?.(p)}
                    sx={{ color: '#f0c040', fontSize: 13 }}
                  >
                    View
                  </MLink>

                  <Box sx={{ flex: 1 }} />

                  <Button
                    onClick={() => onUpdate?.(p)}
                    variant='contained'
                    sx={{
                      bgcolor: '#f0c040',
                      color: '#000',
                      textTransform: 'none',
                      fontWeight: 700,
                      px: 2,
                      mr: 1,
                      borderRadius: '8px',
                      '&:hover': { bgcolor: '#ffd465' },
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => onDelete?.(p)}
                    variant='outlined'
                    sx={{
                      color: '#fff',
                      borderColor: '#fff',
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: '8px',
                      '&:hover': { borderColor: '#f0c040', color: '#f0c040' },
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}