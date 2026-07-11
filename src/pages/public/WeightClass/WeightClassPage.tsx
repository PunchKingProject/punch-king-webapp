import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SportsMmaOutlinedIcon from '@mui/icons-material/SportsMmaOutlined';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../components/nav/Navbar.tsx';
import { colors } from '../../../theme/colors.ts';
import Footer from '../../landing/components/Footer.tsx';

type DivisionSlug = 'lightweight' | 'welterweight' | 'middleweight';

type DivisionDetails = {
  slug: DivisionSlug;
  title: string;
  shortTitle: string;
  kilograms: string;
  pounds: string;
  description: string;
};

const divisions: Record<DivisionSlug, DivisionDetails> = {
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

const WeightClassPage = () => {
  const navigate = useNavigate();
  const { division } = useParams<{ division: string }>();

  const selectedDivision = useMemo(() => {
    if (!division || !(division in divisions)) {
      return null;
    }

    return divisions[division as DivisionSlug];
  }, [division]);

  if (!selectedDivision) {
    return <Navigate to='/' replace />;
  }

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
            startIcon={<ArrowBackIosNewIcon />}
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
              <Box component='span' sx={{ color: colors.Accent }}>
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
                label={selectedDivision.kilograms}
                sx={{
                  bgcolor: 'rgba(239,175,0,0.14)',
                  color: colors.Accent,
                  fontWeight: 900,
                }}
              />

              <Chip
                label={selectedDivision.pounds}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.07)',
                  color: '#fff',
                  fontWeight: 800,
                }}
              />
            </Stack>

            <Typography
              sx={{
                color: 'rgba(255,255,255,0.7)',
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
              icon={<SportsMmaOutlinedIcon />}
              title='Registered Fighters'
              text='Boxers uploaded by registered teams will appear in this division.'
            />

            <InformationCard
              icon={<FitnessCenterOutlinedIcon />}
              title='Fighter Information'
              text='Each entry will include weight, team, clothing details and sparring metadata.'
            />

            <InformationCard
              icon={<PlayCircleOutlineIcon />}
              title='Sparring Videos'
              text='Sponsors will be able to review verified sparring videos before supporting teams.'
            />
          </Box>

          <Box
            sx={{
              border: '1px solid rgba(239,175,0,0.25)',
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
                {selectedDivision.title} Catalogue
              </Typography>

              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.8,
                  mb: 3,
                }}
              >
                Dynamic fighter and sparring-video listings will appear here
                after the boxer metadata fields and weight-class filtering API
                are completed.
              </Typography>

              <Button
                variant='contained'
                onClick={() => navigate('/sign-up?flow=team')}
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
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

const InformationCard = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <Card
    sx={{
      bgcolor: '#111',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 4,
      height: '100%',
      boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
      transition: '0.25s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        borderColor: 'rgba(239,175,0,0.45)',
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 2.5,
          bgcolor: 'rgba(239,175,0,0.12)',
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
          color: 'rgba(255,255,255,0.62)',
          lineHeight: 1.7,
        }}
      >
        {text}
      </Typography>
    </CardContent>
  </Card>
);

export default WeightClassPage;