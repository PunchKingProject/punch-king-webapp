import { Box, Typography } from '@mui/material';
import { aboutPunchKingVideoLogo, punchKingLogo } from '../../../assets';

const About = () => {
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
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            '@media (min-width:900px)': {
              flexDirection: 'row',
              m: 0,
              alignItems: 'center',
              justifySelf: 'center',
            },
          }}
        >
          <Typography
            variant='heroTitle'
            component={'h2'}
            sx={{
              fontSize: 'clamp(2.5rem, 8vw, 5.625rem)',
              textAlign: 'center',
              fontWeight: '900',
            }}
          >
            ABOUT
          </Typography>
          <Box
            sx={{
              minWidth: '147px',
              width: '8vw',
              maxWidth: '200px',
              mt: -4,
              '@media (min-width:900px)': {
                mt: 0,
                ml: 2,
              },
            }}
          >
            <Box
              component='img'
              src={punchKingLogo}
              alt={'boxer holding fist'}
              sx={{
                width: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              minWidth: '207px',
              width: '100vw',
              maxWidth: '601px',
            }}
          >
            <Box
              component='img'
              src={aboutPunchKingVideoLogo}
              alt={'Punch King video'}
              sx={{
                width: '100%',
                // height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default About;
