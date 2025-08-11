import { Box, Button, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  closeMobileMenuIcon,
  openMobileMenuIcon,
  openProfileIcon,
  punchKingMobileLogo,
} from '../assets';
import ROUTES from '../routes/routePath';
import Footer from '../pages/landing/components/Footer';
import Navbar from '../components/nav/Navbar';

const Adminlayout = () => {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box
        sx={{
          display: isTabletUp ? 'block' : 'none',
        }}
      >
        <AdminLayoutDesktop />
      </Box>
      <Box
        sx={{
          display: isTabletUp ? 'none' : 'block',
        }}
      >
        <AdminLayoutMobile />
      </Box>
    </>
  );
};
export default Adminlayout;

const AdminLayoutMobile = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      {/* Navbar */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          // border: '2px solid red',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 1.88em',
        }}
      >
        <Box
          component={'img'}
          src={menuOpen ? closeMobileMenuIcon : openMobileMenuIcon}
          alt='open Menu'
          sx={{
            height: '34px',
            cursor: 'pointer',
          }}
          onClick={toggleMenu}
        />
        <Box
          component={'img'}
          src={punchKingMobileLogo}
          alt='Punch King'
          sx={{
            height: '55px',
          }}
        />
        <Box
          component={'img'}
          src={openProfileIcon}
          alt='Punch King'
          sx={{
            height: '40px',
          }}
        />
      </Box>

      {/* Visible Dropdown  */}
      {/* Overlay */}
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
              // backgroundColor: 'green',
              zIndex: 1,
            }}
          />
          {/* Dropdown Menu */}
          <Box
            sx={{
              position: 'absolute',
              top: '49px',
              right: '0px',
              backgroundColor: '#1A1A1A',
              borderRadius: '10px',
              padding: 2,
              paddingLeft: '1.88em',
              paddingRight: '1.88em',

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
              {
                name: 'Teams',
                path: ROUTES.TEAMS,
              },
              {
                name: 'Users',

                path: ROUTES.USERS,
              },
              {
                name: 'Licensing',

                path: ROUTES.LICENSING,
              },
              {
                name: 'Subscription',

                path: ROUTES.SUBSCRIPTION,
              },

              {
                name: 'Sponsorships',
                path: ROUTES.SPONSORSHIP,
              },
            ].map((item) => (
              <Button
                key={item.name}
                variant='outlined'
                onClick={() => navigate(item.path)}
                sx={{
                  color: '#f0c040',
                  borderColor: '#f0c040',
                  width: '200px',
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: '#222',
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
      {/* AdminLayout Desktop */}
      <Outlet />
      <Footer />
    </>
  );
};
