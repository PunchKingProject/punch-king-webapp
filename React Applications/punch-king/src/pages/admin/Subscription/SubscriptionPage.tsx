import { useMediaQuery } from '@mui/material';
import StatusChip from '../../../components/chips/StatusChip';

import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, IconButton } from '@mui/material';
import PaginatedTable, {
  type TableColumn,
} from '../../../components/tables/PaginatedTable';
import AdminSection from '../components/AdminSection';

import { type StatusType } from '../../../components/chips/StatusChip';
import ROUTES from '../../../routes/routePath';
import { useNavigate } from 'react-router-dom';

type MetricCard = {
  title: string;
  total: number | string;
  deltaPct?: number;
  trendingUp?: boolean;
};

export type SubscriptionRequest = {
  team_name: string;
  phone_number: string;
  payment_confirmation_status: 'Pending' | 'Failed' | 'Confirmed';
  subscription_status: 'Not subscribed' | 'Subscribed' | 'Failed';
};

const SubscriptionPage = () => {
  const isDesktop = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box sx={{ display: isDesktop ? 'block' : 'none' }}>
        <DesktopSubscriptionPage />
      </Box>
      <Box sx={{ display: isDesktop ? 'none' : 'block' }}>
        <MobileSubscriptionPage />
      </Box>
    </>
  );
};
export default SubscriptionPage;

/* ---------------- Desktop ---------------- */

const DesktopSubscriptionPage = () => {
    const navigate = useNavigate()
  
  const handleView = (row: SubscriptionRequest) => {
    // TODO: open modal or navigate to details page
    console.log('view subscription row', row);
        navigate(ROUTES.LICENSING_DETAILS);

  };

  return (
    <>
      <AdminSection
        title='SUBSCRIPTION'
        cards={subscriptionCards} // remove if AdminSection doesn't support cards yet
        toolbar={
          <span style={{ color: '#f0c040', fontWeight: 600 }}>
            Filter by time frame ⚙️
          </span>
        }
      ></AdminSection>
      <Box
        sx={{
          padding: '1.56em 6.98em',
          '@media (min-width:910px) and (max-width:1000px)': {
            padding: '1.56em 2em',
            pl: '3em',
          },
          '@media (min-width:1000px) and (max-width:1100px)': {
            px: '1em',
            pl: '2rem',
          },
        }}
      >
        <PaginatedTable<SubscriptionRequest>
          title='SUBSCRIPTION REQUESTS'
          rows={subscriptionRows}
          columns={subscriptionColumns(handleView)}
          searchFields={['team_name', 'phone_number']}
          searchPlaceholder='Search'
          initialRowsPerPage={6}
          maxBodyHeight={420}
          getRowKey={(r, i) => `${r.team_name}-${r.phone_number}-${i}`}
        />
      </Box>
    </>
  );
};

/* ---------------- Mobile ---------------- */

const MobileSubscriptionPage = () => {
  // Build your mobile-first list/cards here (can reuse StatusChip)
  return <>Mobile Subscription Page</>;
};

/* ---------------- Config: Cards + Columns + Data ---------------- */

// top metric cards to match your screenshot labels
const subscriptionCards: MetricCard[] = [
  { title: 'All Subscribed Teams', total: 200, deltaPct: 30, trendingUp: true },
  { title: 'Teams Without Subsc.', total: 200, deltaPct: 30, trendingUp: true },
  {
    title: 'Subscription Requests',
    total: 200,
    deltaPct: 30,
    trendingUp: true,
  },
  {
    title: 'Processed Subscriptions',
    total: 200,
    deltaPct: 30,
    trendingUp: false,
  },
  { title: 'Subscriptions Value', total: 200, deltaPct: 30, trendingUp: false },
  {
    title: 'Subscriptions Volume',
    total: 200,
    deltaPct: 30,
    trendingUp: false,
  },
];

// columns (factory so we can inject the "view" click handler)
const subscriptionColumns = (
  onView: (row: SubscriptionRequest) => void
): TableColumn<SubscriptionRequest>[] => [
  { field: 'team_name', header: 'Team name' },
  { field: 'phone_number', header: 'Phone number' },
  {
    field: 'payment_confirmation_status',
    header: 'Payment confirmation status',
    render: (value) => <StatusChip label={value as StatusType} />,
  },
  {
    field: 'subscription_status',
    header: 'Subs. Status',
    render: (value) => <StatusChip label={value as StatusType} />,
  },
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

// mock data (swap for API)
const subscriptionRows: SubscriptionRequest[] = [
  {
    team_name: 'King of the jungle',
    phone_number: '08036123426',
    payment_confirmation_status: 'Pending',
    subscription_status: 'Not subscribed',
  },
  {
    team_name: 'King of the jungle',
    phone_number: '08036123426',
    payment_confirmation_status: 'Pending',
    subscription_status: 'Not subscribed',
  },
  {
    team_name: 'King of the jungle',
    phone_number: '08036123426',
    payment_confirmation_status: 'Failed',
    subscription_status: 'Not subscribed',
  },
  {
    team_name: 'King of the jungle',
    phone_number: '08036123426',
    payment_confirmation_status: 'Confirmed',
    subscription_status: 'Subscribed',
  },
  {
    team_name: 'King of the jungle',
    phone_number: '08036123426',
    payment_confirmation_status: 'Confirmed',
    subscription_status: 'Failed',
  },
  {
    team_name: 'King of the jungle',
    phone_number: '08036123426',
    payment_confirmation_status: 'Confirmed',
    subscription_status: 'Subscribed',
  },
];
