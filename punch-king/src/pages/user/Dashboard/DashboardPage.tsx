// src/pages/user/Dashboard/index.tsx
import { Box, useMediaQuery } from '@mui/material';
import DesktopDashboardPage from './DesktopDashboardPage.tsx';
import MobileDashboardPage from './MobileDashboardPage.tsx';

export default function Dashboard() {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopDashboardPage />
      </Box>
      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileDashboardPage />
      </Box>
    </>
  );
}
