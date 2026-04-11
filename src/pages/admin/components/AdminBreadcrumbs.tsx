import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/buttons/CustomButton';
import { colors } from '../../../theme/colors';

type AdminBreadCrumbsProps = {
  /** The only clickable segment */
  rootLabel: string; // e.g., "TEAMS DASHBOARD"
  rootTo: string; // e.g., ROUTES.TEAMS

  /** Current page label (non-clickable) */
  currentLabel: string;

  /** Optional separator (defaults to " / ") */
  separator?: string | ReactNode;
};

export default function AdminBreadCrumbs({
  rootLabel,
  rootTo,
  currentLabel,
  separator = ' / ',

}: AdminBreadCrumbsProps) {


  const navigate = useNavigate()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 1,
        mb:2,
      }}
    >
      <Typography
        component={NavLink}
        to={rootTo}
        sx={{
          color: '#f0c040',
          fontWeight: 700,
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        {rootLabel}
      </Typography>
      <Typography component='span' sx={{ mx: 0.5, opacity: 0.7 }}>
        {separator}
      </Typography>
      <Typography component='span' sx={{ color: '#EDEDED', fontWeight: 700 }}>
        {currentLabel}
      </Typography>
      <CustomButton variant='contained' color='primary' textColor={colors.AccentDark} sx={{
        ml: 2
      }} onClick={
        () => navigate(-1)
      
      }>Back</CustomButton>
    </Box>
  );
}
