// ...imports unchanged
import { Box, Button, Divider, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  closeMobileMenuIcon,
  openMobileMenuIcon,
  openProfileIcon,
  punchKingMobileLogo,
} from '../assets';
import Navbar from '../components/nav/Navbar';
import Footer from '../pages/landing/components/Footer';
import ROUTES from '../routes/routePath';
import { readClaimsFromStorage } from '../utils/jwt';

function TeamMobileMenu() {


  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const HOME = ROUTES.HOME ?? '/';
  const goHome = () => navigate(HOME);
  const handleNav = (path: string) => {
    setOpen(false); // 👈 close main menu
    setProfileOpen(false); // 👈 also close profile dropdown just in case
    navigate(path);
  };

  const items = useMemo(
    () => [
      { name: 'Dashboard', path: '/team' },
      { name: 'Catalogue', path: '/team/catalogue' },
      { name: 'My subscriptions', path: '/team/my-subscriptions' },
      { name: 'My licensing', path: '/team/my-licensing' },
      { name: 'My sponsorship', path: '/team/my-sponsorship' },
      { name: 'Inbox', path: '/team/inbox' },
    ],
    []
  );

  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    // Clear your auth state / tokens here
    localStorage.removeItem('pk_token');
    localStorage.removeItem('rid');
    localStorage.removeItem('persist:root'); // if using redux-persist
    sessionStorage.clear();
    setProfileOpen(false);
    navigate(ROUTES.SIGN_IN ?? '/sign-in', { replace: true });
  };

  // inside TeamMobileMenu component (top, before return)
  // inside TeamMobileMenu component
  const claims = useMemo(() => readClaimsFromStorage('token'), []);
  const displayName = claims?.name?.trim() || 'there';
  const roleLabel = (claims?.role || 'Team')
    .toString()
    .replace(/^\w/, (c) => c.toUpperCase());
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
            {/* Add more profile actions here if needed */}
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Hello, {displayName}!
            </Typography>
            <Typography sx={{ color: '#A2A2A2', fontSize: 12, mb: 0.5 }}>
              {roleLabel}
            </Typography>
            <Divider sx={{ borderColor: '#3B3B3B', my: 0.5 }} />
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
            >Logout</Button>
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

export default function TeamLayout() {
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
          <TeamMobileMenu />
          <Outlet />
          <Footer />
        </>
      )}
    </>
  );
}
