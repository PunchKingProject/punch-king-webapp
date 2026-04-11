import { Box, useMediaQuery } from '@mui/material';
import DesktopDashboardPage from './DesktopDashboardPage.tsx';
import MobileDashboardPage from './MobileDashboardPage.tsx';
import SubscriptionWarningDialog from "./components/SubscriptionWarningDialog.tsx";

function DashboardPage() {
  const isTabletUp = useMediaQuery('(min-width:910px)');

  return (
    <>
      <SubscriptionWarningDialog />
      <Box
        sx={{
          display: isTabletUp ? 'block' : 'none',
        }}
      >
        <DesktopDashboardPage />
      </Box>
      <Box
        sx={{
          display: isTabletUp ? 'none' : 'block',
        }}
      >
        <MobileDashboardPage />
      </Box>
    </>
  );
}

export default DashboardPage;
