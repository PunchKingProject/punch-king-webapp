import { Box } from '@mui/material';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import MobileBreadCrumbs from '../../../components/breadcrumbs/MobileBreadCrumbs';
import MobileMetricCard from '../../../components/cards/MobileMetricCard';
import ROUTES from '../../../routes/routePath';
import MetricsDateFilterDrawer from '../Dashboard/components/MetricsDateFilterDrawer';
import { ScrollableSection } from '../components/ScrollableSection';
import { useSingleTeamStats } from './hooks/useSingleTeamStats';
import { useTeamVoteHistory } from './hooks/useTeamVoteHistory';
import { sponsorFieldData, type SponsorRow } from './ui/fields';
import MobileTeamDetailsSection from './components/MobileTeamDetailsSection';
import MobileTeamPostCarousel from './components/modal/mobile/MobileTeamPostCarousel';

// ---- helpers ----
const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');
const niceDate = (iso: string) => dayjs(iso).format('MMM D, YYYY');
const niceTime = (iso: string) => dayjs(iso).format('h:mm A');

export default function MobileTeamDetails() {
  const { teamId } = useParams<{ teamId: string }>();
  const team_id = Number(teamId);

  // ===== Metrics date range (applies to metrics + single-team stats + vote history) =====
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;
  const dayPickerRange: DateRange | undefined = {
    from: start.toDate(),
    to: end.toDate(),
  };

  // ===== Metrics cards: combine high-level team dashboard stats and single-team stats =====

  const {
    data: single,
    isLoading: singleLoading,
    isError: singleError,
  } = useSingleTeamStats({
    team_id: team_id,
    start_date: fmt(start),
    end_date: fmt(end),
  });

  useEffect(() => {
    if (singleError) toast.error('Failed to fetch team stats.');
  }, [singleError]);

  const metricCards = [
    {
      title: 'Rank',
      total: single?.team_rank ?? 0,
      status: true,
      percentage: '—',
    },
    {
      title: 'Total sponsorships',
      total: single?.total_sponsorships ?? 0,
      status: true,
      percentage: '—',
    },
    {
      title: 'Total sponsors',
      total: single?.total_sponsors ?? 0,
      status: true,
      percentage: '—',
    },
    {
      title: 'Sponsorship value',
      total: single?.sponsorship_value ?? 0,
      status: true,
      percentage: '—',
    },
    // ...
  ];

  // center on second card (peek)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const secondCardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    secondCardRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
    });
  }, []);

  // ===== Sponsor history (server list) =====
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<SponsorRow[]>([]);
  const [query, setQuery] = useState('');

  const debouncedServerSearch = useMemo(
    () =>
      debounce((q: string) => {
        setPage(1);
        setRows([]);
        setQuery(q);
      }, 400),
    []
  );

  useEffect(
    () => () => debouncedServerSearch.cancel(),
    [debouncedServerSearch]
  );

  const {
    data: voteResp,
    isFetching: votesFetching,
    isError: votesErr,
  } = useTeamVoteHistory({
    team_id: team_id,
    page,
    page_size: 10,
    search: query,
    start_date: fmt(start),
    end_date: fmt(end),
  });

  useEffect(() => {
    if (votesErr) toast.error('Failed to fetch sponsor history.');
  }, [votesErr]);

  useEffect(() => {
    const apiRows = voteResp?.data.data ?? [];
    const mapped: SponsorRow[] = apiRows.map((it) => ({
      sponsor_name: it.sponsor_name,
      value: `${it.equivalent_amount}`, // format to currency if needed
      volume: it.units,
      date: niceDate(it.created_at),
      time: niceTime(it.created_at),
      source: '—', // not provided by API yet
    }));
    if (page === 1) setRows(mapped);
    else if (mapped.length) setRows((prev) => [...prev, ...mapped]);
  }, [voteResp, page]);

  const hasMore =
    (voteResp?.data.metadata?.total_count ?? 0) > (rows?.length ?? 0);

  return (
    <>
      {/* Header with date filter */}
      <Box
        sx={{
          px: 2,
          pt: 1,
          pb: 0.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <MobileBreadCrumbs
          rootLabel='TEAM DASHBOARD'
          rootTo={ROUTES.TEAMS}
          currentLabel='TEAM DETAILS'
        />
        {/* <Typography variant='mediumHeaderBold' sx={{ color: colors.Freeze }}>
          {single?.team_name
            ? `${single?.team_name} — Team details`
            : 'Team details'}
        </Typography> */}
        <MetricsDateFilterDrawer
          range={dayPickerRange}
          title='Filter team details'
          onApply={(r) => {
            if (!r?.from || !r?.to) return;
            setRange([dayjs(r.from), dayjs(r.to)]);
            setPage(1);
            setRows([]);
          }}
        />
      </Box>

      {/* Sliding metric cards */}
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          overflow: 'auto',
          flexDirection: 'row',
          width: '100%',
          gap: '40px',
          px: 2,
          py: 1,
        }}
      >
        {metricCards.map((item, index) => (
          <MobileMetricCard
            key={item.title}
            ref={index === 1 ? secondCardRef : null}
            title={item.title}
            value={item.total}
            trendLabel={item.percentage}
            trendUp={item.status}
            loading={singleLoading}
          />
        ))}
      </Box>

      {/* Sponsor history list */}
      <ScrollableSection<SponsorRow>
        title='SPONSORS'
        items={rows}
        fields={sponsorFieldData}
        searchKeys={['sponsor_name']}
        searchPlaceholder='Search sponsor...'
        serverSearch
        loading={votesFetching && rows.length === 0}
        hasMore={hasMore}
        onSearchChange={(q) => debouncedServerSearch(q)}
        onLoadMore={() => setPage((p) => p + 1)}
      />

      <MobileTeamDetailsSection teamId={team_id} />

      <MobileTeamPostCarousel teamId={team_id} />
    </>
  );
}
