// pages/admin/Subscription/index.tsx
import { Box, useMediaQuery } from '@mui/material';
import DesktopSubscriptionsDashboard from './DesktopSubscriptionsDashboard';
import MobileSubscriptionsDashboard from './MobileSubscriptionsDashboard';

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
