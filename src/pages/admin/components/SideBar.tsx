import { Box, Button } from '@mui/material';
import { colors } from '../../../theme/colors.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import ROUTES from '../../../routes/routePath.ts';

const items = [
  { label: 'Teams', path: ROUTES.TEAMS },
  { label: 'Users', path: ROUTES.USERS },
  { label: 'Licensing', path: ROUTES.LICENSING },
  { label: 'Subscription', path: ROUTES.SUBSCRIPTION },
  { label: 'Sponsorships', path: ROUTES.SPONSORSHIP },
];

const SideBar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate()

    const isActive = (to: string) =>
    pathname === to || pathname.startsWith(to + '/'); // allow subroutes to highlight



  return (
    <>
      <Box
        sx={{
          // border: '2px solid green',
          backgroundColor: colors.Card,
          paddingLeft: '6.98em',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          '@media (min-width:900px) and (max-width:1000px)': {
            px: '3em',
            paddingLeft: '3em', // override between 900px and 1000px
            // border: '2px solid orange',
          },
          '@media (min-width:1000px) and (max-width:1100px)': {
            // height: '200px',
            px: '2rem',
            paddingLeft: '2em', // override between 900px and 1000px
            // border: '2px solid yellow',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            // mt: 4
            position: 'relative',
            zIndex: 1,
            py: 3
          }}
        >
          {items.map((item) => {
            const active = isActive(item.path);
            return (
            <Button
              key={item.label}
              variant='outlined'
              onClick={() => navigate(item.path)}
              sx={{
                color: active ? '#fff' : '#f0c040',
                borderColor: active ? '#fff':'#f0c040',
                width: '200px',
                py: 1,
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: '#222',
                  borderColor: '#fff',
                },
              }}
            >
              {item.label}
            </Button>
          )})}
        </Box>
      </Box>
    </>
  );
};
export default SideBar;
