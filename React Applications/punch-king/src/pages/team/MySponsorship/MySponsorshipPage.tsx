import { Box, useMediaQuery } from '@mui/material';
import DesktopMySponsorshipPage from './DesktopMySponsorshipPage';
import MobileMySponsorshipPage from './MobileMySponsorshipPage';

export default function MySponsorshipPage() {
  const isTabletUp = useMediaQuery('(min-width:910px)');

  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopMySponsorshipPage />
      </Box>
      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileMySponsorshipPage />
      </Box>
    </>
  );
}
