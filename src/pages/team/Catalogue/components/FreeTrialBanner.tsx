import { Box, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  subbed: boolean;          // Boolean: true if they have a valid sub
  free_post_days: number;   // The countdown from your Go logic
  role: string;
}

const FreeTrialBanner = () => {
  const token = localStorage.getItem('token');

  if (!token) return null;

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const { subbed, free_post_days } = decoded;

    // Show ONLY if not subbed AND there are days left (or exactly 0)
    const shouldShow = !subbed && free_post_days >= 0;

    if (!shouldShow) return null;

    return (
      <Box
        sx={{
          backgroundColor: '#222',
          borderLeft: '5px solid #f0c040',
          py: 1.5,
          px: 3,
          mb: 3,
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.3)'
        }}
      >
        <Typography
          variant="body2"
          fontWeight="bold"
          sx={{ color: '#fff', textAlign: 'center', letterSpacing: '0.5px' }}
        >
          FREE CATALOGUE POSTING ENDS IN: {' '} DAYS
          <Box
            component="span"
            sx={{
              color: '#ff4d4d', // Red warning text
              ml: 1,
              fontSize: '1.1rem'
            }}
          >
            {free_post_days} {free_post_days === 1 ? 'DAY' : 'DAYS'}
          </Box>
        </Typography>
      </Box>
    );
  } catch {
    return null;
  }
};

export default FreeTrialBanner;