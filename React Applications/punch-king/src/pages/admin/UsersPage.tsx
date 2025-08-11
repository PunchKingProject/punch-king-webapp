import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, IconButton, useMediaQuery } from '@mui/material';
import PaginatedTable, {
  type TableColumn,
} from '../../components/tables/PaginatedTable';
import AdminSection from './components/AdminSection';
import type { MetricCard } from './components/CardGrid';

export type UserRow = {
  user_name: string;
  phone_number: string;
  email: string;
  sponsorships: number;
  sponsor_units: number;
};

const UsersPage = () => {
  const isTabletUp = useMediaQuery('(min-width:910px)');

  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopUsersPage />
      </Box>

      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileUsersPage />
      </Box>
    </>
  );
};
export default UsersPage;

/* ---------------- Mobile ---------------- */

const MobileUsersPage = () => {
  return <>Mobile Users Page</>;
};

const DesktopUsersPage = () => {
  const handleView = (row: UserRow) => {
    console.log('view user', row);
  };

  return (
    <>
      <AdminSection
        title='USERS DASHBOARD
    '
        cards={userCards}
        toolbar={
          <span
            style={{
              color: '#f0c040',
              fontWeight: 600,
            }}
          >
            Filter by time frame ⚙️
          </span>
        }
      >

      </AdminSection>
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
        <PaginatedTable<UserRow>
          title='USER TABLE'
          rows={usersData}
          columns={usersColumns(handleView)}
          searchFields={['user_name', 'phone_number', 'email']}
          searchPlaceholder='Search'
          initialRowsPerPage={6}
          maxBodyHeight={420}
          getRowKey={(r, i) => `${r.user_name}-${r.phone_number}-${i}`}
        />
      </Box>
    </>
  );
};

const userCards: MetricCard[] = [
  { title: 'All Users', total: 200, deltaPct: 30, trendingUp: false },
  { title: 'Sponsoring Users', total: 200, deltaPct: 30, trendingUp: true },
  { title: 'Sponsorship Value', total: 200, deltaPct: 30, trendingUp: true },
];

// Columns (factory so we can inject the view handler)
const usersColumns = (
  onView: (row: UserRow) => void
): TableColumn<UserRow>[] => [
  { field: 'user_name', header: 'User name' },
  { field: 'phone_number', header: 'Phone number' },
  { field: 'email', header: 'Email' },
  { field: 'sponsorships', header: 'sponsorships', align: 'right' },
  { field: 'sponsor_units', header: 'sponsor Units', align: 'right' },
  {
    field: 'view',
    header: 'View',
    align: 'center',
    width: 80,
    render: (_value, row) => (
      <IconButton onClick={() => onView(row)} aria-label='view'>
        <VisibilityIcon sx={{ color: '#f0c040' }} />
      </IconButton>
    ),
  },
];

// Mock data (swap with API data later)
const usersData: UserRow[] = [
  {
    user_name: 'King of the jungle',
    phone_number: '08036123426',
    email: 'abbas@dukka.com',
    sponsorships: 2000,
    sponsor_units: 50,
  },
  {
    user_name: 'King of the jungle',
    phone_number: '08036123426',
    email: 'abbas@dukka.com',
    sponsorships: 2000,
    sponsor_units: 50,
  },
  {
    user_name: 'King of the jungle',
    phone_number: '08036123426',
    email: 'abbas@dukka.com',
    sponsorships: 2000,
    sponsor_units: 50,
  },
  {
    user_name: 'King of the jungle',
    phone_number: '08036123426',
    email: 'abbas@dukka.com',
    sponsorships: 2000,
    sponsor_units: 50,
  },
  {
    user_name: 'King of the jungle',
    phone_number: '08036123426',
    email: 'abbas@dukka.com',
    sponsorships: 2000,
    sponsor_units: 50,
  },
  {
    user_name: 'King of the jungle',
    phone_number: '08036123426',
    email: 'abbas@dukka.com',
    sponsorships: 2000,
    sponsor_units: 50,
  },
];
