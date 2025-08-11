import { Box, Button, Typography } from '@mui/material';
import {
  closeMobileMenuIcon,
  openMobileMenuIcon,
  openProfileIcon,
  punchKingMobileLogo,
} from '../../../assets';
import { useEffect, useRef, useState } from 'react';
import { colors } from '../../../theme/colors';
import { ScrollableSection } from './ScrollableSection';

const data = [
  { title: 'All Users', total: 200, percentage: '30', status: true },
  { title: 'All Team', total: 200, percentage: '30', status: false },
  { title: 'Subscription Volume', total: 200, percentage: '30', status: true },
  { title: 'Licensing Volume', total: 200, percentage: '30', status: false },
  { title: 'Sponsorship Volume', total: 200, percentage: '30', status: true },
];

type Team = {
  team_name: string;
  license_no: string;
  sponsors_accrued: number;
  ranking: string;
};

type UserSponsorship = {
  user_name: string;
  phone_number: string;
  sponsors_purchased: number;
  sponsors_used: number;
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const secondCardRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (secondCardRef.current) {
      secondCardRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
      });
    }
  }, []);
  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          border: '2px solid red',
          justifyContent: 'space-between',
          alignItems: 'center',
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
            height: '45px',
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


          
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          border: '2px solid red',
          overflow: 'auto',
          flexDirection: 'row',
          width: '100%',
          gap: '40px    ',
        }}
      >
        {data.map((item, index) => {
          return (
            <Box
              key={item.title}
              ref={index === 1 ? secondCardRef : null}
              sx={{
                background: colors.Card,
                minWidth: '230px',
                width: '110vw',
                maxWidth: '489px',
                border: '1px solid #3B3B3B',
                height: '135px',
                borderRadius: '10px',
                boxShadow: '2px 2px 10px 2px #2B2B2BB0',
                padding: '20px 10px',
                gap: '25px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant='mediumHeaderBold'
                component={'p'}
                sx={{
                  textTransform: 'uppercase',
                  color: colors.Freeze,
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant='bodyTextMilkDefault'
                component={'p'}
                sx={{
                  fontWeight: 700,
                  color: colors.Freeze,
                }}
              >
                {item.total}
              </Typography>
              <Box
                sx={{
                  border: '2px solid red',
                  width: '100%',
                  textAlign: 'right',
                }}
              >
                <Typography
                  variant='bodyTextMilkDefault'
                  component={'p'}
                  sx={{
                    fontWeight: 500,
                    color: item.status ? colors.Success : colors.Caution,
                  }}
                >
                  {`You have ${item.percentage}% ${
                    item.status ? 'climbed ' : 'dip'
                  }`}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <ScrollableSection<Team>
        title='TEAMS by ranking'
        items={[
          {
            team_name: 'King of the jungle',
            license_no: 'LC4835379',
            sponsors_accrued: 2000,
            ranking: '1st',
          },
          {
            team_name: 'Shadow Force',
            license_no: 'LC7483921',
            sponsors_accrued: 1950,
            ranking: '2nd',
          },
          {
            team_name: 'Iron Wolves',
            license_no: 'LC3029584',
            sponsors_accrued: 1880,
            ranking: '3rd',
          },
          {
            team_name: 'Storm Breakers',
            license_no: 'LC1223484',
            sponsors_accrued: 1700,
            ranking: '4th',
          },
          {
            team_name: 'Dark Phantoms',
            license_no: 'LC9982734',
            sponsors_accrued: 1600,
            ranking: '5th',
          },
          {
            team_name: 'Titan Crew',
            license_no: 'LC1273847',
            sponsors_accrued: 1500,
            ranking: '6th',
          },
          {
            team_name: 'Jungle Beasts',
            license_no: 'LC8736452',
            sponsors_accrued: 1400,
            ranking: '7th',
          },
          {
            team_name: 'Savage Squad',
            license_no: 'LC8341234',
            sponsors_accrued: 1300,
            ranking: '8th',
          },
          {
            team_name: 'Rebel Core',
            license_no: 'LC6483921',
            sponsors_accrued: 1200,
            ranking: '9th',
          },
          {
            team_name: 'Lone Lions',
            license_no: 'LC1293847',
            sponsors_accrued: 1100,
            ranking: '10th',
          },
        ]}
        fields={[
          { key: 'team_name', label: 'Team name' },
          { key: 'license_no', label: 'License No' },
          { key: 'sponsors_accrued', label: 'Sponsors accrued' },
          { key: 'ranking', label: 'Ranking' },
        ]}
        searchKeys={['team_name', 'license_no']}
        searchPlaceholder='Search by team or license...'
      />

      <ScrollableSection<UserSponsorship>
        title='Users by sponsorships'
        items={[
          {
            user_name: 'omega 1',
            phone_number: '08036123426',
            sponsors_purchased: 2000,
            sponsors_used: 1000,
          },
          {
            user_name: 'omega 1',
            phone_number: '08036123426',
            sponsors_purchased: 2000,
            sponsors_used: 1000,
          },
        ]}
        fields={[
          { key: 'user_name', label: 'User name' },
          { key: 'phone_number', label: 'Phone number' },
          { key: 'sponsors_purchased', label: 'Sponsors purchased' },
          { key: 'sponsors_used', label: 'Sponsors used' },
        ]}
        searchKeys={['user_name', 'phone_number']}
        searchPlaceholder='Search by username or phone number...'
      />

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
              right: '10px',
              backgroundColor: '#1A1A1A',
              borderRadius: '10px',
              padding: 2,
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
              'Teams',
              'Users',
              'Licensing',
              'Subscription',
              'Sponsorships',
            ].map((item) => (
              <Button
                key={item}
                variant='outlined'
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
                {item}
              </Button>
            ))}
          </Box>
        </>
      )}
    </>
  );
};
export default Navbar;
