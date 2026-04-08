import { Box, useMediaQuery } from '@mui/material';
import DesktopUserDashboard from './components/DesktopUserDashboard';
import MobileUserDashboard from './MobileUserDashboard';

export type UserRow = {
  user_name: string;
  phone_number: string;
  email: string;
  sponsorships: number;
  sponsor_units: number;
};

const UsersPage = () => {
  const isTabletUp = useMediaQuery('(min-width:910px)');

  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopUserDashboard />
      </Box>

      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileUserDashboard />
      </Box>
    </>
  );
};
export default UsersPage;
