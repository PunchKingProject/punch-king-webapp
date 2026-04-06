import { Box, Button, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link as RouterLink, useNavigate } from 'react-router-dom';


import DesktopBuySponsorsForm from './components/DesktopBuySponsorsForm.tsx';
import DashboardSection from '../../../components/dashboards/DashboardSection.tsx';
import { USER_SIDENAV_ITEMS } from '../../../utils/sidebarPresets.ts';
import ROUTES from '../../../routes/routePath.ts';

export default function DesktopBuySponsorsPage() {
  const navigate = useNavigate();

  return (
    <>
      <DashboardSection
        sidebarItems={USER_SIDENAV_ITEMS}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              component={RouterLink}
              to={ROUTES.USER_MY_SPONSORSHIPS}
              sx={{ color: '#A2A2A2', fontWeight: 600, fontSize: 16 }}
            >
              USER DASHBOARD
            </Typography>
            <Typography sx={{ color: '#A2A2A2' }}>/</Typography>
            <Typography
              component={RouterLink}
              to={ROUTES.USER_MY_SPONSORSHIPS}
              sx={{ color: '#A2A2A2', fontWeight: 600, fontSize: 16 }}
            >
              SPONSORSHIPS
            </Typography>
            <Typography sx={{ color: '#A2A2A2' }}>/</Typography>
            <Typography
              sx={{ color: '#FFFCF4', fontWeight: 700, fontSize: 16 }}
            >
              BUY SPONSORS
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
        {/* form area padding to match user pages */}
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
        <DesktopBuySponsorsForm />
        {/* </Box> */}
      </DashboardSection>

      {/* main content under the section header */}
    </>
  );
}
