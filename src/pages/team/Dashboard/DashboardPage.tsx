// src/pages/team/Dashboard/DashboardPage.tsx

import { Box, useMediaQuery } from '@mui/material';
import DesktopDashboardPage from './DesktopDashboardPage.tsx';
import MobileDashboardPage from './MobileDashboardPage.tsx';
import SubscriptionWarningDialog from "./components/SubscriptionWarningDialog.tsx";
import TeamContentUploadWarningDialog from "./components/TeamContentUploadWarningDialog.tsx";

function DashboardPage() {
  const isTabletUp = useMediaQuery('(min-width:910px)');

  return (
    <>
      <SubscriptionWarningDialog />
      <TeamContentUploadWarningDialog />
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