// pages/admin/Subscription/index.tsx
import { Box, useMediaQuery } from '@mui/material';
import DesktopSubscriptionsDashboard from './DesktopSubscriptionsDashboard.tsx';
import MobileSubscriptionsDashboard from './MobileSubscriptionsDashboard.tsx';

export default function SubscriptionPage() {
  const isDesktop = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box sx={{ display: isDesktop ? 'block' : 'none' }}>
        <DesktopSubscriptionsDashboard />
      </Box>
      <Box sx={{ display: isDesktop ? 'none' : 'block' }}>
        <MobileSubscriptionsDashboard />
      </Box>
    </>
  );
}
