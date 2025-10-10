import { Box, Button, Link, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MobileBuySponsorsForm from './components/MobileBuySponsorsForm';
import ROUTES from '../../../routes/routePath';

export default function MobileBuySponsorsPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ px: 2, py: 2 }}>
      {/* Back */}
      <Button
        onClick={() => navigate(-1)}
        size='small'
        startIcon={<ArrowBackIosNewIcon fontSize='small' />}
        sx={{
          color: '#EFAF00',
          textTransform: 'none',
          fontWeight: 700,
          px: 0,
          '&:hover': { background: 'transparent' },
        }}
      >
        Back
      </Button>

      {/* Breadcrumb */}
      <Box
        component='nav'
        aria-label='breadcrumb'
        sx={{ mt: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Link
          component={RouterLink}
          to={ROUTES.USER_MY_SPONSORSHIPS}
          underline='none'
          sx={{
            color: '#A2A2A2',
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 0.2,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          USER DASHBOARD
        </Link>

        <Typography sx={{ mx: 0.75, color: '#A2A2A2' }}>/</Typography>

        <Link
          component={RouterLink}
          to={ROUTES.USER_MY_SPONSORSHIPS}
          underline='none'
          sx={{
            color: '#A2A2A2',
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 0.2,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          SPONSORSHIPS
        </Link>

        <Typography sx={{ mx: 0.75, color: '#A2A2A2' }}>/</Typography>

        <Typography
          sx={{
            color: '#FFFCF4',
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: 0.2,
          }}
        >
          BUY SPONSORS
        </Typography>
      </Box>

      <MobileBuySponsorsForm />
    </Box>
  );
}
