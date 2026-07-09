import { Box, Typography, useMediaQuery } from '@mui/material';
import { newHeroImage } from '../../../assets';
import HeroImageWithLoader from '../../../components/images/HeroImagesWithLoader.tsx';
import { colors } from '../../../theme/colors.ts';
import About from './About.tsx';
import EventActivities from './EventActivities.tsx';
import TeamRanking from './TeamRanking.tsx';
import TeamSponsorship from './TeamSponsorship.tsx';
import TeamSubscription from './TeamSubscription.tsx';
import WeightClassCatalogue from './WeightClassCatalogue.tsx';

const Hero = () => {
  const isTabletUp = useMediaQuery('(min-width:910px)');

  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopHero />
      </Box>

      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileHero />
      </Box>

      <WeightClassCatalogue />
      <TeamRanking />
      <About />
      <TeamSponsorship />
      <TeamSubscription />

      
    </>
  );
};

export default Hero;

const MobileHero = () => {
  return (
    <Box>
      <HeroImageWithLoader
        src={newHeroImage}
        alt="A Boxer with fist clenched"
        aspectRatio="10/7"
        objectFit="contain"
        sx={{ maxHeight: '400px' }}
      />

      <Typography sx={{ textAlign: 'center' }}>
        ~ Moses Eagle James
      </Typography>
    </Box>
  );
};

const DesktopHero = () => {
  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          paddingTop: '2em',
          alignItems: 'flex-start',
          paddingX: '5.38em',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ zIndex: 3, pl: 2.8, width: '90%' }}>
          <Typography
            component="h1"
            sx={{
              fontSize: 'clamp(1.5rem, 7vw, 5.5rem)',
              fontWeight: 900,
              lineHeight: 1.2,
              textTransform: 'uppercase',
              marginTop: '.3em',
            }}
          >
            Built For
            <br /> Warriors,
          </Typography>

          <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
            <Typography
              component="h4"
              sx={{
                textTransform: 'uppercase',
                fontSize: 'clamp(1.5rem, 3vw, 3.5rem)',
                fontWeight: 900,
              }}
            >
              Crafted by the
            </Typography>

            <Typography
              component="span"
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
        </Box>

        <Box sx={{ width: '50vw', overflow: 'hidden' }}>
          <HeroImageWithLoader
            src={newHeroImage}
            alt="A Boxer with fist clenched"
            sx={{
              height: '45vw',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
            objectFit="contain"
          />

          <Typography sx={{ textAlign: 'center' }}>
            ~ Moses Eagle James
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};