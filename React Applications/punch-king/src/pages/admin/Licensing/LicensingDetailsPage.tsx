import { Box, useMediaQuery } from '@mui/material';
import DesktopLicensingDetailsPage from './DesktopLicensingDetailsPage';
import MobileLicensingDetailsPage from './MobileLicensingDetailsPage';






function LicensingDetailsPage() {
  const isDesktop = useMediaQuery('(min-width:910px)');

  return (
    <>
      <Box
        sx={{
          display: isDesktop ? 'block' : 'none',
        }}
      >
        <DesktopLicensingDetailsPage />
      </Box>
      <Box
        sx={{
          display: isDesktop ? 'none' : 'block',
        }}
      >
        <MobileLicensingDetailsPage />
      </Box>
    </>
  );
}


export default LicensingDetailsPage;
