import { Box, useMediaQuery } from '@mui/material';
import ROUTES from '../../../routes/routePath';
import AdminBreadCrumbs from '../components/AdminBreadcrumbs';
import AdminSection from '../components/AdminSection';
import type { MetricCard } from '../components/CardGrid';
import PaginatedTable, { type TableColumn } from '../../../components/tables/PaginatedTable';


type SponsorRow = {
  sponsor_name: string;
  value: number;
  volume: number;
  date: string; // e.g. "6/16/2025"
  time: string; // e.g. "10:38pm"
  source: 'Bank transfer' | 'card' | 'cash';
};


const TeamsDetailsPage = () => {
  const isDesktop = useMediaQuery('(min-width:910px)');

  return (
    <>
      <Box sx={{ display: isDesktop ? 'block' : 'none' }}>
        <DesktopTeamsDetailsPage />
      </Box>
      <Box sx={{ display: isDesktop ? 'none' : 'block' }}>
        <MobileTeamsDetailsPage />
      </Box>
    </>
  );
};
export default TeamsDetailsPage;

function MobileTeamsDetailsPage() {
  return <> Mobile Teams Details Page</>;
}
const DesktopTeamsDetailsPage = () => {
  return (
    <>
      <AdminSection
        title={
          <>
            <AdminBreadCrumbs
              rootLabel='TEAMS DASHBOARD'
              rootTo={ROUTES.TEAMS}
              currentLabel='TEAM DETAILS'
            />
          </>
        }
        toolbar={
          <span style={{ color: '#f0c040', fontWeight: 600 }}>
            Filter by time frame ⚙️
          </span>
        }
        cards={teamDetailsCards}
      />

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
        <PaginatedTable<SponsorRow>
          title='SPONSORS'
          rows={sponsorRows}
          columns={sponsorColumns}
          searchFields={['sponsor_name', 'source', 'date']}
          searchPlaceholder='Search'
          initialRowsPerPage={6}
          maxBodyHeight={420}
          getRowKey={(r, i) => `${r.sponsor_name}-${r.date}-${r.time}-${i}`}
        />
      </Box>
    </>
  );
};

/* ------------ Table config & mock data ------------ */


const sponsorColumns: TableColumn<SponsorRow>[] = [
  { field: 'sponsor_name', header: 'Sponsor name' },
  { field: 'value', header: 'Value', align: 'right' },
  { field: 'volume', header: 'Volume', align: 'right' },
  { field: 'date', header: 'Date' },
  { field: 'time', header: 'Time' },
  { field: 'source', header: 'Source' },
];

const sponsorRows: SponsorRow[] = [
  { sponsor_name: 'Tijjani babangidad', value: 5000, volume: 5, date: '6/16/2025', time: '10:38pm', source: 'Bank transfer' },
  { sponsor_name: 'Tijjani babangidad', value: 5000, volume: 5, date: '6/16/2025', time: '10:38pm', source: 'card' },
  { sponsor_name: 'Tijjani babangidad', value: 5000, volume: 5, date: '6/16/2025', time: '10:38pm', source: 'cash' },
  { sponsor_name: 'Tijjani babangidad', value: 5000, volume: 5, date: '6/16/2025', time: '10:38pm', source: 'Bank transfer' },
  { sponsor_name: 'Tijjani babangidad', value: 5000, volume: 5, date: '6/16/2025', time: '10:38pm', source: 'Bank transfer' },
  { sponsor_name: 'Tijjani babangidad', value: 5000, volume: 5, date: '6/16/2025', time: '10:38pm', source: 'Bank transfer' },
];

const teamDetailsCards: MetricCard[] = [
  { title: 'Rank', total: '1st', deltaPct: 30, trendingUp: false },
  { title: 'Sponsorship Value', total: 200, deltaPct: 30, trendingUp: true },
  { title: 'Sponsorship Volume', total: 200, deltaPct: 30, trendingUp: true },
  {
    title: 'Number of Sponsors',
    total: 200,
    deltaPct: 30,
    trendingUp: false,
  },
];
