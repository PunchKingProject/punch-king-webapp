// pages/admin/SponsorshipPage.tsx
import { Box, IconButton, useMediaQuery } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminSection from '../components/AdminSection';
import PaginatedTable, {
  type TableColumn,
} from '../../../components/tables/PaginatedTable';
import StatusChip, {
  type StatusType,
} from '../../../components/chips/StatusChip';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../routes/routePath';
type MetricCard = {
  title: string;
  total: number | string;
  deltaPct?: number;
  trendingUp?: boolean;
};

export type SponsorshipRequest = {
  sponsor_name: string;
  phone_number: string;
  payment_confirmation_status: 'Pending' | 'Failed' | 'Confirmed';
  sponsorship_status: 'Pending' | 'Processed' | 'Failed';
};

const SponsorshipPage = () => {
  const isDesktop = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box sx={{ display: isDesktop ? 'block' : 'none' }}>
        <DesktopSponsorshipPage />
      </Box>
      <Box sx={{ display: isDesktop ? 'none' : 'block' }}>
        <MobileSponsorshipPage />
      </Box>
    </>
  );
};

export default SponsorshipPage;

/* ---------------- Desktop ---------------- */

const DesktopSponsorshipPage = () => {
  const navigate = useNavigate()
  const handleView = (row: SponsorshipRequest) => {
    // TODO: open modal / navigate to details
    console.log('view sponsorship row', row);
        navigate(ROUTES.LICENSING_DETAILS);

  };

  return (
    <>
      <AdminSection
        title='SPONSORSHIPS'
        cards={sponsorshipCards} // remove if AdminSection doesn't support cards yet
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
        <PaginatedTable<SponsorshipRequest>
          title='SPONSORSHIP REQUESTS'
          rows={sponsorshipRows}
          columns={sponsorshipColumns(handleView)}
          searchFields={['sponsor_name', 'phone_number']}
          searchPlaceholder='Search'
          initialRowsPerPage={6}
          maxBodyHeight={420}
          getRowKey={(r, i) => `${r.sponsor_name}-${r.phone_number}-${i}`}
        />
      </Box>
    </>
  );
};

/* ---------------- Mobile ---------------- */

const MobileSponsorshipPage = () => {
  // Build a mobile-first list here later (you can reuse StatusChip)
  return <>Mobile Sponsorship Page</>;
};

/* ---------------- Config: Cards + Columns + Data ---------------- */

const sponsorshipCards: MetricCard[] = [
  { title: 'All Sponsorships', total: 200, deltaPct: 30, trendingUp: false },
  { title: 'Sponsorship Value', total: 200, deltaPct: 30, trendingUp: true },
  { title: 'Volume', total: 200, deltaPct: 30, trendingUp: true },
  {
    title: 'Processed Sponsorship',
    total: 200,
    deltaPct: 30,
    trendingUp: false,
  },
  {
    title: 'Pending Sponsorships',
    total: 200,
    deltaPct: 30,
    trendingUp: false,
  },
];

const sponsorshipColumns = (
  onView: (row: SponsorshipRequest) => void
): TableColumn<SponsorshipRequest>[] => [
  { field: 'sponsor_name', header: 'Sponsor name' },
  { field: 'phone_number', header: 'Phone number' },
  {
    field: 'payment_confirmation_status',
    header: 'Payment confirmation status',
    render: (value) => <StatusChip label={value as StatusType} />,
  },
  {
    field: 'sponsorship_status',
    header: 'Sponsorship Status',
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

const sponsorshipRows: SponsorshipRequest[] = [
  {
    sponsor_name: 'King of the jungle',
    phone_number: '08036123426',
    payment_confirmation_status: 'Pending',
    sponsorship_status: 'Pending',
  },
  {
    sponsor_name: 'King of the jungle',
    phone_number: '08036123426',
    payment_confirmation_status: 'Pending',
    sponsorship_status: 'Pending',
  },
  {
    sponsor_name: 'King of the jungle',
    phone_number: '08036123426',
    payment_confirmation_status: 'Failed',
    sponsorship_status: 'Pending',
  },
  {
    sponsor_name: 'King of the jungle',
    phone_number: '08036123426',
    payment_confirmation_status: 'Confirmed',
    sponsorship_status: 'Processed',
  },
  {
    sponsor_name: 'King of the jungle',
    phone_number: '08036123426',
    payment_confirmation_status: 'Confirmed',
    sponsorship_status: 'Failed',
  },
  {
    sponsor_name: 'King of the jungle',
    phone_number: '08036123426',
    payment_confirmation_status: 'Confirmed',
    sponsorship_status: 'Processed',
  },
];
