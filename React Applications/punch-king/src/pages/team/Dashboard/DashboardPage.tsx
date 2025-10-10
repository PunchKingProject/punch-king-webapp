import { Box, useMediaQuery } from '@mui/material';
import DesktopDashboardPage from './DesktopDashboardPage';
import MobileDashboardPage from './MobileDashboardPage';

function DashboardPage() {
  const isTabletUp = useMediaQuery('(min-width:910px)');

  return (
    <>
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
