// pages/admin/SponsorshipPage.tsx
import { Box, useMediaQuery } from '@mui/material';
import DesktopSponsorshipsDashboard from './DesktopSponsorshipsDashboard';
import MobileSponsorshipsDashboard from './MobileSponsorshipsDashboard';

export type SponsorshipRequest = {
  sponsor_name: string;
  phone_number: string;
  payment_confirmation_status: 'Pending' | 'Failed' | 'Confirmed';
  sponsorship_status: 'Pending' | 'Processed' | 'Failed';
};

const SponsorshipPage = () => {
  const isDesktop = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box sx={{ display: isDesktop ? 'block' : 'none' }}>
        <DesktopSponsorshipsDashboard />
      </Box>
      <Box sx={{ display: isDesktop ? 'none' : 'block' }}>
        <MobileSponsorshipsDashboard />
      </Box>
    </>
  );
};

export default SponsorshipPage;



