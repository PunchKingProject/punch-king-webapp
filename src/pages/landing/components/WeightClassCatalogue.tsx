import { Box, Button, Card, CardContent, Chip, Container, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../../theme/colors';

const divisions = [
  {
    title: 'Professional Lightweight',
    slug: 'lightweight',
    limit: 'Up to 61.23kg / 135lbs',
    description: 'Discover African lightweight fighters and sparring videos.',
  },
  {
    title: 'Professional Welterweight',
    slug: 'welterweight',
    limit: 'Up to 66.68kg / 147lbs',
    description: 'Explore registered welterweight contenders across Africa.',
  },
  {
    title: 'Professional Middleweight',
    slug: 'middleweight',
    limit: 'Up to 72.57kg / 160lbs',
    description: 'View middleweight teams, fighters and tournament-ready videos.',
  },
];

const WeightClassCatalogue = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#050505', py: { xs: 7, md: 10 } }}>
      <Container maxWidth="xl">
        <Box textAlign="center" mb={5}>
          <Typography sx={{ color: colors.Accent, fontWeight: 900, letterSpacing: '.18em' }}>
            PROFESSIONAL DIVISIONS
          </Typography>
          <Typography sx={{ color: '#fff', fontSize: { xs: '2rem', md: '3.4rem' }, fontWeight: 950 }}>
            Weight Class Catalogue
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,.65)', maxWidth: 760, mx: 'auto', mt: 2 }}>
            Registered teams will be displayed according to the boxer’s sparring video weight category.
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 3 }}>
          {divisions.map((item) => (
            <Card
              key={item.slug}
              sx={{
                bgcolor: '#111',
                border: '1px solid rgba(239,175,0,.25)',
                borderRadius: 4,
                minHeight: 280,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 50px rgba(0,0,0,.45)',
              }}
            >
              <CardContent sx={{ p: 3, flex: 1 }}>
                <Chip
                  label={item.limit}
                  sx={{ bgcolor: 'rgba(239,175,0,.13)', color: colors.Accent, fontWeight: 800, mb: 2 }}
                />

                <Typography sx={{ color: '#fff', fontSize: '1.55rem', fontWeight: 900, mb: 1 }}>
                  {item.title}
                </Typography>

                <Typography sx={{ color: 'rgba(255,255,255,.65)', lineHeight: 1.7, mb: 3 }}>
                  {item.description}
                </Typography>

                <Stack spacing={1.2} sx={{ color: 'rgba(255,255,255,.7)', mb: 3 }}>
                  <Typography>• Sparring videos by weight class</Typography>
                  <Typography>• Boxer metadata and team information</Typography>
                  <Typography>• Sponsor-ready fighter catalogue</Typography>
                </Stack>

                <Button
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate(`/weight-class/${item.slug}`)}
                  sx={{
                    mt: 'auto',
                    bgcolor: colors.Accent,
                    color: '#000',
                    fontWeight: 900,
                    borderRadius: 999,
                    '&:hover': { bgcolor: '#FFC533' },
                  }}
                >
                  Explore Division
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default WeightClassCatalogue;