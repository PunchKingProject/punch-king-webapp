import { Box, Card, CardContent, Chip, Container, Typography } from '@mui/material';
import { colors } from '../../../theme/colors';

const events = [
  {
    title: '2026 African Tournament Preparation',
    tag: 'Tournament',
    description: 'Punch King is preparing three professional weight classes for this year.',
  },
  {
    title: 'Registered Teams Catalogue',
    tag: 'Catalogue',
    description: 'Teams can upload sparring videos with boxer weight and clothing information.',
  },
  {
    title: 'Sponsor Visibility Updates',
    tag: 'Sponsors',
    description: 'Sponsors will be able to view boxer details before supporting teams.',
  },
];

const EventActivities = () => {
  return (
    <Box sx={{ bgcolor: '#000', py: { xs: 7, md: 10 } }}>
      <Container maxWidth="xl">
        <Box textAlign="center" mb={5}>
          <Typography sx={{ color: colors.Accent, fontWeight: 900, letterSpacing: '.18em' }}>
            EVENT ACTIVITIES
          </Typography>
          <Typography sx={{ color: '#fff', fontSize: { xs: '2rem', md: '3.2rem' }, fontWeight: 950 }}>
            News, Updates & Bulletin
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,.65)', maxWidth: 720, mx: 'auto', mt: 2 }}>
            Latest tournament updates, announcements, sponsorship information and platform activities.
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 3 }}>
          {events.map((event) => (
            <Card
              key={event.title}
              sx={{
                bgcolor: '#111',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 4,
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Chip
                  label={event.tag}
                  size="small"
                  sx={{ bgcolor: 'rgba(239,175,0,.13)', color: colors.Accent, fontWeight: 800, mb: 2 }}
                />
                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.25rem', mb: 1 }}>
                  {event.title}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,.65)', lineHeight: 1.7 }}>
                  {event.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default EventActivities;