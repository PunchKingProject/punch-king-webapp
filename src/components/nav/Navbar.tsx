import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box, IconButton, List, ListItem, Menu, MenuItem, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { punchKingLogo } from '../../assets';
import { useAppDispatch } from '../../hooks.ts';
import ROUTES from '../../routes/routePath.ts';
import { logout } from '../../store/registration.slice.ts';
import { colors } from '../../theme/colors.ts';
import CustomButton from '../buttons/CustomButton.tsx';


type SectionKey = 'about' | 'subscriptions' | 'ranking' | 'posts' | 'contacts';
type NavProps = { onNav?: (key: SectionKey) => void };

const navList: Array<{ text: string; color: string; key: SectionKey }> = [
  { text: 'About', color: colors.Milk, key: 'about' },
  { text: 'Subscriptions', color: colors.Milk, key: 'subscriptions' },
  { text: 'Ranking', color: colors.Milk, key: 'ranking' },
  { text: 'Posts', color: colors.Milk, key: 'posts' },
  { text: 'Contacts', color: colors.Milk, key: 'contacts' }, // footer
];

const GOLD = '#EFAF00';
const CREAM = '#FFFCF4';
const OVERLAY = '#1F1F1F';
const BTN_H = 44; 


function useIsHome() {
  const { pathname } = useLocation();
  return pathname === '/';
}

function useLogout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return () => {
        dispatch(logout());

    // TODO: clear tokens/session here
    // e.g. localStorage.removeItem('auth'); queryClient.clear(); etc.
    navigate(ROUTES.SIGN_IN, { replace: true });
  };
}
// const MobileNavbar = () => {
//   const navigate = useNavigate();
//    const isHome = useIsHome();
//    const logout = useLogout();

//   return (
//     <>
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           padding: '0 1.88em',
//         }}
//       >
//         {isHome ? (
//           <CustomButton
//             color='primary'
//             variant='text'
//             onClick={() => navigate(`${ROUTES.SIGN_UP}?flow=sponsor`)}
//           >
//             Register
//           </CustomButton>
//         ) : (
//           <CustomButton variant='contained' color='primary' onClick={logout}>
//             Logout
//           </CustomButton>
//         )}
//         <Box
//           component='img'
//           src={punchKingLogo}
//           alt='A Boxer with fist clenched'
//           sx={{
//             height: '105px',
//             objectFit: 'cover',
//           }}
//         />
//         {isHome ? (
//           <CustomButton
//             textColor='white'
//             variant='text'
//             onClick={() => navigate(ROUTES.SIGN_IN)}
//           >
//             Login
//           </CustomButton>
//         ) : (
//           <IconButton sx={{ color: colors.Accent }} aria-label='account'>
//             <AccountCircleIcon />
//             <ArrowDropDownIcon />
//           </IconButton>
//         )}
//       </Box>
//     </>
//   );
// };


const DesktopNavbar: React.FC<NavProps>  = ({ onNav}) => {
  const navigate = useNavigate();
  const isHome = useIsHome();
  const logout = useLogout();

  const HOME = ROUTES.HOME ?? '/';
  const goHome = () => navigate(HOME);

  // NEW: register menu state
  const [regAnchor, setRegAnchor] = useState<HTMLElement | null>(null);
  const regOpen = Boolean(regAnchor);
  const handleOpenRegister = (e: React.MouseEvent<HTMLElement>) =>
    setRegAnchor(e.currentTarget);
  const handleCloseRegister = () => setRegAnchor(null);

  const goToRegister = (flow: 'team' | 'sponsor') => {
    const url =
      flow === 'team'
        ? `${ROUTES.SIGN_UP}?flow=team`
        : `${ROUTES.SIGN_UP}?flow=sponsor`;
    navigate(url);
  };
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
        {isHome ? (
          <>
            <CustomButton
              variant='text'
              color='primary'
              onClick={handleOpenRegister}
            >
              Register
            </CustomButton>
            <RegisterMenu
              anchorEl={regAnchor}
              open={regOpen}
              onClose={handleCloseRegister}
              onChoose={goToRegister}
            />
            <CustomButton
              variant='contained'
              color='primary'
              textColor={colors.AccentDark}
              onClick={() => navigate(ROUTES.SIGN_IN)}
            >
              Login
            </CustomButton>
          </>
        ) : (
          <>
            <CustomButton
              variant='contained'
              color='primary'
              textColor={colors.AccentDark}
              onClick={logout}
            >
              Logout
            </CustomButton>
            <IconButton sx={{ color: colors.Accent }} aria-label='account'>
              <AccountCircleIcon />
              <ArrowDropDownIcon />
            </IconButton>
          </>
        )}
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
            onClick={goHome}
            role='button'
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goHome()}
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
                  <CustomButton
                    textColor={item.color}
                    variant='text'
                    onClick={() => onNav?.(item.key)}
                  >
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


// Reusable register menu
type RegisterMenuProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onChoose: (flow: 'team' | 'sponsor') => void;
};

function RegisterMenu({
  anchorEl,
  open,
  onClose,
  onChoose,
}: RegisterMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      PaperProps={{
        sx: {
          bgcolor: OVERLAY,
          borderRadius: 3, // more rounded like the mock
          overflow: 'visible',
          boxShadow: '0 12px 36px rgba(0,0,0,0.55)',
          p: { xs: 2, md: 3 },
          // minWidth: { xs: 300, md: 420 },
        },
      }}
      MenuListProps={{
        disablePadding: true,
        sx: { display: 'grid', gap: 2 },
      }}
    >
      {/* Gold pill: Register as Boxing team */}
      <MenuItem
        disableRipple
        onClick={() => {
          onClose();
          onChoose('team');
        }}
        sx={{
          bgcolor: GOLD,
          color: '#C28E02',
          fontWeight: 600,
          fontSize: { xs: 16, md: 18 },
          borderRadius: 2,
          py: { xs: 1.75, md: 2 },
          height: BTN_H, // ⬅️ same height as Login
          minHeight: BTN_H, // override MUI default MenuItem minHeight
          // px: 0,
          justifyContent: 'center',
          '&:hover': { bgcolor: GOLD }, // keep flat (no hover color shift)
          '&.Mui-focusVisible': { bgcolor: GOLD },
        }}
      >
        Register as Boxing team
      </MenuItem>

      {/* Cream pill: Register as sponsor */}
      <MenuItem
        disableRipple
        onClick={() => {
          onClose();
          onChoose('sponsor');
        }}
        sx={{
          bgcolor: CREAM,
          color: GOLD,
          fontWeight: 600,
          fontSize: { xs: 16, md: 18 },
          borderRadius: 2,
          height: BTN_H, // ⬅️ same height as Login
          minHeight: BTN_H, // override MUI default MenuItem minHeight
          py: { xs: 1.75, md: 2 },
          // px: 3,
          justifyContent: 'center',
          '&:hover': { bgcolor: CREAM },
          '&.Mui-focusVisible': { bgcolor: CREAM },
        }}
      >
        Register as sponsor
      </MenuItem>
    </Menu>
  );
}


const MobileNavbar: React.FC<NavProps> = () => {
  const navigate = useNavigate();
  const isHome = useIsHome();
  const logout = useLogout();
  const HOME = ROUTES.HOME ?? '/';
  const goHome = () => navigate(HOME);

  // NEW: register menu state
  const [regAnchor, setRegAnchor] = useState<HTMLElement | null>(null);
  const regOpen = Boolean(regAnchor);
  const handleOpenRegister = (e: React.MouseEvent<HTMLElement>) =>
    setRegAnchor(e.currentTarget);
  const handleCloseRegister = () => setRegAnchor(null);

  // One place to decide the URLs
  const goToRegister = (flow: 'team' | 'sponsor') => {
    const url =
      flow === 'team'
        ? `${ROUTES.SIGN_UP}?flow=team`
        : `${ROUTES.SIGN_UP}?flow=sponsor`;
    navigate(url);
  };

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
        {isHome ? (
          <>
            <CustomButton
              color='primary'
              variant='text'
              onClick={handleOpenRegister}
            >
              Register
            </CustomButton>
            <RegisterMenu
              anchorEl={regAnchor}
              open={regOpen}
              onClose={handleCloseRegister}
              onChoose={goToRegister}
            />
          </>
        ) : (
          <CustomButton variant='contained' color='primary' onClick={logout}>
            Logout
          </CustomButton>
        )}

        <Box
          component='img'
          src={punchKingLogo}
          alt='A Boxer with fist clenched'
          sx={{ height: '105px', objectFit: 'cover' }}
          onClick={goHome}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goHome()}
        />

        {isHome ? (
          <CustomButton
            textColor='white'
            variant='text'
            onClick={() => navigate(ROUTES.SIGN_IN)}
          >
            Login
          </CustomButton>
        ) : (
          <IconButton sx={{ color: colors.Accent }} aria-label='account'>
            <AccountCircleIcon />
            <ArrowDropDownIcon />
          </IconButton>
        )}
      </Box>
    </>
  );
};



const Navbar: React.FC<NavProps> = (props) => {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      {isTabletUp ? <DesktopNavbar {...props} /> : <MobileNavbar {...props} />}
    </>
  );
};
export default Navbar;
