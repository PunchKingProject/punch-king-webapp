import { Box, Typography } from '@mui/material';
import { punchKingLogo } from '../../../assets';


const YT_ID = 'M86jP92tqvI'; // from https://youtu.be/BUR_aimjjbc?si=KVXMGEM8fuD67Rn8

const About = () => {
  
  return (
    <>
      <Box
        id='about'
        sx={{
          padding: '0 1.88em',
          '@media (min-width:910px) and (max-width:1000px)': {
            padding: '0em 2em',
          },
          '@media (min-width:1000px) and (max-width:1100px)': {
            padding: '0px 1em',
          },
          '@media (min-width:1100px)': { padding: '0px 5.38em' },
        }}
      >
        {/* Heading + logo row */}
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
            component='h2'
            sx={{
              fontSize: 'clamp(2.5rem, 8vw, 5.625rem)',
              textAlign: 'center',
              fontWeight: 900,
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
              '@media (min-width:900px)': { mt: 0, ml: 2 },
            }}
          >
            <Box
              component='img'
              src={punchKingLogo}
              alt='Punch King'
              sx={{ width: '100%', objectFit: 'cover' }}
            />
          </Box>
        </Box>

        {/* Responsive YouTube embed (replaces the image placeholder) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ minWidth: '207px', width: '100vw', maxWidth: '601px' }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                // 16:9 aspect ratio
                pt: '56.25%',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                border: '1px solid #2C2C2C',
                backgroundColor: '#000',
              }}
            >
              <Box
                component='iframe'
                loading='lazy'
                src={`https://www.youtube-nocookie.com/embed/${YT_ID}?rel=0&modestbranding=1&color=white`}
                title='Punch King African Championship'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default About;
