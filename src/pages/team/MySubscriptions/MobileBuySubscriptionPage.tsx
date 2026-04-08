import { Box, Button, Typography, Link as MLink } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ROUTES from '../../../routes/routePath';
import MobileBuySubscriptionForm from './components/MobileBuySubscriptionForm';

const gold = '#EFAF00';

export default function MobileBuySubscriptionPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ px: 2, py: 2 }}>
      {/* Back */}
      <Button
        variant='outlined'
        onClick={() => navigate(-1)}
        size='small'
        sx={{
          borderColor: gold,
          color: gold,
          textTransform: 'none',
          mb: 2,
        }}
        startIcon={<ArrowBackIosNewIcon fontSize='small' />}
      >
        Back
      </Button>
      {/* Breadcrumb (TEAM DASHBOARD / SUBSCRIPTIONS) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 2 }}>
        <MLink
          component={RouterLink}
          to={ROUTES.TEAM}
          underline='none'
          sx={{ color: '#A2A2A2', fontWeight: 700, fontSize: 12 }}
        >
          TEAM DASHBOARD
        </MLink>
        <Typography sx={{ color: '#A2A2A2' }}>/</Typography>
        <MLink
          component={RouterLink}
          to={ROUTES.MY_SUBSCRIPTIONS}
          underline='none'
          sx={{ color: '#A2A2A2', fontWeight: 700, fontSize: 12 }}
        >
          SUBSCRIPTIONS
        </MLink>
      </Box>
      {/* Section title */}
      <Typography sx={{ color: '#A2A2A2', fontWeight: 700, fontSize: 12 }}>
        SUBSCRIPTION PAYMENT
      </Typography>
      <Box sx={{ mt: 2 }}>
        <MobileBuySubscriptionForm />
      </Box>
    </Box>
  );
}
