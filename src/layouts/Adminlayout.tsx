// ...imports unchanged
import { Box, Button, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  closeMobileMenuIcon,
  openMobileMenuIcon,
  openProfileIcon,
  punchKingMobileLogo,
} from '../assets';
import ROUTES from '../routes/routePath.ts';
import Footer from '../pages/landing/components/Footer.tsx';
import Navbar from '../components/nav/Navbar.tsx';

const Adminlayout = () => {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <AdminLayoutDesktop />
      </Box>
      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <AdminLayoutMobile />
      </Box>
    </>
  );
};
export default Adminlayout;

const AdminLayoutMobile = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

   const handleNav = (path: string) => {
     setMenuOpen(false); // 👈 close menu immediately
     setProfileOpen(false);
     navigate(path);
   };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('pk_token');
    localStorage.removeItem('rid');
    localStorage.removeItem('persist:root');
    sessionStorage.clear();
    setProfileOpen(false);
    navigate(ROUTES.SIGN_IN ?? '/sign-in', { replace: true });
  };

  return (
    <>
      {/* Navbar */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 1.88em',
          position: 'relative',
          zIndex: 3,
        }}
      >
        <Box
          component={'img'}
          src={menuOpen ? closeMobileMenuIcon : openMobileMenuIcon}
          alt='open Menu'
          sx={{ height: '34px', cursor: 'pointer' }}
          onClick={toggleMenu}
        />
        <Box
          component={'img'}
          src={punchKingMobileLogo}
          alt='Punch King'
          sx={{ height: '55px' }}
        />
        <Box
          component={'img'}
          src={openProfileIcon}
          alt='Profile'
          sx={{ height: '40px', cursor: 'pointer' }}
          onClick={() => {
            setProfileOpen((v) => !v);
            setMenuOpen(false);
          }}
        />
      </Box>

      {/* Profile Dropdown */}
      {profileOpen && (
        <>
          <Box
            onClick={() => setProfileOpen(false)}
            sx={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 2,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 56,
              right: 12,
              backgroundColor: '#1A1A1A',
              border: '1px solid #3B3B3B',
              borderRadius: '10px',
              p: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              zIndex: 3,
              width: 180,
              boxShadow: '0px 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            <Button
              variant='outlined'
              onClick={handleLogout}
              sx={{
                color: '#f0c040',
                borderColor: '#f0c040',
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#222', borderColor: '#fff' },
              }}
            >
              Logout
            </Button>
          </Box>
        </>
      )}

      {/* Visible Dropdown (Main menu) */}
      {menuOpen && (
        <>
          <Box
            onClick={toggleMenu}
            sx={{
              position: 'fixed',
              top: '200px',
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '49px',
              right: '0px',
              backgroundColor: '#1A1A1A',
              borderRadius: '10px',
              p: 2,
              px: '1.88em',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: '20px',
              zIndex: 2,
              width: '100%',
              boxShadow: '0px 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            {[
              { name: 'Dashboard', path: ROUTES.ADMIN },
              { name: 'Teams', path: ROUTES.TEAMS },
              { name: 'Users', path: ROUTES.USERS },
              { name: 'Licensing', path: ROUTES.LICENSING },
              { name: 'Subscription', path: ROUTES.SUBSCRIPTION },
              { name: 'Sponsorships', path: ROUTES.SPONSORSHIP },
            ].map((item) => (
              <Button
                key={item.name}
                variant='outlined'
                onClick={() => handleNav(item.path)}
                disabled={isActiveRoute(item.path)}
                sx={{
                  color: isActiveRoute(item.path) ? '#000' : '#f0c040',
                  borderColor: '#f0c040',
                  width: '200px',
                  borderRadius: '10px',
                  backgroundColor: isActiveRoute(item.path)
                    ? '#f0c040'
                    : 'transparent',
                  fontWeight: isActiveRoute(item.path) ? 600 : 500,
                  '&:hover': {
                    backgroundColor: isActiveRoute(item.path)
                      ? '#f0c040'
                      : '#222',
                    borderColor: '#fff',
                  },
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
        </>
      )}

      <Outlet />
      <Footer />
    </>
  );
};

const AdminLayoutDesktop = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};
