import { Box, Typography } from '@mui/material';
import { consortiumLogo, punchKingLogoFooter } from '../../../assets';
import { colors } from '../../../theme/colors';

const Footer = () => {
  return (
    <>
      <Box
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
        <Typography
          sx={{
            color: colors.TextGrey,
          }}
        >
          powered by: consortium
        </Typography>
        <Box
          component={'img'}
          src={consortiumLogo}
          sx={{
            width: '1.75rem',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </Box>
    </>
  );
};
export default Footer;
