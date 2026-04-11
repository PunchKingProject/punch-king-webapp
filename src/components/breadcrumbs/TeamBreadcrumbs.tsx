import { Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

type Props = {
  rootLabel: string; // e.g. "TEAM DASHBOARD"
  rootTo: string; // e.g. "/team"
  currentLabel: string; // e.g. "CATALOGUE"
};

const textSx = {
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 600,
  fontSize: 16,
  lineHeight: 1, // 100%
  letterSpacing: 0,
  color: '#A2A2A2',
};

export default function TeamBreadcrumbs({
  rootLabel,
  rootTo,
  currentLabel,
}: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Box
        component={RouterLink}
        to={rootTo}
        sx={{ ...textSx, textDecoration: 'none' }}
      >
        {rootLabel}
      </Box>

      <Box component='span' sx={{ ...textSx, mx: 0.5 }}>
        /
      </Box>

      <Box component='span' sx={textSx}>
        {currentLabel}
      </Box>
    </Box>
  );
}
