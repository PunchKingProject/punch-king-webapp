import { Box, List, ListItem, useMediaQuery } from '@mui/material';
import { punchKingLogo } from '../../assets';
import { colors } from '../../theme/colors';
import CustomButton from '../buttons/CustomButton';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes/routePath';

const navList = [
  { text: 'About', color: colors.Milk },
  { text: 'Subscriptions', color: colors.Milk },
  { text: 'Ranking', color: colors.Milk },
  { text: 'Posts', color: colors.Milk },
  { text: 'Contacts', color: colors.Milk },
];
const MobileNavbar = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.88em',
        }}
      >
        <CustomButton
          color='primary'
          variant='text'
          onClick={() => navigate(`${ROUTES.SIGN_UP}?flow=sponsor`)}
        >
          Register
        </CustomButton>
        <Box
          component='img'
          src={punchKingLogo}
          alt='A Boxer with fist clenched'
          sx={{
            height: '105px',
            objectFit: 'cover',
          }}
        />
        <CustomButton
          textColor='white'
          variant='text'
          onClick={() => navigate(ROUTES.SIGN_IN)}
        >
          Login
        </CustomButton>
      </Box>
    </>
  );
};

const DesktopNavbar = () => {
    const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          // border: '2px solid red',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '1.88em',
          padding: '1.56em 5.38em',
          '@media (min-width:910px) and (max-width:1000px)': {
            padding: '1.56em 2em', // override between 900px and 1000px
          },
          '@media (min-width:1000px) and (max-width:1100px)': {
            // height: '200px',
            paddingX: '1em', // override between 900px and 1000px
          },
        }}
      >
        <CustomButton variant='text' color='primary' onClick={() => navigate(`${ROUTES.SIGN_UP}?flow=sponsor`)}>
          Register
        </CustomButton>
        <CustomButton
          variant='contained'
          color='primary'
          textColor={colors.AccentDark}
          onClick={() => navigate(ROUTES.SIGN_IN)}
        >
          Login
        </CustomButton>
      </Box>
      <Box
        display={'flex'}
        alignItems='center'
        justifyContent='space-between'
        sx={{
          padding: '0px 5.38em',
          '@media (min-width:900px) and (max-width:1000px)': {
            padding: '0px 2em', // override between 900px and 1000px
          },
          '@media (min-width:1000px) and (max-width:1100px)': {
            padding: '0px 1em', // override between 900px and 1000px
          },
          background: '#1A1A1A',
        }}
      >
        <Box
          sx={{
            height: 'fit-content',
            width: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxHeight: '50px',
            // zIndex:3
          }}
        >
          <Box
            component='img'
            src={punchKingLogo}
            alt='A Boxer with fist clenched'
            sx={{
              objectFit: 'cover',
              height: '250px',
              display: 'block',
              zIndex: 1,
              '@media (min-width:900px) and (max-width:1000px)': {
                height: '200px',
                // padding: '0px 2em', // override between 900px and 1000px
              },
              '@media (min-width:1000px) and (max-width:1100px)': {
                height: '200px',
                // padding: '0px 2em', // override between 900px and 1000px
              },
            }}
          />
        </Box>

        <Box>
          <List
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: '3vw',
              padding: '1em 0',
            }}
          >
            {navList.map((item, index) => {
              return (
                <ListItem
                  key={index}
                  sx={{
                    padding: '0',
                  }}
                >
                  <CustomButton textColor={item.color} variant='text'>
                    {item.text}
                  </CustomButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Box>
    </>
  );
};
const Navbar = () => {
  const isTabletUp = useMediaQuery('(min-width:910px)'); // md = 768px by default
  return <>{isTabletUp ? <DesktopNavbar /> : <MobileNavbar />}</>;
};
export default Navbar;
