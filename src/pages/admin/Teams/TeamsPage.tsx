// pages/admin/TeamsPage.tsx
import { Box, useMediaQuery } from '@mui/material';
import DesktopTeamDashboard from './components/DesktopTeamDashboard';
import MobileTeamsHome from './MobileTeamsHome';

export type TeamRow = {
  team_name: string;
  license_number: string | 'NIL';
  sponsors_accrued: number;
  ranking: string; // e.g., "1ST", "2ND"
};

const TeamsPage = () => {
  const isDesktop = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box sx={{ display: isDesktop ? 'block' : 'none' }}>
        <DesktopTeamDashboard />
      </Box>
      <Box sx={{ display: isDesktop ? 'none' : 'block' }}>
        <MobileTeamsHome />
      </Box>
    </>
  );
};
export default TeamsPage;
