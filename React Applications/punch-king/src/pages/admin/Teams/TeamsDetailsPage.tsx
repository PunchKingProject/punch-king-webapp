import { Box, useMediaQuery } from '@mui/material';

import { DesktopTeamsDetailsPage } from './DesktopTeamsDetailsPage';
import MobileTeamDetails from './MobileTeamDetails';



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

