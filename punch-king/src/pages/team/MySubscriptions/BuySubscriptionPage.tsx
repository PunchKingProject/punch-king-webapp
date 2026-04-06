import { Box, useMediaQuery } from '@mui/material';
import DesktopBuySubscriptionPage from './DesktopBuySubscriptionPage.tsx';
import MobileBuySubscriptionPage from './MobileBuySubscriptionPage.tsx';

export default function BuySubscriptionPage() {
  const isTabletUp = useMediaQuery('(min-width:910px)');

  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopBuySubscriptionPage />
      </Box>
      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileBuySubscriptionPage />
      </Box>
    </>
  );
}
