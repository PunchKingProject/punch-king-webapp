import { Box, useMediaQuery } from '@mui/material';

import DesktopLicensingDashboard from './DesktopLicensingDashboard';
import MobileLicensingDashboard from './MobileLicensingDashboard';

export type LicenseRequests = {
  team_name: string;
  phone_number: string;
  payment_confirmation_status: 'Pending' | 'Failed' | 'Confirmed';
  licensing_status: 'Pending' | 'Processing' | 'Failed' | 'Processed';
};

const LicensingPage = () => {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box
        sx={{
          display: isTabletUp ? 'block' : 'none',
        }}
      >
        {/* <DesktopLicensingPage /> */}
        <DesktopLicensingDashboard />
      </Box>
      <Box
        sx={{
          display: isTabletUp ? 'none' : 'block',
        }}
      >
        <MobileLicensingDashboard />
      </Box>
    </>
  );
};
export default LicensingPage;




