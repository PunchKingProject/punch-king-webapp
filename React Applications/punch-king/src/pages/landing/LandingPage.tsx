import { useEffect } from 'react';
import {
  heroBoxer,
  heroBoxerLarge,
  heroSponsors,
  rankingBoxer,
  rankingSmallbox1,
} from '../../assets';
import Navbar from '../../components/nav/Navbar';
import Hero from './components/Hero';
import TeamPost from './components/TeamPost';
import Footer from './components/Footer';

const LandingPage = () => {
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
  return (
    <>
      <Navbar />
      <Hero />
      <TeamPost />
      <Footer />
    </>
  );
};
export default LandingPage;
