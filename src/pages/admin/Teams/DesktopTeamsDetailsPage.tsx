import { Box } from '@mui/material';
import ROUTES from '../../../routes/routePath.ts';
import AdminBreadCrumbs from '../components/AdminBreadcrumbs.tsx';
import AdminSection from '../components/AdminSection.tsx';
import PaginatedTable, {
  type TableColumn,
} from '../../../components/tables/PaginatedTable.tsx';
import type { MetricCard } from '../components/CardGrid.tsx';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useSingleTeamStats } from './hooks/useSingleTeamStats.ts';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { DateRange } from 'react-day-picker';
import { toast } from 'react-toastify';
import DateRangeFilter from '../../../components/filters/DateRangeFilter.tsx';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
import TeamDetailsSection from './components/DesktopTeamDetailsSection.tsx';
import TeamPostCarousel from './components/modal/desktop/DesktopTeamPostCarousel.tsx';
import debounce from 'lodash.debounce';
import { useTeamVoteHistory } from './hooks/useTeamVoteHistory.ts';

/** Row for the sponsors table */
type SponsorRow = {
  id: number;
  sponsor_name: string;
  value: string; // formatted currency
  volume: number;
  date: string; // e.g. "6/16/2025"
  time: string; // e.g. "10:38pm"
  source: string; // API does not provide; keep '—' for now
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

  // ===================== SPONSORS TABLE (API) =====================

  // server-mode state
  const [page, setPage] = useState(0); // UI 0-based
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState<string>('');

  // debounce search like elsewhere
  const applySearch = useMemo(
    () => debounce((v: string) => setSearch(v), 400),
    []
  );
  useEffect(() => () => applySearch.cancel(), [applySearch]);

  // reset page when date range changes
  useEffect(() => {
    setPage(0);
  }, [start, end]);

  // fetch sponsors history for this team_id
  const {
    data: voteResp,
    isLoading: sponsorsLoading,
    isError: sponsorsError,
  } = useTeamVoteHistory({
    team_id,
    page: page + 1, // API is 1-based
    page_size: rowsPerPage,
    start_date: fmt(start),
    end_date: fmt(end),
    search: search || undefined,
  });

  useEffect(() => {
    if (sponsorsError) toast.error('Failed to fetch sponsors.');
  }, [sponsorsError]);

  // map API → table rows
  const sponsorRows: SponsorRow[] = useMemo(() => {
    const list = voteResp?.data?.data ?? [];
    return list.map((it) => {
      const d = dayjs(it.created_at);
      const value = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      }).format(it.equivalent_amount ?? 0);

      return {
        id: it.id,
        sponsor_name: it.sponsor_name,
        value,
        volume: it.units,
        date: d.format('M/D/YYYY'),
        time: d.format('h:mma'),
        source: '—', // API does not provide payment source
      };
    });
  }, [voteResp]);

  const sponsorTotal = voteResp?.data?.metadata?.total_count ?? 0;

  const sponsorColumns: TableColumn<SponsorRow>[] = [
    { field: 'sponsor_name', header: 'Sponsor name' },
    { field: 'value', header: 'Value', align: 'right' },
    { field: 'volume', header: 'Volume', align: 'right' },
    { field: 'date', header: 'Date' },
    { field: 'time', header: 'Time' },
    { field: 'source', header: 'Source' },
  ];

  // ===============================================================

  return (
    <>
      <AdminSection
        title={
          <AdminBreadCrumbs
            rootLabel='TEAMS DASHBOARD'
            rootTo={ROUTES.TEAMS}
            currentLabel={
              stats?.team_name ? `TEAM: ${stats.team_name}` : 'TEAM DETAILS'
            }
          />
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
          // ----- server mode wiring -----
          mode='server'
          loading={sponsorsLoading}
          totalCount={sponsorTotal}
          pageIndex={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          searchValue={searchInput}
          onSearchChange={(val) => {
            setSearchInput(val);
            applySearch(val);
          }}
          // fields to search on (server hints; still OK for client fallback)
          searchFields={['sponsor_name', 'date']}
          searchPlaceholder='Search'
          initialRowsPerPage={10}
          maxBodyHeight={420}
          getRowKey={(r) => String(r.id)}
        />
      </Box>

      <TeamDetailsSection teamId={team_id} />

      <Box>
        <TeamPostCarousel teamId={team_id} />
      </Box>
    </>
  );
};
