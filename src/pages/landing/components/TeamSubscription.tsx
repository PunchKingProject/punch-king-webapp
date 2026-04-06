import { Box, Typography, useTheme } from '@mui/material';
import { colors } from '../../../theme/colors.ts';
import CustomButton from '../../../components/buttons/CustomButton.tsx';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../routes/routePath.ts';

type Plan = {
  title: 'YEARLY' | '6 MONTHS';
  price: string;
  details: string;
  benefits: string[];
};

const subscriptionPlans: Plan[] = [
  {
    title: 'YEARLY',
    price: 'N20,000',
    details: `Get the most visibility with the annual subscription plan. Pitch your team to potential sponsors for 12 months, every day, with unlimited uploads of videos and pictures of your team—and get a chance to present your champion to compete for the Punch King belt.`,
    benefits: [
      'Continental exposure and a global audience.',
      'Eligibility for sponsorship and tournament qualification.',
      'Club verification.',
      '1 year plan.',
      'Video and picture upload.',
      'Free complimentary 10 sponsorship chips.',
    ],
  },
  {
    title: '6 MONTHS',
    price: 'N10,000',
    details: `Subscribe to this plan to present your champion for possible qualification in the Punch King championship.`,
    benefits: [
      'Continental recognition and a global audience.',
      'Eligibility for sponsorship and tournament qualification.',
      'Club verification.',
      '6 months plan.',
      'Video and picture upload.',
    ],
  },
];

const TeamSubscription = () => {
  const theme = useTheme();
    const navigate = useNavigate(); 

  return (
    <Box
      id='subscriptions'
      sx={{
        padding: '0 1.88em',
        '@media (min-width:910px) and (max-width:1000px)': { padding: '0 2em' },
        '@media (min-width:1000px) and (max-width:1100px)': {
          padding: '0 1em',
        },
        '@media (min-width:1100px)': { padding: '0 5.38em' },
      }}
    >
      {/* Header */}
      <Box
        my={4}
        sx={{
          '@media (min-width:910px)': {
            textAlign: 'right ',
            fontSize: 'clamp(2rem, 5vw, 7.625rem)',
          },
        }}
      >
        <Typography
          variant='teamSubscriptionHeaderTwo'
          component='h2'
          color='primary'
          sx={{ fontSize: 'clamp(2rem, 5vw, 7.625rem)' }}
        >
          TEAM
        </Typography>
        <Typography
          variant='teamSubscriptionHeaderTwo'
          component='h2'
          sx={{ fontSize: 'clamp(2rem, 5vw, 7.625rem)' }}
        >
          SUBSCRIPTION
        </Typography>
        <Typography
          variant='teamSubscriptionHeaderTwo'
          component='h2'
          color='primary'
          sx={{ fontSize: 'clamp(2rem, 5vw, 7.625rem)' }}
        >
          PLANS
        </Typography>
      </Box>

      {/* Cards */}
      <Box
        sx={{
          '@media (min-width:910px)': {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '3em',
          },
        }}
      >
        {subscriptionPlans.map((item) => (
          <Box
            key={item.title}
            sx={{
              backgroundColor: colors.Card,
              padding: '1.8em 1.3em',
              width: '100%',
              mb: 4,
              borderRadius: '5px',
              '@media (min-width:910px)': {
                flexBasis: '300px',
                flexGrow: 1,
              },
            }}
          >
            <Typography
              variant='teamSubscriptionHeaderTwo'
              component='h2'
              color='primary'
              sx={{ fontSize: 'clamp(2.5rem, 5vw, 2.5em)', fontWeight: 1000 }}
            >
              {item.title} <br />
              PLAN
            </Typography>

            <Typography
              variant='teamSubscriptionHeaderOne'
              component='h1'
              sx={{
                color: theme.palette.textMilk,
                my: '.5em',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
              }}
            >
              {item.price}
            </Typography>

            <Box sx={{ minWidth: '200px', width: '80%' }}>
              {/* Intro / details */}
              <Typography
                variant='bodyTextMilkDefault'
                component='p'
                sx={{ mb: 2 }}
              >
                {item.details}
              </Typography>

              {/* Benefits */}
              <Typography
                component='h3'
                sx={{
                  fontWeight: 800,
                  fontSize: 16,
                  color: theme.palette.textMilk,
                  mb: 1,
                }}
              >
                Benefits:
              </Typography>
              <Box
                component='ul'
                sx={{
                  pl: 2.5,
                  m: 0,
                  color: '#CFCFCF',
                  '& li': {
                    mb: 0.75,
                    fontSize: 14,
                    lineHeight: 1.6,
                    listStyle: 'disc',
                  },
                }}
              >
                {item.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </Box>

              <CustomButton
                variant='contained'
                color='primary'
                onClick={() => navigate(ROUTES.SIGN_IN)} // ⬅️ route to Login
                sx={{
                  display: 'block',
                  width: '100%',
                  color: colors.AccentDark,
                  my: '3em',
                  mb: '1em',
                }}
              >
                Subscribe
              </CustomButton>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TeamSubscription;
