import { Box, Typography } from '@mui/material';

const TeamSponsorship = () => {
  return (
    <>
      <Box
        sx={{
          border: '2px solid red',
        }}
      >
        {/* Team Sponsorship */}
        {/* Header */}
        <Box>
          <Typography
            variant='teamSubscriptionHeaderTwo'
            component={'h2'}
            color='primary'
            sx={{
              fontSize: 'clamp(2rem, 5vw, 7.625rem)',
            }}
          >
            TEAM
            <br />
            SPONSORSHIP
          </Typography>
          {/* Image and text container */}
          <Box>
            <Box>
                <Box component={'img'}  />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default TeamSponsorship;
