// src/pages/user/Sponsorship/SponsorshipPage.tsx
import { Box, useMediaQuery } from '@mui/material';
import DesktopSponsorshipPage from './DesktopSponsorshipPage.tsx';
import MobileSponsorshipPage from './MobileSponsorshipPage.tsx';

export default function SponsorshipPage() {
  const isTabletUp = useMediaQuery('(min-width:910px)');

  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopSponsorshipPage />
      </Box>

      {/* (Optional) If you plan a mobile version later, render it here */}
      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileSponsorshipPage />
      </Box>
    </>
  );
}
