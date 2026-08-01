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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../../theme/colors.ts';
import ROUTES from '../../../routes/routePath.ts'; 

const rankedTeams = [
  {
    rank: 1,
    name: 'King of the Jungle Boxing Academy',
    license: 'NBBofC/30/30',
    country: 'Nigeria',
    sponsorships: 60,
    sponsors: 20,
    status: 'Top Ranked',
  },
  {
    rank: 2,
    name: 'Elite Warriors Boxing Team',
    license: 'Pending Verification',
    country: 'Africa',
    sponsorships: 42,
    sponsors: 14,
    status: 'Rising Team',
  },
  {
    rank: 3,
    name: 'Golden Fist Boxing Club',
    license: 'Pending Verification',
    country: 'Africa',
    sponsorships: 31,
    sponsors: 9,
    status: 'Contender',
  },
];

const TeamRanking = () => {
  const navigate = useNavigate();

  return (
    <Box
      id='ranking'
      sx={{
        bgcolor: '#050505',
        py: { xs: 7, md: 10 },
        background:
          'linear-gradient(180deg, #000000 0%, #090909 45%, #000000 100%)',
      }}
    >
      <Container maxWidth='xl'>
        <Box textAlign='center' mb={{ xs: 5, md: 7 }}>
          <Typography
            sx={{
              color: colors.Accent,
              fontWeight: 900,
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              fontSize: '.78rem',
              mb: 1.5,
            }}
          >
            African Team Rankings
          </Typography>

          <Typography
            component='h2'
            sx={{
              color: '#fff',
              fontSize: { xs: '2rem', sm: '2.7rem', md: '3.4rem' },
              fontWeight: 950,
              lineHeight: 1.05,
            }}
          >
            TOP{' '}
            <Box component='span' sx={{ color: colors.Accent }}>
              TEAMS
            </Box>
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255,255,255,.68)',
              maxWidth: 780,
              mx: 'auto',
              mt: 2,
              lineHeight: 1.7,
            }}
          >
            Team ranking is determined by sponsorship activity, subscription
            status, verification, catalogue updates and fan engagement.
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
          }}
        >
          {rankedTeams.map((team) => (
            <Card
              key={team.rank}
              sx={{
                bgcolor: '#111',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 4,
                overflow: 'hidden',
                height: '100%',
                boxShadow: '0 18px 45px rgba(0,0,0,.45)',
                transition: '.25s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  borderColor: 'rgba(239,175,0,.55)',
                  boxShadow: '0 22px 55px rgba(239,175,0,.12)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                  mb={2}
                >
                  <Chip
                    icon={<EmojiEventsIcon />}
                    label={`Rank #${team.rank}`}
                    sx={{
                      bgcolor: 'rgba(239,175,0,.13)',
                      color: colors.Accent,
                      fontWeight: 900,
                      '& .MuiChip-icon': {
                        color: colors.Accent,
                      },
                    }}
                  />

                  <Typography
                    sx={{
                      color:
                        team.rank === 1
                          ? colors.Accent
                          : 'rgba(255,255,255,.55)',
                      fontWeight: 900,
                      fontSize: '1.7rem',
                    }}
                  >
                    {team.rank === 1 ? '🥇' : team.rank === 2 ? '🥈' : '🥉'}
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '1.35rem',
                    lineHeight: 1.25,
                    mb: 1,
                    minHeight: { md: 68 },
                  }}
                >
                  {team.name}
                </Typography>

                <Typography
                  sx={{
                    color: colors.Accent,
                    fontWeight: 800,
                    mb: 0.7,
                  }}
                >
                  {team.status}
                </Typography>

                <Typography
                  sx={{
                    color: 'rgba(255,255,255,.62)',
                    mb: 2,
                    lineHeight: 1.6,
                  }}
                >
                  License: {team.license}
                  <br />
                  Country: {team.country}
                </Typography>

                <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap mb={3}>
                  <MiniStat
                    icon={<VolunteerActivismOutlinedIcon />}
                    label={`${team.sponsorships} sponsorships`}
                  />
                  <MiniStat
                    icon={<Groups2OutlinedIcon />}
                    label={`${team.sponsors} sponsors`}
                  />
                </Stack>

                <Button
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => 
                    // ✅ Redirects to correct constant and passes the intended destination in the state
                    navigate(ROUTES.SIGN_IN, { 
                      state: { from: '/user/ranked-team' } 
                    })
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
                  View Ranking
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
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
      color: 'rgba(255,255,255,.72)',
      bgcolor: 'rgba(255,255,255,.055)',
      border: '1px solid rgba(255,255,255,.07)',
      borderRadius: 999,
      px: 1.1,
      py: 0.65,
      fontSize: '.78rem',
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

export default TeamRanking;