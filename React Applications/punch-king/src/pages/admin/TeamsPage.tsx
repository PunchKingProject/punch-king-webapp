// pages/admin/TeamsPage.tsx
import { Box, IconButton, useMediaQuery } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminSection from './components/AdminSection';
import PaginatedTable, {
  type TableColumn,
} from '../../components/tables/PaginatedTable';

type MetricCard = {
  title: string;
  total: number | string;
  deltaPct?: number;
  trendingUp?: boolean;
};

export type TeamRow = {
  team_name: string;
  license_number: string | 'NIL';
  sponsors_accrued: number;
  ranking: string; // e.g., "1ST", "2ND"
};

const TeamsPage = () => {
  const isDesktop = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box sx={{ display: isDesktop ? 'block' : 'none' }}>
        <DesktopTeamsPage />
      </Box>
      <Box sx={{ display: isDesktop ? 'none' : 'block' }}>
        <MobileTeamsPage />
      </Box>
    </>
  );
};
export default TeamsPage;

/* ---------------- Desktop ---------------- */

const DesktopTeamsPage = () => {
  const handleView = (row: TeamRow) => {
    // TODO: open modal / navigate to team details
    console.log('view team', row);
  };

  return (
    <>
      <AdminSection
        title='TEAMS DASHBOARD'
        cards={teamCards}
        toolbar={
          <span style={{ color: '#f0c040', fontWeight: 600 }}>
            Filter by time frame ⚙️
          </span>
        }
      >
  
      </AdminSection>
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
        <PaginatedTable<TeamRow>
          title='TEAMS TABLE'
          rows={teamsData}
          columns={teamColumns(handleView)}
          searchFields={['team_name', 'license_number']}
          searchPlaceholder='Search'
          initialRowsPerPage={6}
          maxBodyHeight={420}
          getRowKey={(r, i) => `${r.team_name}-${r.license_number}-${i}`}
        />
      </Box>
    </>
  );
};

/* ---------------- Mobile ---------------- */

const MobileTeamsPage = () => {
  // Build your mobile-first list/cards (you already have a mobile pattern)
  return <>Mobile Teams Page</>;
};

/* ---------------- Config: cards + columns + data ---------------- */

const teamCards: MetricCard[] = [
  { title: 'All Teams', total: 200, deltaPct: 30, trendingUp: false },
  { title: 'All Subscribed Team', total: 200, deltaPct: 30, trendingUp: true },
  { title: 'All Licensed Teams', total: 200, deltaPct: 30, trendingUp: true },
  {
    title: 'Teams Without Subscri.',
    total: 200,
    deltaPct: 30,
    trendingUp: false,
  },
  {
    title: 'Teams Without License',
    total: 200,
    deltaPct: 30,
    trendingUp: false,
  },
];

const teamColumns = (
  onView: (row: TeamRow) => void
): TableColumn<TeamRow>[] => [
  { field: 'team_name', header: 'Team name' },
  { field: 'license_number', header: 'License number' },
  { field: 'sponsors_accrued', header: 'Sponsors accrued', align: 'right' },
  { field: 'ranking', header: 'Ranking', align: 'right' },
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

const teamsData: TeamRow[] = [
  {
    team_name: 'King of the jungle',
    license_number: 'LC738262378',
    sponsors_accrued: 2000,
    ranking: '1ST',
  },
  {
    team_name: 'King of the jungle',
    license_number: 'NIL',
    sponsors_accrued: 2000,
    ranking: '2ND',
  },
  {
    team_name: 'King of the jungle',
    license_number: 'LC738262378',
    sponsors_accrued: 2000,
    ranking: '3RD',
  },
  {
    team_name: 'King of the jungle',
    license_number: 'LC738262378',
    sponsors_accrued: 2000,
    ranking: '4TH',
  },
  {
    team_name: 'King of the jungle',
    license_number: 'NIL',
    sponsors_accrued: 2000,
    ranking: '5TH',
  },
  {
    team_name: 'King of the jungle',
    license_number: 'LC738262378',
    sponsors_accrued: 2000,
    ranking: '6TH',
  },
];
