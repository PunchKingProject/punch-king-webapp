// src/pages/user/components/DesktopTeamFeeds.tsx
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SearchIcon from '@mui/icons-material/Search';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputBase,
  Skeleton,
  Typography,
  Dialog,
  DialogContent,
  Stack,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import XIcon from '@mui/icons-material/X';
import type { InfiniteData } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AllPostsPayload, FeedPost } from '../api/dashboard.types.ts';
import { useAllPosts } from '../hooks/useAllPosts.ts';
import FeedThumbnail from "./FeedThumbnail.tsx";

type Props = {
  onViewPost?: (id: number) => void;
  onSponsor?: (id: number) => void;
};

const cardStyle = {
  background: '#1A1A1A',
  border: '1px solid #3B3B3B',
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  borderRadius: '12px',
};

export default function DesktopTeamFeeds({ onViewPost, onSponsor }: Props) {
  const navigate = useNavigate();
  const [sharePost, setSharePost] = useState<FeedPost | null>(null);
  const [activeVideo, setActiveVideo] = useState<FeedPost | null>(null);

  const [search, setSearch] = useState('');
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useAllPosts(4);

  const posts = useMemo<FeedPost[]>(() => {
    const pages =
      (data as InfiniteData<AllPostsPayload, number> | undefined)?.pages ?? [];
    const allPosts = pages.flatMap((p) => p.posts);

    return allPosts.filter((p) => {
      if (!p.file_url) return false; 
      const url = p.file_url.toLowerCase();
      return url.includes('.mp4') || url.includes('.mov') || url.includes('.webm') || url.includes('.ogg');
    });
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.team_name.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.caption.toLowerCase().includes(q)
    );
  }, [posts, search]);

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant='h5' sx={{ color: '#fff', fontWeight: 900, mb: 2 }}>
        TEAM FEEDS
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          border: '1px solid #3B3B3B',
          borderRadius: 2,
          px: 1.5,
          py: 0.5,
          bgcolor: '#1a1a1a',
          mb: 2,
          maxWidth: 360,
        }}
      >
        <InputBase
          placeholder='Search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ color: '#EDEDED', flex: 1 }}
        />
        <IconButton size='small'>
          <SearchIcon fontSize='small' sx={{ color: '#EDEDED' }} />
        </IconButton>
      </Box>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={`sk-${i}`} sx={cardStyle}>
              <Box sx={{ display: 'flex', p: 2, gap: 2 }}>
                <Skeleton variant='rectangular' width={220} height={220} sx={{ bgcolor: '#2a2a2a', borderRadius: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant='text' width='60%' sx={{ bgcolor: '#2a2a2a' }} />
                  <Skeleton variant='text' width='40%' sx={{ bgcolor: '#2a2a2a' }} />
                  <Skeleton variant='text' width='90%' sx={{ bgcolor: '#2a2a2a' }} />
                </Box>
              </Box>
            </Card>
          ))}

        {!isLoading &&
          filtered.map((p) => (
            <Card key={p.id} sx={cardStyle}>
              <Box
                sx={{
                  display: 'flex',
                  p: 2,
                  gap: 2,
                  alignItems: { xs: 'flex-start', sm: 'stretch' },
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                {/* BULLETPROOF CLICKABLE THUMBNAIL WITH PLAY BUTTON */}
                <Box 
                  onClickCapture={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveVideo(p);
                  }} 
                  sx={{ 
                    cursor: 'pointer', 
                    position: 'relative',
                    display: 'block',
                    '&:hover .play-icon': { opacity: 1, transform: 'translate(-50%, -50%) scale(1.1)' } 
                  }}
                >
                  <FeedThumbnail
                    url={p.file_url}
                    title={p.title}
                    width={220}  
                    height={220} 
                  />
                  <PlayCircleOutlineIcon 
                    className="play-icon"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) scale(1)',
                      color: '#EFAF00',
                      fontSize: 64,
                      opacity: 0.8,
                      transition: 'all 0.2s ease-in-out',
                      pointerEvents: 'none' // Ensures the Box registers the click, not the icon
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography sx={{ color: '#C9C9C9', fontWeight: 700 }}>
                    Team name: <span style={{ color: '#FFF', fontWeight: 700 }}>{p.team_name}</span>
                  </Typography>

                  <Typography sx={{ color: '#C9C9C9', fontWeight: 700, mt: 0.5 }}>
                    Position: <span style={{ color: '#FFF' }}>—</span>
                  </Typography>

                  <Typography
                    sx={{
                      color: '#C9C9C9',
                      fontWeight: 700,
                      mt: 0.5,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: { xs: 2, md: 3 },
                    }}
                  >
                    Caption: <span style={{ color: '#FFF' }}>{p.caption?.length > 120 ? `${p.caption.slice(0, 120)}…` : p.caption}</span>
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 1.25, flexWrap: 'wrap', rowGap: 1 }}>
                    <Typography sx={{ color: '#A2A2A2', fontSize: 12 }}>
                      {dayjs(p.created_at).format('M/D/YYYY')}
                    </Typography>
                    <Typography sx={{ color: '#A2A2A2', fontSize: 12 }}>
                      {p.comments_count} Comments
                    </Typography>

                    <Box sx={{ flex: 1 }} />

                    <IconButton size='small' sx={{ color: '#EFAF00' }} onClick={() => onViewPost ? onViewPost(p.id) : navigate(`/user/feeds/${p.id}`)}>
                      <ChatBubbleOutlineIcon fontSize='small' />
                    </IconButton>

                    <IconButton size='small' sx={{ color: '#EFAF00' }} onClick={() => setSharePost(p)}>
                      <ShareOutlinedIcon fontSize='small' />
                    </IconButton>

                    <Button
                      onClick={() => {
                        onSponsor?.(p.id);
                        navigate(`/user/feeds/${p.id}/`);
                      }}
                      variant='text'
                      sx={{ color: '#EFAF00', textTransform: 'none', fontWeight: 700, px: 0, minWidth: 0, flexShrink: 0 }}
                    >
                      Sponsor
                    </Button>
                    <Button
                      onClick={() => onViewPost ? onViewPost(p.id) : navigate(`/user/feeds/${p.id}`)}
                      variant='text'
                      sx={{ color: '#EFAF00', textTransform: 'none', fontWeight: 700, px: 0, minWidth: 0 }}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          ))}
      </Box>

      {hasNextPage && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            variant='outlined'
            sx={{ borderColor: '#EFAF00', color: '#EFAF00', textTransform: 'none', fontWeight: 700 }}
          >
            {isFetchingNextPage ? 'Loading…' : 'Load more'}
          </Button>
        </Box>
      )}

      {/* SHARE MODAL */}
      <Dialog open={!!sharePost} onClose={() => setSharePost(null)}>
        <DialogContent sx={{ background: '#1A1A1A' }}>
          <Typography sx={{ color: '#fff', mb: 2, fontWeight: 700 }}>Share Post</Typography>
          <Stack spacing={1.5}>
            <Button startIcon={<ContentCopyIcon />} onClick={async () => { await navigator.clipboard.writeText(`${window.location.origin}/user/feeds/${sharePost?.id}`); setSharePost(null); }} sx={{ color: '#EFAF00', justifyContent: 'flex-start' }}>Copy Link</Button>
            <Button startIcon={<WhatsAppIcon />} onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${window.location.origin}/user/feeds/${sharePost?.id}`)}`, '_blank')} sx={{ color: '#25D366', justifyContent: 'flex-start' }}>WhatsApp</Button>
            <Button startIcon={<XIcon />} onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.origin}/user/feeds/${sharePost?.id}`, '_blank')} sx={{ color: '#fff', justifyContent: 'flex-start' }}>Share on X</Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* VIDEO PLAYER MODAL */}
      <Dialog 
        open={!!activeVideo} 
        onClose={() => setActiveVideo(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: '#000',
            border: '1px solid #3B3B3B',
            borderRadius: '12px',
            overflow: 'hidden',
          }
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IconButton
            onClick={() => setActiveVideo(null)}
            sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
          >
            <CloseIcon />
          </IconButton>
          
          {activeVideo?.file_url && (
            <video
              src={activeVideo.file_url}
              controls
              autoPlay
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', outline: 'none', backgroundColor: '#000' }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
}