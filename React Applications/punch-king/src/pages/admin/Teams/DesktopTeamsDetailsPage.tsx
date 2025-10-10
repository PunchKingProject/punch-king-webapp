import { Box } from '@mui/material';
import ROUTES from '../../../routes/routePath';
import AdminBreadCrumbs from '../components/AdminBreadcrumbs';
import AdminSection from '../components/AdminSection';
import PaginatedTable, {
  type TableColumn,
} from '../../../components/tables/PaginatedTable';
import type { MetricCard } from '../components/CardGrid';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useSingleTeamStats } from './hooks/useSingleTeamStats';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { DateRange } from 'react-day-picker';
import { toast } from 'react-toastify';
import DateRangeFilter from '../../../components/filters/DateRangeFilter';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
import TeamDetailsSection from './components/DesktopTeamDetailsSection';
import TeamPostCarousel from './components/modal/desktop/DesktopTeamPostCarousel';

type SponsorRow = {
  sponsor_name: string;
  value: number;
  volume: number;
  date: string; // e.g. "6/16/2025"
  time: string; // e.g. "10:38pm"
  source: 'Bank transfer' | 'card' | 'cash';
};

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

export const DesktopTeamsDetailsPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const team_id = Number(teamId);

  // ---- date range (same pattern as other pages)
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const dayPickerRange: DateRange | undefined = {
    from: range[0].toDate(),
    to: range[1].toDate(),
  };
  const [start, end] = range;

  // ---- fetch single team stats
  const {
    data: stats,
    isLoading,
    isError,
  } = useSingleTeamStats({
    team_id,
    start_date: fmt(start),
    end_date: fmt(end),
  });

  useEffect(() => {
    if (isError) toast.error('Failed to fetch team details stats.');
  }, [isError]);

  // ---- cards from API response (fallbacks to 0 while loading)
  const cards: MetricCard[] = useMemo(() => {
    return [
      {
        title: 'Rank',
        total: stats?.team_rank ?? '-',
        trendingUp: false,
        deltaPct: 0,
      },
      {
        title: 'Sponsorship Value',
        total: stats?.sponsorship_value ?? 0,
        trendingUp: true,
        deltaPct: 0,
      },
      {
        title: 'Chip Volume',
        total: stats?.total_sponsorships ?? 0,
        trendingUp: true,
        deltaPct: 0,
      },
      {
        title: 'Number of Sponsors',
        total: stats?.total_sponsors ?? 0,
        trendingUp: false,
        deltaPct: 0,
      },
    ];
  }, [stats]);

  return (
    <>
      <AdminSection
        title={
          <>
            <AdminBreadCrumbs
              rootLabel='TEAMS DASHBOARD'
              rootTo={ROUTES.TEAMS}
              currentLabel={
                stats?.team_name ? `TEAM: ${stats.team_name}` : 'TEAM DETAILS'
              }
            />
          </>
        }
        toolbar={
          <DateRangeFilter
            range={dayPickerRange}
            onChange={(r?: DateRange) => {
              if (!r?.from || !r.to) return;
              setRange([dayjs(r.from), dayjs(r.to)]);
            }}
            icon={<DateFilterIcon />}
          />
        }
        cards={isLoading ? undefined : cards}
        loading={isLoading}
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

      <TeamDetailsSection teamId={team_id} />

      <Box
      // sx={{ mt: 6, px: 0, maxWidth: '1100px', mx: 'auto' }}
      >
        <TeamPostCarousel teamId={team_id} />
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
  {
    sponsor_name: 'Tijjani babangidad',
    value: 5000,
    volume: 5,
    date: '6/16/2025',
    time: '10:38pm',
    source: 'Bank transfer',
  },
  {
    sponsor_name: 'Tijjani babangidad',
    value: 5000,
    volume: 5,
    date: '6/16/2025',
    time: '10:38pm',
    source: 'card',
  },
  {
    sponsor_name: 'Tijjani babangidad',
    value: 5000,
    volume: 5,
    date: '6/16/2025',
    time: '10:38pm',
    source: 'cash',
  },
  {
    sponsor_name: 'Tijjani babangidad',
    value: 5000,
    volume: 5,
    date: '6/16/2025',
    time: '10:38pm',
    source: 'Bank transfer',
  },
  {
    sponsor_name: 'Tijjani babangidad',
    value: 5000,
    volume: 5,
    date: '6/16/2025',
    time: '10:38pm',
    source: 'Bank transfer',
  },
  {
    sponsor_name: 'Tijjani babangidad',
    value: 5000,
    volume: 5,
    date: '6/16/2025',
    time: '10:38pm',
    source: 'Bank transfer',
  },
];
