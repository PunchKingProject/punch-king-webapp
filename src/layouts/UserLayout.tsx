// ...imports unchanged
import { Box, Button, useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../pages/landing/components/Footer.tsx';
import Navbar from '../components/nav/Navbar.tsx';
import {
  closeMobileMenuIcon,
  openMobileMenuIcon,
  openProfileIcon,
  punchKingMobileLogo,
} from '../assets';
import ROUTES from '../routes/routePath.ts';

function UserMobileMenu() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const HOME = ROUTES.HOME ?? '/';
  const goHome = () => navigate(HOME);

  const handleNav = (path: string) => {
    setOpen(false);         // 👈 close main menu
    setProfileOpen(false);
    navigate(path);
  };

  const items = useMemo(
    () => [
      { name: 'Dashboard', path: '/user' },
      { name: 'My sponsorships', path: '/user/my-sponsorships' },
      { name: 'Inbox', path: '/user/inbox' },
    ],
    []
  );

  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('pk_token');
    localStorage.removeItem('rid');
    localStorage.removeItem('persist:root');
    sessionStorage.clear();
    setProfileOpen(false);
    navigate(ROUTES.SIGN_IN ?? '/', { replace: true });
  };

  return (
    <>
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
          component='img'
          src={open ? closeMobileMenuIcon : openMobileMenuIcon}
          alt='menu'
          sx={{ height: 34, cursor: 'pointer' }}
          onClick={() => {
            setOpen((v) => !v);
            setProfileOpen(false);
          }}
        />
        <Box
          component='img'
          src={punchKingMobileLogo}
          alt='Punch King'
          sx={{ height: 55, cursor: 'pointer' }}
          onClick={goHome}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goHome()}
        />
        <Box
          component='img'
          src={openProfileIcon}
          alt='Profile'
          sx={{ height: 40, cursor: 'pointer' }}
          onClick={() => {
            setProfileOpen((v) => !v);
            setOpen(false);
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

      {/* Main Menu */}
      {open && (
        <>
          <Box
            onClick={() => setOpen(false)}
            sx={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 49,
              right: 0,
              backgroundColor: '#1A1A1A',
              borderRadius: '10px',
              p: 2,
              px: '1.88em',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '20px',
              zIndex: 2,
              width: '100%',
              boxShadow: '0px 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            {items.map((it) => (
              <Button
                key={it.name}
                variant='outlined'
                onClick={() => handleNav(it.path)}
                sx={{
                  color: '#f0c040',
                  borderColor: '#f0c040',
                  width: 200,
                  borderRadius: '10px',
                  '&:hover': { backgroundColor: '#222', borderColor: '#fff' },
                }}
              >
                {it.name}
              </Button>
            ))}
          </Box>
        </>
      )}
    </>
  );
}

export default function UserLayout() {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      {isTabletUp ? (
        <>
          <Navbar />
          <Outlet />
          <Footer />
        </>
      ) : (
        <>
          <UserMobileMenu />
          <Outlet />
          <Footer />
        </>
      )}
    </>
  );
}
