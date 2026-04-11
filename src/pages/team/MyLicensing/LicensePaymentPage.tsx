import { Box, useMediaQuery } from '@mui/material';
import DesktopLicensePaymentPage from './DesktopLicensePaymentPage.tsx';
import MobileLicensePaymentPage from './MobileLicensePaymentPage.tsx';

export default function LicensePaymentPage() {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopLicensePaymentPage />
      </Box>
      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileLicensePaymentPage />
      </Box>
    </>
  );
}
