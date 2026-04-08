
import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { colors } from '../../theme/colors';

type Props = {
  rootLabel: string; // e.g. "TEAMS DASHBOARD"
  rootTo: string; // e.g. ROUTES.TEAMS
  currentLabel: string; // e.g. "TEAM DETAILS"
  separator?: ReactNode; // defaults to " / "
};

function MobileBreadCrumbs({
  rootLabel,
  rootTo,
  currentLabel,
  separator = ' / ',
}: Props) {
 

  const navigate = useNavigate();

  return (
    <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
      {/* Back text button */}
      <Typography
        role='button'
        tabIndex={0}
        onClick={() => {
          // go back; if no history, go to the rootTo
          if (window.history.length > 1) navigate(-1);
          else navigate(rootTo);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (window.history.length > 1) navigate(-1);
            else navigate(rootTo);
          }
        }}
        sx={{
          color: colors.Accent ?? '#F6C10A',
          fontWeight: 700,
          cursor: 'pointer',
          mb: 1,
          width: 'fit-content',
        }}
      >
        Back
      </Typography>
      {/* Breadcrumb row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Typography
          component={NavLink}
          to={rootTo}
          sx={{
            color: colors.Freeze,
            textDecoration: 'none',
            fontWeight: 800,
            letterSpacing: 0.2,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {rootLabel}
        </Typography>

        <Typography
          component='span'
          sx={{ color: colors.Freeze, opacity: 0.75 }}
        >
          {separator}
        </Typography>

        <Typography
          component='span'
          sx={{
            color: colors.Freeze,
            fontWeight: 900,
            textTransform: 'uppercase',
          }}
        >
          {currentLabel}
        </Typography>
      </Box>
    </Box>
  );
}

export default MobileBreadCrumbs;
