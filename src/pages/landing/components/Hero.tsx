import { Box, Typography, useMediaQuery } from '@mui/material';
import Marquee from 'react-fast-marquee';
import { heroSponsors, newHeroImage } from '../../../assets';
import CustomButton from '../../../components/buttons/CustomButton.tsx';
import HeroImageWithLoader from '../../../components/images/HeroImagesWithLoader.tsx';
import { colors } from '../../../theme/colors.ts';
import About from './About.tsx';
import TeamRanking from './TeamRanking.tsx';
import TeamSubscription from './TeamSubscription.tsx';
import TeamSponsorship from './TeamSponsorship.tsx';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../routes/routePath.ts';

// import CustomTypography from '../../../components/typography/CustomTypography';

const Hero = () => {
  const isTabletUp = useMediaQuery('(min-width:910px)');
    const navigate = useNavigate();

      const goTeamSignup = () => navigate(`${ROUTES.SIGN_UP}?flow=team`);
      const goSponsorSignup = () => navigate(`${ROUTES.SIGN_UP}?flow=sponsor`);

  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopHero onSubscribe={goTeamSignup} onSignup={goSponsorSignup} />
      </Box>
      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileHero onSubscribe={goTeamSignup} onSignup={goSponsorSignup} />
      </Box>

      <TeamRanking />

      <About />
      <TeamSponsorship />

      <TeamSubscription />
    </>
  );
};
export default Hero;

type CTAProps = {
  onSubscribe: () => void; // Subscribe → Team signup
  onSignup: () => void; // Sign up → Sponsor signup
};

const MobileHero = ({ onSubscribe, onSignup }: CTAProps) => {
  return (
    <>
      <Box
        sx={{
          position: 'relative',
        }}
      >
        {/* <Box
          component={'img'}
          loading='lazy'
          src={heroBoxer}
          alt='A Boxer with fist clenched'
          sx={{
            objectFit: 'contain',
            width: '100%',
            maxHeight: '400px',
          }}
        /> */}
        <HeroImageWithLoader
          src={newHeroImage}
          alt='A Boxer with fist clenched'
          aspectRatio='10/7'
          objectFit='contain'
          sx={{
            maxHeight: '400px',
          }}
        />
        <Typography
          sx={{
            textAlign: 'center',
          }}
        >
          ~ Moses Eagle James
        </Typography>
        <Box
          sx={{
            padding: '1em',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4vw',
            position: 'absolute',
            bottom: '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
          }}
        >
          <CustomButton
            variant='contained'
            color='primary'
            textColor={colors.AccentDark}
            sx={{
              padding: '8px 10vw',
            }}
            onClick={onSubscribe} // 👈 Team signup
          >
            Subscribe
          </CustomButton>
          <CustomButton
            variant='contained'
            color='primary'
            bgColor='white'
            textColor={colors.AccentDark}
            sx={{
              padding: '8px 10vw',
            }}
            onClick={onSignup} // 👈 Sponsor signup
          >
            Sign up
          </CustomButton>
        </Box>
      </Box>
      {/* Image Slider
      <Box
        sx={{
          width: '100%',
          height: '200px',
          backgroundColor: 'grey',
        }}
      /> */}

      {/* Slider Photage */}

      <Box
        sx={{
          position: 'relative',
          height: 'fit-content',
          width: '100%',
        }}
      >
        <Box
          sx={{
            gap: '3em',
            my: 4,
            width: '100%',
            top: '0px',
            zIndex: 3,
          }}
        >
          <Marquee
            style={{
              width: '100%',
            }}
            speed={50}
            gradient={false}
          >
            {/* Repeat the array multiple times for better visual effect */}
            {[...Array(3)].map((_, setIndex) =>
              [1, 2, 3].map((_, index) => {
                return (
                  <Box
                    sx={{
                      width: '358px',
                      height: '207px',
                      marginRight: '3em',
                    }}
                    key={`${setIndex}-${index}`}
                  >
                    <Box
                      component={'img'}
                      src={heroSponsors}
                      sx={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </Box>
                );
              })
            )}
          </Marquee>
        </Box>
      </Box>
    </>
  );
};

const DesktopHero = ({ onSubscribe, onSignup }: CTAProps) => {
  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          paddingTop: '2em',
          alignItems: 'flex-start',
          paddingX: '5.38em',
          justifyContent: 'space-between',
          '@media (min-width:900px) and (max-width:1000px)': {
            paddingX: '2em', // override between 900px and 1000px
          },
          '@media (min-width:1000px) and (max-width:1100px)': {
            // height: '200px',
            paddingX: '1em', // override between 900px and 1000px
          },
        }}
      >
        <Box
          sx={{
            zIndex: 3,
            pl: 2.8,
            // border: '2px solid red',
            width: '90%',
          }}
        >
          <Typography
            // variant='heroTitle'
            component={'h1'}
            // textTransform={'uppercase'}
            sx={{
              fontSize: 'clamp(1.5rem, 7vw, 5.5rem)',
              fontWeight: 900,
              lineHeight: 1.2,
              textTransform: 'uppercase',
              // marginX: 0,
              marginTop: '.3em',
            }}
          >
            Built For
            <br /> Warriors,
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
              alignItems: 'baseline',
            }}
          >
            <Typography
              component={'h4'}
              sx={{
                textTransform: 'uppercase',
                fontSize: 'clamp(1.5rem, 3vw, 3.5rem)',
                fontWeight: 900,
              }}
            >
              Crafted by the
            </Typography>
            <Typography
              // variant='heroTitle'
              component={'span'}
              sx={{
                color: colors.Accent,

                fontSize: 'clamp(1.5rem, 7vw, 5.5rem)',
                fontWeight: 900,
                lineHeight: 1.2,
                textTransform: 'uppercase',
              }}
            >
              fans
            </Typography>
          </Box>

          {/* <h1>hey</h1> */}
          <Box
            sx={{
              // padding: '1em',
              display: 'flex',
              // justifyContent: 'center',
              // alignItems: 'center',
              // border: '2px solid red',
              gap: '2vw',
              // position: 'absolute',
              // bottom: '8%',
              // left: '50%',
              // transform: 'translateX(-50%)',
              width: '70%',
            }}
          >
            <CustomButton
              variant='contained'
              color='primary'
              textColor={colors.AccentDark}
              sx={{
                // padding: '8px 10px',
                width: '48%',
              }}
              onClick={onSubscribe} // 👈 Team signup
            >
              Subscribe
            </CustomButton>
            <CustomButton
              variant='contained'
              color='primary'
              bgColor='white'
              textColor={colors.AccentDark}
              sx={{
                // padding: '8px 10vw',
                width: '48%',
              }}
              onClick={onSignup} // 👈 Sponsor signup
            >
              Sign up
            </CustomButton>
          </Box>
        </Box>
        <Box
          sx={{
            // width: 'content-fit',
            width: '50vw',
            overflow: 'hidden',
            // border: '2px solid red',
          }}
        >
          <HeroImageWithLoader
            src={newHeroImage}
            alt='A Boxer with fist clenched'
            // aspectRatio='3/2'
            sx={{
              height: '45vw',
              // border: '2px solid yellow',
              objectFit: 'contain',
              // objectFit: 'contained',
              // objectPosition: '0vw center',
              objectPosition: 'center',
              // overflow: 'visible',
            }}
            objectFit='contain'
          />
          <Typography
            sx={{
              textAlign: 'center',
            }}
          >
            ~ Moses Eagle James
          </Typography>
        </Box>
      </Box>

      {/* Slider Photage */}

      <Box
        sx={{
          position: 'relative',
          height: 'fit-content',
          width: '100%',
        }}
      >
        <Box
          sx={{
            gap: '3em',
            my: 4,
            width: '100%',
            top: '0px',
            zIndex: 3,
          }}
        >
          <Marquee
            style={{
              width: '100%',
            }}
            speed={50}
            gradient={false}
          >
            {/* Repeat the array multiple times for better visual effect */}
            {[...Array(3)].map((_, setIndex) =>
              [1, 2, 3].map((_, index) => {
                return (
                  <Box
                    sx={{
                      width: '358px',
                      height: '207px',
                      marginRight: '3em',
                    }}
                    key={`${setIndex}-${index}`}
                  >
                    <Box
                      component={'img'}
                      src={heroSponsors}
                      sx={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </Box>
                );
              })
            )}
          </Marquee>
        </Box>
      </Box>
    </Box>
  );
};
