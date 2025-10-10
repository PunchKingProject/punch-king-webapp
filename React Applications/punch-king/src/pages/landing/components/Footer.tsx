import { Box, Typography } from '@mui/material';
import { consortiumLogo, punchKingLogoFooter } from '../../../assets';
import { colors } from '../../../theme/colors';
import { useLocation } from 'react-router-dom';
import ROUTES from '../../../routes/routePath';

const Footer = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/' || pathname === ROUTES.HOME;
  return (
    <>
      <Box
        id='contacts'
        textAlign={'center'}
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          background: colors.Card,
        }}
      >
        <Box
          component={'img'}
          src={punchKingLogoFooter}
          sx={{
            width: '10.125rem',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <Typography
          sx={{
            color: colors.Freeze,
          }}
        >
          License No: NBBofC/24/030
        </Typography>
        {isHome && (
          <>
            <Typography sx={{ color: colors.TextGrey }}>
              Technology partners, consortium
            </Typography>
            <Box
              component='img'
              src={consortiumLogo}
              alt='Technology partner consortium'
              sx={{ width: '1.75rem', objectFit: 'cover', display: 'block' }}
            />
          </>
        )}
      </Box>
    </>
  );
};
export default Footer;
