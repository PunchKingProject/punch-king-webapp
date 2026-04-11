import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import DashboardSection from '../../../components/dashboards/DashboardSection';
import ROUTES from '../../../routes/routePath';
import { TEAM_SIDENAV_ITEMS } from '../../../utils/sidebarPresets';
import DesktopLicensePaymentForm from './components/DesktopLicensePaymentForm';

export default function DesktopLicensePaymentPage() {
  const navigate = useNavigate();

  return (
    <>
      <DashboardSection
        sidebarItems={TEAM_SIDENAV_ITEMS}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              component={RouterLink}
              to={ROUTES.TEAM} // or your dashboard root
              sx={{ color: '#A2A2A2', fontWeight: 600, fontSize: 16 }}
            >
              {' '}
              TEAM DASHBOARD
            </Typography>
            <Typography sx={{ color: '#A2A2A2' }}>/</Typography>
            <Typography
              component={RouterLink}
              to={ROUTES.MY_LICENSING ?? '/team/my-licensing'}
              sx={{ color: '#A2A2A2', fontWeight: 600, fontSize: 16 }}
            >
              LICENSING
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
        <Box sx={{ pt: 3 }} />
        {/* <Box
          sx={{
            p: '1.56em 6.98em',
            '@media (min-width:910px) and (max-width:1000px)': {
              p: '1.56em 2em',
              pl: '3em',
            },
            '@media (min-width:1000px) and (max-width:1100px)': {
              px: '1em',
              pl: '2rem',
            },
          }}
        > */}
        <DesktopLicensePaymentForm />
        {/* </Box> */}
      </DashboardSection>
    </>
  );
}
