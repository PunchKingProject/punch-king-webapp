import { Box, Typography } from '@mui/material';
import DashboardSection from '../../../components/dashboards/DashboardSection';
import { TEAM_SIDENAV_ITEMS } from '../../../utils/sidebarPresets';

const contentPaddingSx = {
  padding: '1.56em 6.98em',
  '@media (min-width:910px) and (max-width:1000px)': {
    padding: '1.56em 2em',
    pl: '3em',
  },
  '@media (min-width:1000px) and (max-width:1100px)': {
    paddingX: '1em',
    pl: '2rem',
  },
};

export default function DesktopInboxPage() {
  return (
    <>
      <DashboardSection title='INBOX' sidebarItems={TEAM_SIDENAV_ITEMS} />
      <Box sx={contentPaddingSx}>
        {/* replace this with your real inbox content */}
        <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
          Messages & Notifications
        </Typography>
      </Box>
    </>
  );
}
