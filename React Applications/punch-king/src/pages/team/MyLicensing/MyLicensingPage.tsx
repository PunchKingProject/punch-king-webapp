import { Box, useMediaQuery } from '@mui/material';
import DesktopMyLicensingPage from './DesktopMyLicensingPage';
import MobileMyLicensingPage from './MobileMyLicensingPage';

export default function MyLicensingPage() {
  const isTabletUp = useMediaQuery('(min-width:910px)');

  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopMyLicensingPage />
      </Box>
      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileMyLicensingPage />
      </Box>
    </>
  );
}
