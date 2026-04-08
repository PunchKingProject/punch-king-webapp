import { useNavigate } from 'react-router-dom';
import DashboardSection from '../../../components/dashboards/DashboardSection';
import TeamBreadcrumbs from '../../../components/breadcrumbs/TeamBreadcrumbs';
import ROUTES from '../../../routes/routePath';
import { TEAM_SIDENAV_ITEMS } from '../../../utils/sidebarPresets';
import { Box, Button } from '@mui/material';
import UploadMediaForm from './components/UploadMediaForm';



function DesktopUploadMediaPage() {
  const navigate = useNavigate();

  return (
    <>
      <DashboardSection
        title={
          <TeamBreadcrumbs
            rootLabel='TEAM DASHBOARD'
            rootTo={ROUTES.TEAM}
            currentLabel='CATALOGUE / UPLOAD MEDIA'
          />
        }
        sidebarItems={TEAM_SIDENAV_ITEMS}
        toolbar={
          <Button
            onClick={() => navigate(-1)}
            variant='outlined'
            sx={{
              bgcolor: '#f0c040',
              color: '#EFAF00',
              textTransform: 'none',
              fontWeight: 700,
              // px: 2,
              
              borderRadius: '8px',
              '&:hover': { bgcolor: '#ffd465' },
              mb: 2,
            }}
          >Back</Button>
        }
      >
        <Box>
          <UploadMediaForm />
        </Box>
      </DashboardSection>
    </>
  );
}

export default DesktopUploadMediaPage;
