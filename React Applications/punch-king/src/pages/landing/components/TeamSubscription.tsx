import { Box, Typography, useTheme } from '@mui/material';
import { colors } from '../../../theme/colors';
import CustomButton from '../../../components/buttons/CustomButton';

const subscriptionPlans = [
  {
    title: 'YEARLY',
    price: 'N20,000',
    details: `
      Get the most visibility with the annual subscription plan. Pitch your team to potential sponsors for 12 months, everyday with unlimited upload of videos and pictures of your team and get a chance to present your champion to compete for the Punch King belt.
Plan

    `,
  },
  {
    title: '6 MONTHS',
    price: 'N10,000',
    details: `Subscribe to this plan to present your champion for possible qualification of the Punch King championship 
`,
  },
  {
    title: '3 MONTHS',
    price: 'N2,000',
  },
];
const TeamSubscription = () => {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          padding: '0 1.88em',
          '@media (min-width:910px) and (max-width:1000px)': {
            padding: '0em 2em', // override between 900px and 1000px
          },
          '@media (min-width:1000px) and (max-width:1100px)': {
            // height: '200px',
            padding: '0px 1em', // override between 900px and 1000px
          },
          '@media (min-width:1100px)': {
            padding: '0px 5.38em',
          },
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
            component={'h2'}
            color='primary'
            sx={{
              fontSize: 'clamp(2rem, 5vw, 7.625rem)',
            }}
          >
            TEAM
          </Typography>
          <Typography
            variant='teamSubscriptionHeaderTwo'
            component={'h2'}
            sx={{
              fontSize: 'clamp(2rem, 5vw, 7.625rem)',
            }}
          >
            SUBSCRIPTION
          </Typography>
          <Typography
            variant='teamSubscriptionHeaderTwo'
            component={'h2'}
            color='primary'
            sx={{
              fontSize: 'clamp(2rem, 5vw, 7.625rem)',
            }}
          >
            PLANS
          </Typography>
        </Box>
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
          {subscriptionPlans.map((item) => {
            return (
              <>
                <Box
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
                    component={'h2'}
                    color='primary'
                    sx={{
                      fontSize: 'clamp(2.5rem, 5vw, 2.5em)',
                      fontWeight: 1000,
                    }}
                  >
                    {item.title} <br />
                    PLAN
                  </Typography>

                  <Typography
                    variant='teamSubscriptionHeaderOne'
                    component={'h1'}
                    sx={{
                      color: theme.palette.textMilk,
                      my: '.5em',
                      fontSize: 'clamp(2rem, 5vw, 4rem)',
                    }}
                  >
                    {item.price}
                  </Typography>

                  <Box
                    sx={{
                      minWidth: '200px',
                      width: '80%',
                    }}
                  >
                    <Typography
                      variant='bodyTextMilkDefault'
                      component={'p'}
                      sx={
                        {
                          // width: 'clamp(200px, 80%, 80%)',
                          // wordBreak: 'break-word',
                        }
                      }
                    >
                      {item.details}
                      <br />
                      <br />
                    </Typography>

                    <CustomButton
                      variant='contained'
                      color='primary'
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
              </>
            );
          })}
        </Box>
      </Box>
    </>
  );
};
export default TeamSubscription;
