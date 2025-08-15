import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, IconButton, useMediaQuery } from '@mui/material';
import PaginatedTable, {
  type TableColumn,
} from '../../../components/tables/PaginatedTable';
import AdminSection from '../components/AdminSection';

import StatusChip, {
  type StatusType,
} from '../../../components/chips/StatusChip';
import type { MetricCard } from '../components/CardGrid';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../routes/routePath';

export type LicenseRequests = {
  team_name: string;
  phone_number: string;
  payment_confirmation_status: 'Pending' | 'Failed' | 'Confirmed';
  licensing_status: 'Pending' | 'Processing' | 'Failed' | 'Processed';
};

const LicensingPage = () => {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box
        sx={{
          display: isTabletUp ? 'block' : 'none',
        }}
      >
        <DesktopLicensingPage />
      </Box>
      <Box
        sx={{
          display: isTabletUp ? 'none' : 'block',
        }}
      >
        <MobileLicensingPage />
      </Box>
    </>
  );
};
export default LicensingPage;

const DesktopLicensingPage = () => {
  const navigate = useNavigate()
  const handleView = (row: LicenseRequests) => {
    // TODO: open modal / navigate to details page

    console.log('view row', row);
    navigate(ROUTES.LICENSING_DETAILS)


  };
  return (
    <>
      <AdminSection title='Licensing' cards={licensingCards}></AdminSection>

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
          rows={LicenseRequestsData}
          columns={licenseRequestColumns(handleView)}
          searchFields={['team_name']}
          searchPlaceholder='Search'
          initialRowsPerPage={10}
          maxBodyHeight={430}
          getRowKey={(r) => `${r.team_name}-${r.phone_number}`}
        />
      </Box>
    </>
  );
};

const MobileLicensingPage = () => {
  return <>Mobile Licensing Page</>;
};

const licenseRequestColumns = (
  onView: (row: LicenseRequests) => void
): TableColumn<LicenseRequests>[] => [
  { field: 'team_name', header: 'Team name' },
  { field: 'phone_number', header: 'Phone Number' },
  {
    field: 'payment_confirmation_status',
    header: 'Payment Confirmation Status',
    render: (value) => <StatusChip label={value as StatusType} />,
  },
  {
    field: 'licensing_status',
    header: 'Licensing Status',
    render: (value) => <StatusChip label={value as StatusType} />,
  },
  {
    field: 'view',
    header: 'View',
    align: 'center',
    render: (_value, row) => (
      <IconButton onClick={() => onView(row)} aria-label='view'>
        <VisibilityIcon sx={{ color: '#f0c040' }} />
      </IconButton>
    ),
  },
];

const LicenseRequestsData: LicenseRequests[] = [
  {
    team_name: 'Alpha Warriors',
    phone_number: '08012345678',
    payment_confirmation_status: 'Pending',
    licensing_status: 'Pending',
  },
  {
    team_name: 'Beta Strikers',
    phone_number: '08123456789',
    payment_confirmation_status: 'Confirmed',
    licensing_status: 'Processed',
  },
  {
    team_name: 'Gamma Titans',
    phone_number: '07098765432',
    payment_confirmation_status: 'Failed',
    licensing_status: 'Failed',
  },
  {
    team_name: 'Delta Chargers',
    phone_number: '08087654321',
    payment_confirmation_status: 'Pending',
    licensing_status: 'Processing',
  },
  {
    team_name: 'Epsilon Hawks',
    phone_number: '08134567890',
    payment_confirmation_status: 'Confirmed',
    licensing_status: 'Processed',
  },
  {
    team_name: 'Zeta Rangers',
    phone_number: '09011223344',
    payment_confirmation_status: 'Failed',
    licensing_status: 'Pending',
  },
  {
    team_name: 'Omega Lions',
    phone_number: '08055667788',
    payment_confirmation_status: 'Pending',
    licensing_status: 'Processing',
  },
  {
    team_name: 'Sigma Panthers',
    phone_number: '07022334455',
    payment_confirmation_status: 'Confirmed',
    licensing_status: 'Processed',
  },
  {
    team_name: 'Kappa Knights',
    phone_number: '08199887766',
    payment_confirmation_status: 'Failed',
    licensing_status: 'Failed',
  },
  {
    team_name: 'Lambda Eagles',
    phone_number: '09044556677',
    payment_confirmation_status: 'Confirmed',
    licensing_status: 'Processing',
  },
];

const licensingCards: MetricCard[] = [
  { title: 'All Licensed Teams', total: 200, deltaPct: 30, trendingUp: false },
  {
    title: 'Teams Without license',
    total: 200,
    deltaPct: 30,
    trendingUp: true,
  },
  { title: 'License Requests', total: 200, deltaPct: 30, trendingUp: true },
  {
    title: 'Processed License',
    total: 200,
    deltaPct: 30,
    trendingUp: false,
  },
  {
    title: 'License In processing',
    total: 200,
    deltaPct: 30,
    trendingUp: false,
  },
  {
    title: 'Licensing Value',
    total: 200,
    deltaPct: 30,
    trendingUp: false,
  },
];
