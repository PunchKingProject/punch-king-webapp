  // src/pages/user/MySponsorships/MySponsorshipsPage.tsx
  import { Box, useMediaQuery } from '@mui/material';
  import DesktopMySponsorshipsPage from './DesktopMySponsorshipsPage';
  import MobileMySponsorshipsPage from './MobileMySponsorshipsPage';

  export default function MySponsorshipsPage() {
    const isTabletUp = useMediaQuery('(min-width:910px)');
    return (
      <>
        <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
          <DesktopMySponsorshipsPage />
        </Box>
        <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
          <MobileMySponsorshipsPage />
        </Box>
      </>
    );
  }
