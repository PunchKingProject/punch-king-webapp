// src/pages/landing/components/Hero.tsx
import { Box, Typography, useMediaQuery } from '@mui/material';
import { newHeroImage } from '../../../assets';
import HeroImageWithLoader from '../../../components/images/HeroImagesWithLoader.tsx';
import { colors } from '../../../theme/colors.ts';
import About from './About.tsx';
import TeamRanking from './TeamRanking.tsx';
import TeamSponsorship from './TeamSponsorship.tsx';
import TeamSubscription from './TeamSubscription.tsx';
import WeightClassCatalogue from './WeightClassCatalogue.tsx';
import QualificationPoll from './QualificationPoll.tsx'; // ⬅️ Imported inside Hero

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

      {/* Both sections placed at the top of the landing page inside Hero */}
      <WeightClassCatalogue />
      <QualificationPoll />

      {/* Rest of the hero sections */}
      <TeamRanking />
      <About />
      <TeamSponsorship />
      {/* ⬅️ Commented out to hide subscription plans from the landing page */}
      {/* <TeamSubscription /> */}
    </>
  );
};

export default Hero;

const MobileHero = () => {
  return (
    <Box
      component='section'
      sx={{
        position: 'relative',
        bgcolor: '#000',
        overflow: 'hidden',
        pt: 2,
        pb: 4,
      }}
    >
      <Box
        sx={{
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography
          component='p'
          sx={{
            color: colors.Accent,
            fontWeight: 900,
            fontSize: '0.75rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            mb: 1.5,
          }}
        >
          African Professional Boxing
        </Typography>

        <Typography
          component='h1'
          sx={{
            color: '#fff',
            fontSize: 'clamp(2.4rem, 11vw, 4rem)',
            fontWeight: 950,
            lineHeight: 1,
            textTransform: 'uppercase',
            mb: 1.5,
          }}
        >
          Built For
          <br />
          Warriors
        </Typography>

        <Typography
          sx={{
            color: 'rgba(255,255,255,0.72)',
            fontSize: '0.95rem',
            lineHeight: 1.7,
            maxWidth: 520,
            mx: 'auto',
          }}
        >
          Connecting African boxing teams, professional fighters, fans and
          sponsors through one digital platform.
        </Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <HeroImageWithLoader
          src={newHeroImage}
          alt='Professional African boxer'
          aspectRatio='10/7'
          objectFit='contain'
          sx={{
            width: '100%',
            maxHeight: '430px',
          }}
        />

        <Typography
          sx={{
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            fontSize: '0.85rem',
            mt: 1,
          }}
        >
          ~ Moses Eagle James
        </Typography>
      </Box>
    </Box>
  );
};

const DesktopHero = () => {
  return (
    <Box
      component='section'
      sx={{
        position: 'relative',
        bgcolor: '#000',
        overflow: 'hidden',
        minHeight: '650px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          width: '100%',
          maxWidth: 1500,
          mx: 'auto',
          px: {
            md: 4,
            lg: 8,
          },
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Typography
            component='p'
            sx={{
              color: colors.Accent,
              fontWeight: 900,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              mb: 2,
            }}
          >
            African Professional Boxing
          </Typography>

          <Typography
            component='h1'
            sx={{
              color: '#fff',
              fontSize: 'clamp(4rem, 7vw, 7rem)',
              fontWeight: 950,
              lineHeight: 0.95,
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
            }}
          >
            Built For
            <br />
            Warriors,
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: {
                md: 1.5,
                lg: 2,
              },
              mt: 1.5,
            }}
          >
            <Typography
              component='span'
              sx={{
                color: '#fff',
                textTransform: 'uppercase',
                fontSize: 'clamp(1.7rem, 3vw, 3.4rem)',
                fontWeight: 900,
              }}
            >
              Crafted by the
            </Typography>

            <Typography
              component='span'
              sx={{
                color: colors.Accent,
                fontSize: 'clamp(3rem, 6vw, 6rem)',
                fontWeight: 950,
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              fans
            </Typography>
          </Box>

          <Typography
            sx={{
              color: 'rgba(255,255,255,0.68)',
              maxWidth: 650,
              mt: 3,
              fontSize: '1.05rem',
              lineHeight: 1.8,
            }}
          >
            Punch King connects professional African boxing teams, fighters,
            fans and sponsors through a modern digital sponsorship and athlete
            showcase platform.
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '70%',
              height: '70%',
              borderRadius: '50%',
              bgcolor: 'rgba(239,175,0,0.08)',
              filter: 'blur(80px)',
              top: '15%',
              left: '15%',
            }}
          />

          <HeroImageWithLoader
            src={newHeroImage}
            alt='Professional African boxer'
            sx={{
              width: '100%',
              height: 'min(50vw, 690px)',
              objectFit: 'contain',
              objectPosition: 'center',
              position: 'relative',
              zIndex: 1,
            }}
            objectFit='contain'
          />

          <Typography
            sx={{
              color: 'rgba(255,255,255,0.68)',
              textAlign: 'center',
              mt: -1,
              position: 'relative',
              zIndex: 2,
            }}
          >
            ~ Moses Eagle James
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};