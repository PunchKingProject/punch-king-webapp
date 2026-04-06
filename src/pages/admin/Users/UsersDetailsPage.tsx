import { Box, useMediaQuery } from '@mui/material';
import DesktopUsersDetailsPage from './DesktopUsersDetailsPage.tsx';
import MobileUsersDetailsPage from './MobileUsersDetailsPage.tsx';

const UsersDetailsPage = () => {
  const isDesktop = useMediaQuery('(min-width:910px)');

  return (
    <>
      <Box sx={{ display: isDesktop ? 'block' : 'none' }}>
        <DesktopUsersDetailsPage />
      </Box>
      <Box sx={{ display: isDesktop ? 'none' : 'block' }}>
        <MobileUsersDetailsPage />
      </Box>
    </>
  );
};
export default UsersDetailsPage;
