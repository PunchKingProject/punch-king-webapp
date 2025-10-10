import { Box, Typography } from '@mui/material';
import MobileLicensePaymentForm from './MobileLicensePaymentForm';
import { Link as RouterLink } from 'react-router-dom';
import ROUTES from '../../../routes/routePath';

const crumbLinkSx = {
  color: '#A2A2A2',
  fontWeight: 700,
  fontSize: 12,
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
};
const sepSx = { color: '#A2A2A2', fontSize: 12, mx: 0.5 };

export default function MobileLicensePaymentPage() {
  return (
    <Box sx={{ px: 2, py: 2 }}>
      {/* breadcrumb label per mobile design */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography component={RouterLink} to={ROUTES.TEAM} sx={crumbLinkSx}>
          TEAM DASHBOARD
        </Typography>
        <Typography sx={sepSx}>/</Typography>
        <Typography
          component={RouterLink}
          to={ROUTES.MY_LICENSING}
          sx={crumbLinkSx}
        >
          LICENSING
        </Typography>
        <Typography sx={sepSx}>/</Typography>
        <Typography sx={{ color: '#FFFCF4', fontWeight: 700, fontSize: 12 }}>
          PAYMENTS
        </Typography>
      </Box>

      <Typography
        component='h1'
        sx={{ color: '#fff', fontWeight: 900, fontSize: 16, mb: 1.5 }}
      >
        LICENSE PAYMENT
      </Typography>

      <MobileLicensePaymentForm />
    </Box>
  );
}
