import { Box, Button, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import DashboardSection from '../../../components/dashboards/DashboardSection.tsx';
import { TEAM_SIDENAV_ITEMS } from '../../../utils/sidebarPresets.ts';
import ROUTES from '../../../routes/routePath.ts';
import DesktopBuySubscriptionForm from './components/DesktopBuySubscriptionForm.tsx';

export default function DesktopBuySubscriptionPage() {
  const navigate = useNavigate();

  return (
    <>
      <DashboardSection
        sidebarItems={TEAM_SIDENAV_ITEMS}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              component={RouterLink}
              to={ROUTES.TEAM}
              sx={{ color: '#A2A2A2', fontWeight: 600, fontSize: 16 }}
            >
              TEAM DASHBOARD
            </Typography>
            <Typography sx={{ color: '#A2A2A2' }}>/</Typography>
            <Typography
              component={RouterLink}
              to={ROUTES.MY_SUBSCRIPTIONS}
              sx={{ color: '#A2A2A2', fontWeight: 600, fontSize: 16 }}
            >
              SUBSCRIPTIONS
            </Typography>
            <Typography sx={{ color: '#A2A2A2' }}>/</Typography>
            <Typography
              sx={{ color: '#FFFCF4', fontWeight: 700, fontSize: 16 }}
            >
              PAYMENTS
            </Typography>
          </Box>
        }
        toolbar={
          <Button
            variant='outlined'
            onClick={() => navigate(-1)}
            size='small'
            sx={{
              borderColor: '#EFAF00',
              color: '#EFAF00',
              textTransform: 'none',
              ml: 1,
            }}
            startIcon={<ArrowBackIosNewIcon fontSize='small' />}
          >
            Back
          </Button>
        }
      >
        <DesktopBuySubscriptionForm />
      </DashboardSection>
    </>
  );
}
