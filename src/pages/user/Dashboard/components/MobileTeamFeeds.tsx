import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SearchIcon from '@mui/icons-material/Search';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import XIcon from '@mui/icons-material/X';
import {
  Box,
  Button,
  Card,
  CardContent,
  // CardMedia,
  IconButton,
  InputBase,
  Skeleton,
  Typography,
  Dialog,
  DialogContent,
  Stack,
} from '@mui/material';
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

export default function MobileTeamFeeds({ onViewPost, onSponsor }: Props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sharePost, setSharePost] = useState<FeedPost | null>(null);
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useAllPosts(4);

  const posts = useMemo<FeedPost[]>(() => {
    const pages =
      (data as InfiniteData<AllPostsPayload, number> | undefined)?.pages ?? [];
    return pages.flatMap((p) => p.posts);
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
    <Box>
      {/* Search */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          border: '1px solid #3B3B3B',
          borderRadius: 2,
          px: 1.25,
          py: 0.5,
          bgcolor: '#1a1a1a',
          mb: 1.5,
        }}
      >
        <InputBase
          placeholder='Search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ color: '#EDEDED', flex: 1, fontSize: 14 }}
        />
        <IconButton size='small'>
          <SearchIcon fontSize='small' sx={{ color: '#EDEDED' }} />
        </IconButton>
      </Box>

      {/* List */}
      <Box sx={{ display: 'grid', gap: 1.25 }}>
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={`sk-${i}`} sx={cardStyle}>
              <Box sx={{ display: 'flex', p: 1.25, gap: 1.25 }}>
                <Skeleton
                  variant='rectangular'
                  width={88}
                  height={88}
                  sx={{ bgcolor: '#2a2a2a', borderRadius: 2, flex: '0 0 auto' }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Skeleton
                    variant='text'
                    animation='wave'
                    width='70%'
                    sx={{ bgcolor: '#2a2a2a' }}
                  />
                  <Skeleton
                    variant='text'
                    animation='wave'
                    width='90%'
                    sx={{ bgcolor: '#2a2a2a' }}
                  />
                  <Skeleton
                    variant='text'
                    animation='wave'
                    width='40%'
                    sx={{ bgcolor: '#2a2a2a' }}
                  />
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
                  p: 1.25,
                  gap: 1.25,
                  alignItems: 'flex-start',
                  // Stack when space is really tight (mobile-XS)
                  flexDirection: { xs: 'column', 400: 'row' },
                }}
              >
                {/* Thumbnail */}
                <FeedThumbnail
                  url={p.file_url}
                  title={p.title}
                  width={120}
                  height={120}
                />

                {/* Text */}
                <CardContent sx={{ p: 0, flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{ color: '#C9C9C9', fontWeight: 700, fontSize: 12 }}
                  >
                    Team name:{' '}
                    <span style={{ color: '#FFF', fontWeight: 700 }}>
                      {p.team_name}
                    </span>
                  </Typography>

                  <Typography
                    sx={{
                      color: '#C9C9C9',
                      fontWeight: 700,
                      fontSize: 12,
                      mt: 0.25,
                    }}
                  >
                    Position: <span style={{ color: '#FFF' }}>—</span>
                  </Typography>

                  {/* Clamp caption so it doesn't push actions off-screen */}
                  <Typography
                    sx={{
                      color: '#C9C9C9',
                      fontWeight: 700,
                      fontSize: 12,
                      mt: 0.25,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2, // keep it tight on mobile
                      wordBreak: 'break-word',
                    }}
                  >
                    Caption: <span style={{ color: '#FFF' }}>{p.caption}</span>
                  </Typography>

                  {/* meta + actions */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 1.25,
                      rowGap: 0.75,
                      mt: 0.75,
                      flexWrap: 'wrap', // ⬅️ allow wrapping
                    }}
                  >
                    <Typography
                      sx={{ color: '#A2A2A2', fontSize: 11, flexShrink: 0 }}
                    >
                      {dayjs(p.created_at).format('D/M/YYYY')}
                    </Typography>
                    <Typography
                      sx={{ color: '#A2A2A2', fontSize: 11, flexShrink: 0 }}
                    >
                      {p.comments_count} Comments
                    </Typography>

                    {/* spacer shows when room allows */}
                    <Box sx={{ flex: 1, minWidth: 0 }} />

                    <IconButton
                      size='small'
                      sx={{ color: '#EFAF00', flexShrink: 0 }}
                      onClick={() =>
                        onViewPost
                          ? onViewPost(p.id)
                          : navigate(`/user/feeds/${p.id}`)
                      }
                    >
                      <ChatBubbleOutlineIcon fontSize='inherit' />
                    </IconButton>

                    <IconButton
                      size='small'
                      sx={{ color: '#EFAF00', flexShrink: 0 }}
                      onClick={() => setSharePost(p)}
                    >
                      <ShareOutlinedIcon fontSize='inherit' />
                    </IconButton>

                    <Button
                      onClick={() => {
                        onSponsor?.(p.id);
                        navigate(`/user/feeds/${p.id}/sponsorship`, {
                          state: {
                            postId: p.id,
                            teamName: p.team_name,
                            teamPosition: '—',
                            mediaUrl: p.file_url,
                            sponsors: p.sponsors,
                            contributors: p.sponsorships,
                          },
                        });
                      }}
                      variant='text'
                      sx={{
                        color: '#EFAF00',
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 0,
                        minWidth: 0,
                        whiteSpace: 'nowrap', // ⬅️ keep label intact
                        flexShrink: 0, // ⬅️ don't let it collapse
                      }}
                    >
                      Sponsor
                    </Button>

                    <Button
                      onClick={() =>
                        onViewPost
                          ? onViewPost(p.id)
                          : navigate(`/user/feeds/${p.id}`)
                      }
                      variant='text'
                      sx={{
                        color: '#EFAF00',
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 0,
                        minWidth: 0,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          ))}
      </Box>

      {/* Load more */}
      {hasNextPage && (
        <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() =>
              hasNextPage && !isFetchingNextPage && fetchNextPage()
            }
            disabled={!hasNextPage || isFetchingNextPage}
            variant='outlined'
            sx={{
              borderColor: '#EFAF00',
              color: '#EFAF00',
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            {isFetchingNextPage ? 'Loading…' : 'Load more'}
          </Button>
        </Box>
      )}

      {/* ✅ SHARE MODAL */}
      <Dialog open={!!sharePost} onClose={() => setSharePost(null)}>
        <DialogContent sx={{ background: '#1A1A1A' }}>
          <Typography sx={{ color: '#fff', mb: 2, fontWeight: 700 }}>
            Share Post
          </Typography>

          <Stack spacing={1.5}>
            <Button
              startIcon={<ContentCopyIcon />}
              onClick={async () => {
                const url = `${window.location.origin}/user/feeds/${sharePost?.id}`;
                await navigator.clipboard.writeText(url);
                setSharePost(null);
              }}
              sx={{ color: '#EFAF00', justifyContent: 'flex-start' }}
            >
              Copy Link
            </Button>

            <Button
              startIcon={<WhatsAppIcon />}
              onClick={() => {
                const url = `${window.location.origin}/user/feeds/${sharePost?.id}`;
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(url)}`,
                  '_blank',
                );
              }}
              sx={{ color: '#25D366', justifyContent: 'flex-start' }}
            >
              WhatsApp
            </Button>

            <Button
              startIcon={<XIcon />}
              onClick={() => {
                const url = `${window.location.origin}/user/feeds/${sharePost?.id}`;
                window.open(
                  `https://twitter.com/intent/tweet?url=${url}`,
                  '_blank',
                );
              }}
              sx={{ color: '#fff', justifyContent: 'flex-start' }}
            >
              Share on X
            </Button>

            <Button
              onClick={async () => {
                const url = `${window.location.origin}/user/feeds/${sharePost?.id}`;
                if (navigator.share) {
                  await navigator.share({ url });
                }
                setSharePost(null);
              }}
              sx={{ color: '#EFAF00', justifyContent: 'flex-start' }}
            >
              More Options
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
