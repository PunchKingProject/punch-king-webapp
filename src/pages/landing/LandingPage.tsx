// src/pages/landing/LandingPage.tsx
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Fab, Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  heroBoxer,
  heroBoxerLarge,
  heroSponsors,
  punchKingLogo,
  rankingBoxer,
  rankingSmallbox1,
} from '../../assets';
import ChampionshipModal from '../../components/modal/ChampionshipModal.tsx';
import Navbar from '../../components/nav/Navbar.tsx';
import ROUTES from '../../routes/routePath.ts';
import {
  scrollToSection,
  type SectionKey,
} from '../../utils/helpers.ts';
import EventActivities from './components/EventActivities.tsx';
import Footer from './components/Footer.tsx';
import Hero from './components/Hero.tsx';
import TeamPost from './components/TeamPost.tsx';

const BANNER_IMG_FALLBACK = heroBoxerLarge;

const LandingPage = () => {
  const [bannerOpen, setBannerOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const images = [
      heroBoxer,
      heroBoxerLarge,
      rankingBoxer,
      rankingSmallbox1,
      heroSponsors,
    ];

    images.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      setBannerOpen(true);
    }, 2000);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const section = location.hash.replace('#', '') as SectionKey;

    const timeout = window.setTimeout(() => {
      scrollToSection(section);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [location.hash]);

  const handleNav = (section: SectionKey) => {
    if (location.pathname !== '/') {
      navigate(`/#${section}`);
      return;
    }

    scrollToSection(section);
  };

  return (
    <>
      <Navbar onNav={handleNav} />

      {/* Hero now handles the header, Weight Class Catalogue, and Qualification Poll at the top */}
      <Hero />

      {/* Public team catalogue */}
      <TeamPost />

      {/* News, event activities and bulletin */}
      <EventActivities />

      <Footer />

      <ChampionshipModal
        open={bannerOpen}
        onClose={() => setBannerOpen(false)}
        imageSrc={BANNER_IMG_FALLBACK}
        logoSrc={punchKingLogo}
        onSignup={() => navigate(`${ROUTES.SIGN_UP}?flow=team`)}
      />

      <Tooltip title='Championship details'>
        <Fab
          color='primary'
          size='medium'
          onClick={() => setBannerOpen(true)}
          sx={{
            position: 'fixed',
            right: { xs: 16, sm: 24 },
            bottom: { xs: 16, sm: 24 },
            bgcolor: '#EFAF00',
            color: '#000',
            zIndex: 1300,
            '&:hover': { bgcolor: '#FFC533' },
          }}
          aria-label='Open championship details'
        >
          <InfoOutlinedIcon />
        </Fab>
      </Tooltip>
    </>
  );
};

export default LandingPage;