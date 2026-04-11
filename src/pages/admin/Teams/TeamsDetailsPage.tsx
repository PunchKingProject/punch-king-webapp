import { Box, useMediaQuery } from '@mui/material';

import { DesktopTeamsDetailsPage } from './DesktopTeamsDetailsPage.tsx';
import MobileTeamDetails from './MobileTeamDetails.tsx';



const TeamsDetailsPage = () => {
  const isDesktop = useMediaQuery('(min-width:910px)');

  return (
    <>
      <Box sx={{ display: isDesktop ? 'block' : 'none' }}>
        <DesktopTeamsDetailsPage />
      </Box>
      <Box sx={{ display: isDesktop ? 'none' : 'block' }}>
        <MobileTeamDetails />
      </Box>
    </>
  );
};
export default TeamsDetailsPage;

