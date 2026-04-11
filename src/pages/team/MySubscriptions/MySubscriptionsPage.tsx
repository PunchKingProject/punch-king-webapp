import { Box, useMediaQuery } from '@mui/material';
import DesktopMySubscriptionsPage from './DesktopMySubscriptionsPage.tsx';
import MobileMySubscriptionsPage from './MobileMySubscriptionsPage.tsx';


export default function MySubscriptionsPage() {
  const isTabletUp = useMediaQuery('(min-width:910px)');

  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopMySubscriptionsPage />
      </Box>
      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileMySubscriptionsPage />
      </Box>
    </>
  );
}
