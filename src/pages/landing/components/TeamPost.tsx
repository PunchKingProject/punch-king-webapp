import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import { useNavigate } from 'react-router-dom';
import { teamPostImage1 } from '../../../assets';
import { colors } from '../../../theme/colors.ts';
import ROUTES from '../../../routes/routePath.ts';
import { useAllPosts } from '../../user/Dashboard/hooks/useAllPosts';
import type {
  AllPostsPayload,
  FeedPost,
} from '../../user/Dashboard/api/dashboard.types';
import type { InfiniteData } from '@tanstack/react-query';

type Post = FeedPost;

const TeamPost = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useAllPosts(9);

  const infiniteData = data as unknown as
    | InfiniteData<AllPostsPayload>
    | undefined;

  const posts: Post[] = infiniteData?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <Box
      id='posts'
      sx={{
        width: '100%',
        py: { xs: 7, md: 10 },
        background:
          'linear-gradient(180deg, #000000 0%, #0B0B0B 45%, #000000 100%)',
      }}
    >
      <Container maxWidth='xl'>
        <Box textAlign='center' mb={{ xs: 5, md: 7 }}>
          <Typography
            component='p'
            sx={{
              color: colors.Accent,
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontSize: '0.78rem',
              mb: 1.5,
            }}
          >
            Public Catalogue
          </Typography>

          <Typography
            component='h1'
            sx={{
              fontSize: { xs: '2rem', sm: '2.7rem', md: '3.4rem' },
              fontWeight: 950,
              color: 'white',
              lineHeight: 1.05,
            }}
          >
            TEAM{' '}
            <Box component='span' sx={{ color: colors.Accent }}>
              POSTS
            </Box>
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255,255,255,0.68)',
              maxWidth: 760,
              mx: 'auto',
              mt: 2,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              lineHeight: 1.7,
            }}
          >
            Explore media updates, stories, and sponsorship-ready posts from
            registered African professional boxing teams.
          </Typography>
        </Box>

        {isLoading && <CatalogueSkeleton />}

        {isError && (
          <Typography color='white' textAlign='center'>
            Failed to load team catalogue posts.
          </Typography>
        )}

        {!isLoading && !isError && !posts.length && (
          <Typography color='white' textAlign='center'>
            No catalogue posts available yet.
          </Typography>
        )}

        {!isLoading && !isError && posts.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
              alignItems: 'stretch',
            }}
          >
            {posts.slice(0, 9).map((post) => {
              const image = post.file_url || teamPostImage1;

              return (
                <Card
                  key={post.id}
                  sx={{
                    height: '100%',
                    bgcolor: '#111',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 18px 45px rgba(0,0,0,0.45)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: '0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: 'rgba(239,175,0,0.55)',
                      boxShadow: '0 22px 55px rgba(239,175,0,0.12)',
                    },
                  }}
                >
                  <CardMedia
                    component='img'
                    height='245'
                    image={image}
                    alt={post.title || 'Team catalogue post'}
                    sx={{
                      objectFit: 'cover',
                      bgcolor: '#222',
                    }}
                    onError={(e) => {
                      e.currentTarget.src = teamPostImage1;
                    }}
                  />

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
                        label={post.team || 'Boxing Team'}
                        size='small'
                        sx={{
                          bgcolor: 'rgba(239,175,0,0.12)',
                          color: colors.Accent,
                          fontWeight: 800,
                          maxWidth: '70%',
                        }}
                      />

                      <Typography
                        sx={{
                          color: 'rgba(255,255,255,0.45)',
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {post.created_at
                          ? new Date(post.created_at).toLocaleDateString()
                          : ''}
                      </Typography>
                    </Stack>

                    <Typography
                      sx={{
                        color: 'white',
                        fontWeight: 850,
                        fontSize: '1.15rem',
                        lineHeight: 1.25,
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: 58,
                      }}
                    >
                      {post.title || 'Team Catalogue Update'}
                    </Typography>

                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,0.62)',
                        fontSize: '0.92rem',
                        lineHeight: 1.6,
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: 70,
                      }}
                    >
                      {post.caption || 'No caption provided for this post.'}
                    </Typography>

                    <Stack
                      direction='row'
                      spacing={1}
                      flexWrap='wrap'
                      useFlexGap
                      mb={2.2}
                    >
                      <MiniStat
                        icon={<ChatBubbleOutlineIcon />}
                        label={`${post.comments_count ?? 0} comments`}
                      />
                      <MiniStat
                        icon={<VolunteerActivismOutlinedIcon />}
                        label={`${post.sponsorships ?? 0} sponsorships`}
                      />
                      <MiniStat
                        icon={<Groups2OutlinedIcon />}
                        label={`${post.sponsors ?? 0} sponsors`}
                      />
                    </Stack>

                    <Box sx={{ mt: 'auto' }}>
                      <Button
                        fullWidth
                        variant='contained'
                        onClick={() =>
                          navigate(
                            `${ROUTES.SIGN_IN}?redirect=/user/feeds/${post.id}`
                          )
                        }
                        sx={{
                          bgcolor: colors.Accent,
                          color: '#000',
                          fontWeight: 900,
                          borderRadius: 999,
                          py: 1.1,
                          '&:hover': {
                            bgcolor: '#FFC533',
                          },
                        }}
                      >
                        View Catalogue Post
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
};

const MiniStat = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <Stack
    direction='row'
    alignItems='center'
    spacing={0.6}
    sx={{
      color: 'rgba(255,255,255,0.68)',
      bgcolor: 'rgba(255,255,255,0.055)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 999,
      px: 1.1,
      py: 0.65,
      fontSize: '0.75rem',
      '& svg': {
        fontSize: 15,
        color: colors.Accent,
      },
    }}
  >
    {icon}
    <Box component='span'>{label}</Box>
  </Stack>
);

const CatalogueSkeleton = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      },
      gap: 3,
    }}
  >
    {Array.from({ length: 6 }).map((_, index) => (
<<<<<<< HEAD
      <Card
        key={index}
        sx={{ bgcolor: '#111', borderRadius: 4, overflow: 'hidden' }}
      >
=======
      <Card key={index} sx={{ bgcolor: '#111', borderRadius: 4, overflow: 'hidden' }}>
>>>>>>> feature/weight-class-catalogue
        <Skeleton variant='rectangular' height={245} />
        <CardContent>
          <Skeleton width='45%' />
          <Skeleton width='90%' height={34} />
          <Skeleton width='100%' />
          <Skeleton width='80%' />
        </CardContent>
      </Card>
    ))}
  </Box>
);

export default TeamPost;