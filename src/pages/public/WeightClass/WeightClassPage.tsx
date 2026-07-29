import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ScaleOutlinedIcon from '@mui/icons-material/ScaleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SportsMmaOutlinedIcon from '@mui/icons-material/SportsMmaOutlined';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import {
  type FormEvent,
  type ReactNode,
  useMemo,
  useState,
} from 'react';

import {
  Navigate,
  useNavigate,
  useParams,
} from 'react-router-dom';

import PostMedia from '../../../components/media/PostMedia.tsx';
import Navbar from '../../../components/nav/Navbar.tsx';
import { colors } from '../../../theme/colors.ts';
import Footer from '../../landing/components/Footer.tsx';

import type {
  TeamPost,
  WeightClass,
} from '../../team/Catalogue/api/catalogue.types.ts';

import { useWeightClassPosts } from './hooks/useWeightClassPosts.ts';

type DivisionDetails = {
  slug: WeightClass;
  title: string;
  shortTitle: string;
  kilograms: string;
  pounds: string;
  description: string;
};

const divisions: Record<WeightClass, DivisionDetails> = {
  lightweight: {
    slug: 'lightweight',
    title: 'Professional Lightweight Division',
    shortTitle: 'Lightweight',
    kilograms: 'Up to 61.23kg',
    pounds: '135lbs',
    description:
      'Explore lightweight sparring videos uploaded by registered professional boxing teams across Africa.',
  },

  welterweight: {
    slug: 'welterweight',
    title: 'Professional Welterweight Division',
    shortTitle: 'Welterweight',
    kilograms: 'Up to 66.68kg',
    pounds: '147lbs',
    description:
      'Discover African welterweight fighters, their team information and sponsor-ready sparring videos.',
  },

  middleweight: {
    slug: 'middleweight',
    title: 'Professional Middleweight Division',
    shortTitle: 'Middleweight',
    kilograms: 'Up to 72.57kg',
    pounds: '160lbs',
    description:
      'View middleweight fighters and sparring videos submitted by registered teams throughout Africa.',
  },
};

function isValidWeightClass(
  value: string | undefined
): value is WeightClass {
  return (
    value === 'lightweight' ||
    value === 'welterweight' ||
    value === 'middleweight'
  );
}

function formatDate(value?: string): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const WeightClassPage = () => {
  const navigate = useNavigate();

  const { division } = useParams<{
    division: string;
  }>();

  const [search, setSearch] = useState('');
  const [submittedSearch, setSubmittedSearch] =
    useState('');

  if (!isValidWeightClass(division)) {
    return <Navigate to='/' replace />;
  }

  const selectedDivision = divisions[division];

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useWeightClassPosts(
    division,
    submittedSearch
  );

  const posts = useMemo(
    () =>
      data?.pages.flatMap(
        (page) => page.posts ?? []
      ) ?? [],
    [data]
  );

  const handleSearch = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSubmittedSearch(search.trim());
  };

  const clearSearch = () => {
    setSearch('');
    setSubmittedSearch('');
  };

  return (
    <>
      <Navbar />

      <Box
        component='main'
        sx={{
          minHeight: '100vh',
          bgcolor: '#000',
          color: '#fff',
          py: {
            xs: 6,
            md: 9,
          },
          background:
            'radial-gradient(circle at top right, rgba(239,175,0,0.10), transparent 32%), #000',
        }}
      >
        <Container maxWidth='xl'>
          <Button
            startIcon={
              <ArrowBackIosNewIcon />
            }
            onClick={() => navigate('/')}
            sx={{
              color: colors.Accent,
              fontWeight: 800,
              textTransform: 'none',
              mb: 4,
            }}
          >
            Back to homepage
          </Button>

          <Box
            sx={{
              maxWidth: 900,
              mb: {
                xs: 5,
                md: 7,
              },
            }}
          >
            <Typography
              sx={{
                color: colors.Accent,
                fontWeight: 900,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontSize: '0.78rem',
                mb: 1.5,
              }}
            >
              Punch King Professional Divisions
            </Typography>

            <Typography
              component='h1'
              sx={{
                fontSize: {
                  xs: '2.4rem',
                  sm: '3.2rem',
                  md: '4.6rem',
                },
                fontWeight: 950,
                lineHeight: 1,
                mb: 2,
              }}
            >
              {selectedDivision.shortTitle}{' '}

              <Box
                component='span'
                sx={{
                  color: colors.Accent,
                }}
              >
                Division
              </Box>
            </Typography>

            <Stack
              direction='row'
              spacing={1}
              useFlexGap
              flexWrap='wrap'
              mb={2.5}
            >
              <Chip
                label={
                  selectedDivision.kilograms
                }
                sx={{
                  bgcolor:
                    'rgba(239,175,0,0.14)',
                  color: colors.Accent,
                  fontWeight: 900,
                }}
              />

              <Chip
                label={
                  selectedDivision.pounds
                }
                sx={{
                  bgcolor:
                    'rgba(255,255,255,0.07)',
                  color: '#fff',
                  fontWeight: 800,
                }}
              />

              <Chip
                label={`${posts.length} post${
                  posts.length === 1 ? '' : 's'
                } loaded`}
                sx={{
                  bgcolor:
                    'rgba(255,255,255,0.07)',
                  color:
                    'rgba(255,255,255,0.72)',
                  fontWeight: 800,
                }}
              />
            </Stack>

            <Typography
              sx={{
                color:
                  'rgba(255,255,255,0.7)',
                lineHeight: 1.8,
                fontSize: {
                  xs: '0.98rem',
                  md: '1.08rem',
                },
                maxWidth: 760,
              }}
            >
              {selectedDivision.description}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
              mb: 6,
            }}
          >
            <InformationCard
              icon={
                <SportsMmaOutlinedIcon />
              }
              title='Registered Fighters'
              text='Boxers uploaded by registered teams are organised under their selected professional weight divisions.'
            />

            <InformationCard
              icon={
                <FitnessCenterOutlinedIcon />
              }
              title='Fighter Information'
              text='Each entry includes boxer weight, clothing details, opponent information and sparring location.'
            />

            <InformationCard
              icon={
                <PlayCircleOutlineIcon />
              }
              title='Sparring Videos'
              text='Sponsors can review uploaded sparring videos before supporting a boxer or professional team.'
            />
          </Box>

          <Box
            component='form'
            onSubmit={handleSearch}
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              gap: 1.5,
              maxWidth: 760,
              mb: 5,
            }}
          >
            <TextField
              fullWidth
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder='Search by boxer, title or location'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon
                      sx={{
                        color:
                          'rgba(255,255,255,0.5)',
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root':
                  {
                    bgcolor: '#111',
                    color: '#fff',

                    '& fieldset': {
                      borderColor:
                        'rgba(255,255,255,0.15)',
                    },

                    '&:hover fieldset': {
                      borderColor:
                        'rgba(239,175,0,0.5)',
                    },

                    '&.Mui-focused fieldset':
                      {
                        borderColor:
                          colors.Accent,
                      },
                  },
              }}
            />

            <Button
              type='submit'
              variant='contained'
              sx={{
                bgcolor: colors.Accent,
                color: '#000',
                fontWeight: 900,
                px: 4,
                minWidth: 130,
                '&:hover': {
                  bgcolor: '#FFC533',
                },
              }}
            >
              Search
            </Button>

            {submittedSearch && (
              <Button
                type='button'
                variant='outlined'
                onClick={clearSearch}
                sx={{
                  borderColor:
                    'rgba(255,255,255,0.35)',
                  color: '#fff',
                  fontWeight: 800,
                  px: 3,
                }}
              >
                Clear
              </Button>
            )}
          </Box>

          {isLoading && (
            <Box
              sx={{
                minHeight: 320,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Stack
                spacing={2}
                alignItems='center'
              >
                <CircularProgress
                  sx={{
                    color: colors.Accent,
                  }}
                />

                <Typography
                  sx={{
                    color:
                      'rgba(255,255,255,0.6)',
                  }}
                >
                  Loading fighter posts...
                </Typography>
              </Stack>
            </Box>
          )}

          {isError && (
            <Alert
              severity='error'
              sx={{
                mb: 4,
              }}
            >
              {error instanceof Error
                ? error.message
                : 'Failed to load fighter posts.'}
            </Alert>
          )}

          {!isLoading &&
            !isError &&
            posts.length === 0 && (
              <EmptyDivision
                division={
                  selectedDivision
                }
                isSearching={
                  Boolean(submittedSearch)
                }
                onRegister={() =>
                  navigate(
                    '/sign-up?flow=team'
                  )
                }
                onClear={clearSearch}
              />
            )}

          {!isLoading &&
            !isError &&
            posts.length > 0 && (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)',
                    },
                    gap: 3,
                  }}
                >
                  {posts.map((post) => (
                    <FighterPostCard
                      key={post.id}
                      post={post}
                      categoryName={selectedDivision.shortTitle} // Passing category down to the card
                      onView={() =>
                        navigate(
                          `/sign-in?redirect=/user/feeds/${post.id}`
                        )
                      }
                    />
                  ))}
                </Box>

                {hasNextPage && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 6,
                    }}
                  >
                    <Button
                      variant='outlined'
                      disabled={
                        isFetchingNextPage
                      }
                      onClick={() => {
                        void fetchNextPage();
                      }}
                      sx={{
                        borderColor:
                          colors.Accent,
                        color: colors.Accent,
                        fontWeight: 900,
                        borderRadius: 999,
                        px: 5,
                        py: 1.2,
                      }}
                    >
                      {isFetchingNextPage
                        ? 'Loading...'
                        : 'Load More Fighters'}
                    </Button>
                  </Box>
                )}
              </>
            )}
        </Container>
      </Box>

      <Footer />
    </>
  );
};

const FighterPostCard = ({
  post,
  categoryName,
  onView,
}: {
  post: TeamPost;
  categoryName?: string;
  onView: () => void;
}) => {
  const teamName =
    post.team_name ||
    post.team ||
    'Professional Boxing Team';

  return (
    <Card
      sx={{
        bgcolor: '#111',
        border:
          '1px solid rgba(255,255,255,0.08)',
        borderRadius: 4,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow:
          '0 18px 45px rgba(0,0,0,0.4)',
        transition:
          'transform 0.25s ease, border-color 0.25s ease',

        '&:hover': {
          transform: 'translateY(-6px)',
          borderColor:
            'rgba(239,175,0,0.5)',
        },
      }}
    >
      <Box
        onClick={onView}
        sx={{
          cursor: 'pointer',
          position: 'relative',
          '&:hover .play-icon': {
            color: colors.Accent,
            transform: 'translate(-50%, -50%) scale(1.15)',
          },
        }}
      >
        <Box sx={{ pointerEvents: 'none' }}> 
          <PostMedia
            src={post.file_url}
            alt={
              post.boxer_name || post.title
            }
            title={post.title}
            height={245}
            maxHeight={245}
            objectFit='cover'
            borderRadius={0}
          />
        </Box>
        
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.35)', 
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <PlayCircleOutlineIcon
            className="play-icon"
            sx={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 68,
              transition: 'all 0.2s ease-in-out',
            }}
          />
        </Box>
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
            icon={
              <SportsMmaOutlinedIcon />
            }
            label={
              post.boxer_name ||
              'Unnamed fighter'
            }
            size='small'
            sx={{
              bgcolor:
                'rgba(239,175,0,0.12)',
              color: colors.Accent,
              fontWeight: 900,
              maxWidth: '75%',
            }}
          />

          <Typography
            sx={{
              color:
                'rgba(255,255,255,0.45)',
              fontSize: '0.72rem',
              whiteSpace: 'nowrap',
            }}
          >
            {formatDate(post.created_at)}
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
          {post.title}
        </Typography>

        <Typography
          sx={{
            color:
              'rgba(255,255,255,0.62)',
            lineHeight: 1.65,
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.caption}
        </Typography>

        <Stack
          spacing={1}
          sx={{
            mb: 2.5,
            color:
              'rgba(255,255,255,0.72)',
          }}
        >
          <MetadataRow
            icon={
              <Groups2OutlinedIcon />
            }
            text={teamName}
          />

          <MetadataRow
            icon={
              <ScaleOutlinedIcon />
            }
            text={
              post.boxer_weight_kg
                ? `${post.boxer_weight_kg}kg`
                : 'Weight not provided'
            }
          />

          <MetadataRow
            icon={
              <LocationOnOutlinedIcon />
            }
            text={
              post.sparring_location ||
              'Location not provided'
            }
          />
        </Stack>

        <Stack
          direction='row'
          spacing={1}
          useFlexGap
          flexWrap='wrap'
          sx={{
            mb: 2.5,
          }}
        >
          {/* NEW: Category Highlight Chip placed securely in the bottom stack */}
          {categoryName && (
            <Chip
              size='small'
              label={categoryName.toUpperCase()}
              sx={{
                bgcolor: 'rgba(239,175,0,0.15)',
                color: colors.Accent,
                fontWeight: 900,
                letterSpacing: '0.05em',
              }}
            />
          )}

          {post.shorts_color && (
            <Chip
              size='small'
              label={`Shorts: ${post.shorts_color}`}
              sx={{
                bgcolor:
                  'rgba(255,255,255,0.06)',
                color:
                  'rgba(255,255,255,0.75)',
              }}
            />
          )}

          {post.glove_color && (
            <Chip
              size='small'
              label={`Gloves: ${post.glove_color}`}
              sx={{
                bgcolor:
                  'rgba(255,255,255,0.06)',
                color:
                  'rgba(255,255,255,0.75)',
              }}
            />
          )}
        </Stack>

        <Button
          fullWidth
          onClick={onView}
          sx={{
            mt: 'auto',
            bgcolor: colors.Accent,
            color: '#000',
            fontWeight: 900,
            borderRadius: 999,
            py: 1.05,

            '&:hover': {
              bgcolor: '#FFC533',
            },
          }}
        >
          View Fighter Post
        </Button>
      </CardContent>
    </Card>
  );
};

const MetadataRow = ({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) => (
  <Stack
    direction='row'
    spacing={1}
    alignItems='center'
  >
    <Box
      sx={{
        color: colors.Accent,
        display: 'flex',

        '& svg': {
          fontSize: 18,
        },
      }}
    >
      {icon}
    </Box>

    <Typography
      component='span'
      sx={{
        color:
          'rgba(255,255,255,0.72)',
        fontSize: '0.83rem',
      }}
    >
      {text}
    </Typography>
  </Stack>
);

const EmptyDivision = ({
  division,
  isSearching,
  onRegister,
  onClear,
}: {
  division: DivisionDetails;
  isSearching: boolean;
  onRegister: () => void;
  onClear: () => void;
}) => (
  <Box
    sx={{
      border:
        '1px solid rgba(239,175,0,0.25)',
      borderRadius: 4,
      minHeight: 330,
      px: {
        xs: 2.5,
        md: 5,
      },
      py: {
        xs: 5,
        md: 7,
      },
      bgcolor: '#0E0E0E',
      display: 'grid',
      placeItems: 'center',
      textAlign: 'center',
    }}
  >
    <Box maxWidth={680}>
      <PlayCircleOutlineIcon
        sx={{
          color: colors.Accent,
          fontSize: 58,
          mb: 2,
        }}
      />

      <Typography
        component='h2'
        sx={{
          fontSize: {
            xs: '1.6rem',
            md: '2.25rem',
          },
          fontWeight: 900,
          mb: 1.5,
        }}
      >
        {isSearching
          ? 'No matching fighter posts'
          : `${division.title} Catalogue`}
      </Typography>

      <Typography
        sx={{
          color:
            'rgba(255,255,255,0.65)',
          lineHeight: 1.8,
          mb: 3,
        }}
      >
        {isSearching
          ? 'No fighter posts matched your search. Try another boxer name, post title or location.'
          : `No ${division.shortTitle.toLowerCase()} fighter posts have been published yet. Registered teams can upload their boxer information and sparring videos.`}
      </Typography>

      <Stack
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        spacing={1.5}
        justifyContent='center'
      >
        {isSearching && (
          <Button
            variant='outlined'
            onClick={onClear}
            sx={{
              borderColor:
                colors.Accent,
              color: colors.Accent,
              fontWeight: 900,
              borderRadius: 999,
              px: 4,
            }}
          >
            Clear Search
          </Button>
        )}

        <Button
          variant='contained'
          onClick={onRegister}
          sx={{
            bgcolor: colors.Accent,
            color: '#000',
            fontWeight: 900,
            borderRadius: 999,
            px: 4,
            py: 1.2,

            '&:hover': {
              bgcolor: '#FFC533',
            },
          }}
        >
          Register Your Team
        </Button>
      </Stack>
    </Box>
  </Box>
);

const InformationCard = ({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) => (
  <Card
    sx={{
      bgcolor: '#111',
      border:
        '1px solid rgba(255,255,255,0.08)',
      borderRadius: 4,
      height: '100%',
      boxShadow:
        '0 18px 40px rgba(0,0,0,0.35)',
      transition: '0.25s ease',

      '&:hover': {
        transform: 'translateY(-5px)',
        borderColor:
          'rgba(239,175,0,0.45)',
      },
    }}
  >
    <CardContent
      sx={{
        p: 3,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 2.5,
          bgcolor:
            'rgba(239,175,0,0.12)',
          color: colors.Accent,
          mb: 2,

          '& svg': {
            fontSize: 27,
          },
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          color: '#fff',
          fontSize: '1.15rem',
          fontWeight: 900,
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color:
            'rgba(255,255,255,0.62)',
          lineHeight: 1.7,
        }}
      >
        {text}
      </Typography>
    </CardContent>
  </Card>
);

export default WeightClassPage;