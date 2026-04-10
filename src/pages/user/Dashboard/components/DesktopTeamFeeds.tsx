// src/pages/user/components/DesktopTeamFeeds.tsx
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SearchIcon from '@mui/icons-material/Search';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
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

export default function DesktopTeamFeeds({ onViewPost, onSponsor }: Props) {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
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
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant='h5' sx={{ color: '#fff', fontWeight: 900, mb: 2 }}>
        TEAM FEEDS
      </Typography>

      {/* Search */}
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

      {/* List */}
      <Box sx={{ display: 'grid', gap: 2 }}>
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={`sk-${i}`} sx={cardStyle}>
              <Box sx={{ display: 'flex', p: 2, gap: 2 }}>
                <Skeleton
                  variant='rectangular'
                  width={120}
                  height={120}
                  sx={{ bgcolor: '#2a2a2a', borderRadius: 2 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant='text'
                    animation='wave'
                    width='60%'
                    sx={{ bgcolor: '#2a2a2a' }}
                  />
                  <Skeleton
                    variant='text'
                    animation='wave'
                    width='40%'
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
                    width='70%'
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
                  p: 2,
                  gap: 2,
                  alignItems: { xs: 'flex-start', sm: 'stretch' },
                  flexDirection: { xs: 'column', sm: 'row' }, // ⬅️ stack on small
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
                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography sx={{ color: '#C9C9C9', fontWeight: 700 }}>
                    Team name:{' '}
                    <span style={{ color: '#FFF', fontWeight: 700 }}>
                      {p.team_name}
                    </span>
                  </Typography>

                  {/* Position isn’t in feed; omit or show em dash */}
                  <Typography
                    sx={{ color: '#C9C9C9', fontWeight: 700, mt: 0.5 }}
                  >
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
                      WebkitLineClamp: { xs: 2, md: 3 }, // ⬅️ wrap at small
                    }}
                  >
                    Caption:{' '}
                    <span style={{ color: '#FFF' }}>
                      {p.caption?.length > 120
                        ? `${p.caption.slice(0, 120)}…`
                        : p.caption}
                    </span>
                  </Typography>

                  {/* footer meta */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      mt: 1.25,
                      flexWrap: 'wrap', // ⬅️ allow wrapping
                      rowGap: 1,
                    }}
                  >
                    <Typography sx={{ color: '#A2A2A2', fontSize: 12 }}>
                      {dayjs(p.created_at).format('M/D/YYYY')}
                    </Typography>
                    <Typography sx={{ color: '#A2A2A2', fontSize: 12 }}>
                      {p.comments_count} Comments
                    </Typography>

                    <Box sx={{ flex: 1 }} />

                    {/* action icons */}
                    <Box
                      onClick={() =>
                        onViewPost
                          ? onViewPost(p.id)
                          : navigate(`/user/feeds/${p.id}`)
                      }
                    >
                      <IconButton size='small' sx={{ color: '#EFAF00' }}>
                        <ChatBubbleOutlineIcon fontSize='small' />
                      </IconButton>
                    </Box>

                    <IconButton size='small' sx={{ color: '#EFAF00' }}>
                      <ShareOutlinedIcon fontSize='small' />
                    </IconButton>

                    <Button
                      onClick={() => {
                        // optional side-effect for parent
                        onSponsor?.(p.id);

                        // always navigate with the state Sponsorship page expects
                        navigate(`/user/feeds/${p.id}/`);
                      }}
                      variant='text'
                      sx={{
                        color: '#EFAF00',
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 0,
                        minWidth: 0,
                        whiteSpace: 'nowrap', // ⬅️ don't break label
                        flexShrink: 0, // ⬅️ keep visible
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

      {/* Load more (cursor) */}
      {hasNextPage && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
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
    </Box>
  );
}
