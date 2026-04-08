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
  updatedModalImage,
} from '../../assets';
import ChampionshipModal from '../../components/modal/ChampionshipModal';
import Navbar from '../../components/nav/Navbar';
import ROUTES from '../../routes/routePath';
import { scrollToSection, type SectionKey } from '../../utils/helpers';
import Footer from './components/Footer';
import Hero from './components/Hero';
import TeamPost from './components/TeamPost';

const BANNER_IMG_FALLBACK = updatedModalImage;

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
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto-open banner after 2 seconds on first render
  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      setBannerOpen(true);
    }, 2000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  // if we come in with /#about etc, scroll after mount
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '') as SectionKey;
      // wait a tick to ensure sections are painted
      setTimeout(() => scrollToSection(id), 0);
    }
  }, [location.hash]);

  const handleNav = (section: SectionKey) => {
    // ensure we're on the landing page
    if (location.pathname !== '/') {
      navigate(`/#${section}`, { replace: false });
      return;
    }
    scrollToSection(section);
  };

  return (
    <>
      <Navbar onNav={handleNav} />

      <Hero />
      <TeamPost />
      <Footer />

      {/* Championship modal */}
      <ChampionshipModal
        open={bannerOpen}
        onClose={() => setBannerOpen(false)}
        imageSrc={BANNER_IMG_FALLBACK}
        logoSrc={punchKingLogo} // ⬅️ show gold logo in left column
        onSignup={() => navigate(`${ROUTES.SIGN_UP}?flow=team`)}
      />

      {/* Reopen button (bottom-right) */}
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
            '&:hover': { bgcolor: '#FFC533' },
            zIndex: 1300, // above content
          }}
          aria-label='Open championship banner'
        >
          <InfoOutlinedIcon />
        </Fab>
      </Tooltip>
    </>
  );
};
export default LandingPage;
