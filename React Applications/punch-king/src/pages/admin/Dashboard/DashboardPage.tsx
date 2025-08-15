import { Box, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useRef } from 'react';
import { colors } from '../../../theme/colors';
import { ScrollableSection } from '../components/ScrollableSection';
import {
  teamData,
  teamFieldData,
  userSponsorshipData,
  userSponsorshipFieldData,
} from '../data';
import AdminSection from '../components/AdminSection';
import PaginatedTable, {
  type TableColumn,
} from '../../../components/tables/PaginatedTable';
import type { MetricCard } from '../components/CardGrid';

const data = [
  { title: 'All Users', total: 200, percentage: '30', status: true },
  { title: 'All Team', total: 200, percentage: '30', status: false },
  { title: 'Subscription Volume', total: 200, percentage: '30', status: true },
  { title: 'Licensing Volume', total: 200, percentage: '30', status: false },
  { title: 'Sponsorship Volume', total: 200, percentage: '30', status: true },
];

const teamColumns: TableColumn<Team>[] = [
  { field: 'team_name', header: 'Team name' },
  { field: 'license_no', header: 'License number' },
  { field: 'sponsors_accrued', header: 'Sponsors accrued', align: 'right' },
  { field: 'ranking', header: 'Ranking', align: 'right' },
];

const userColumns: TableColumn<UserSponsorship>[] = [
  { field: 'user_name', header: 'User name' },
  { field: 'phone_number', header: 'Phone number' },
  {
    field: 'sponsors_purchased',
    header: 'Sponsors purchased',
    align: 'right',
  },
  { field: 'sponsors_used', header: 'sponsors used', align: 'right' },
];

export type Team = {
  team_name: string;
  license_no: string;
  sponsors_accrued: number;
  ranking: string;
};

export type UserSponsorship = {
  user_name: string;
  phone_number: string;
  sponsors_purchased: number;
  sponsors_used: number;
};

const DashboardPage = () => {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box
        sx={{
          display: isTabletUp ? 'block' : 'none',
        }}
      >
        <DesktopDashboardPage />
      </Box>
      <Box
        sx={{
          display: isTabletUp ? 'none' : 'block',
        }}
      >
        <MobileDashboardPage />
      </Box>
    </>
  );
};
export default DashboardPage;

const MobileDashboardPage = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const secondCardRef = useRef<HTMLDivElement | null>(null);

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
      {/* Sliding Cards */}
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          border: '2px solid red',
          overflow: 'auto',
          flexDirection: 'row',
          width: '100%',
          gap: '40px',
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
        items={teamData}
        fields={teamFieldData}
        searchKeys={['team_name', 'license_no']}
        searchPlaceholder='Search by team or license...'
      />

      <ScrollableSection<UserSponsorship>
        title='Users by sponsorships'
        items={userSponsorshipData}
        fields={userSponsorshipFieldData}
        searchKeys={['user_name', 'phone_number']}
        searchPlaceholder='Search by username or phone number...'
      />
    </>
  );
};

const DesktopDashboardPage = () => {
  return (
    <>
      <AdminSection title='Dashboard' cards={dashboardCards}></AdminSection>

      <Box
        sx={{
          padding: '1.56em 6.98em',
          '@media (min-width:910px) and (max-width:1000px)': {
            padding: '1.56em 2em', // override between 900px and 1000px
            pl: '3em',
          },
          '@media (min-width:1000px) and (max-width:1100px)': {
            // height: '200px',
            paddingX: '1em', // override between 900px and 1000px
            pl: '2rem',
          },
        }}
      >
        <PaginatedTable
          title='TEAMS by ranking'
          rows={teamData}
          columns={teamColumns}
          searchFields={['team_name', 'license_no']}
          searchPlaceholder='Search'
          initialRowsPerPage={10}
          maxBodyHeight={430}
          getRowKey={(r) => `${r.team_name}-${r.license_no}`}
        />

        <PaginatedTable<UserSponsorship>
          title='USERS by sponsorships'
          rows={userSponsorshipData}
          columns={userColumns}
          searchFields={['user_name', 'phone_number']}
          searchPlaceholder='Search by username or phone…'
          initialRowsPerPage={6}
          maxBodyHeight={420}
          getRowKey={(r, i) => `${r.user_name}-${i}`}
        />
      </Box>
    </>
  );
};

const dashboardCards: MetricCard[] = [
  { title: 'All Users', total: 200, deltaPct: 30, trendingUp: false },
  { title: 'All Team', total: 200, deltaPct: 30, trendingUp: true },
  { title: 'Subscription Volume', total: 200, deltaPct: 30, trendingUp: true },
  {
    title: 'Licensing Volume',
    total: 200,
    deltaPct: 30,
    trendingUp: false,
  },
  {
    title: 'Sponsorship Volume',
    total: 200,
    deltaPct: 30,
    trendingUp: false,
  },
];
