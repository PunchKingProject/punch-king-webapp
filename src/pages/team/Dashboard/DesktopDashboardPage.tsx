import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'react-toastify';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
import DashboardSection from '../../../components/dashboards/DashboardSection.tsx';
import DateRangeFilter from '../../../components/filters/DateRangeFilter.tsx';
import { TEAM_SIDENAV_ITEMS } from '../../../utils/sidebarPresets.ts';
import { useTeamDashboardStats } from './hooks/useTeamDashboardStats.ts';
import debounce from 'lodash.debounce';
import { useTeamVoteHistory } from './hooks/useTeamVoteHistory.ts';
import type { MySponsorshipRow } from './components/DesktopMySponsorshipsTable.tsx';
import DesktopMySponsorshipsTable from './components/DesktopMySponsorshipsTable.tsx';
import { Box } from '@mui/material';
import DesktopMySubscriptionsTable, { type MySubscriptionRow } from './components/DesktopMySubscriptionsTable.tsx';
import { useMySubscriptions } from './hooks/useMySubscriptions.ts';
import { useTeamLicenseHistory } from './hooks/useTeamLicenseHistory.ts';
import DesktopMyLicensesTable, { type MyLicenseRow } from './components/DesktopMyLicensesTable.tsx';
import { useRankedTeams } from './hooks/useRankedTeams.ts';
import DesktopTeamsByRanking from './components/DesktopTeamsByRanking.tsx';
import { useTeamPosts } from './hooks/useTeamPosts.ts';
import DesktopMyCatalogue from './components/DesktopMyCatalogue.tsx';

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

function DesktopDashboardPage() {
  const [range, setRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);

  // adapter for react-day-picker (Date objects)
  const dayPickerRange: DateRange | undefined = {
    from: range[0].toDate(),
    to: range[1].toDate(),
  };
  const [start, end] = range;
  const start_date = useMemo(() => fmt(start), [start]);
  const end_date = useMemo(() => fmt(end), [end]);

  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
  } = useTeamDashboardStats({
    start_date,
    end_date,
  });

  const cards = useMemo(() => {
    if (!statsData) {
      return [
        { title: 'SPONSORS', total: 0 },
        { title: 'CHIPS', total: 0 },
        { title: 'MY LICENSES', total: 0 },
        { title: 'MY SUBSCRIPTIONS', total: 0 },
        { title: 'MY MEDIA VIEWS', total: 0 },
      ];
    }

    return [
      {
        title: 'SPONSORS',
        total: statsData.total_sponsors,
        deltaPct: 0,
        trendingUp: 0,
      },
      {
        title: 'CHIPS',
        total: statsData.sponsorship_balance,
        deltaPct: 0,
        trendingUp: 0,
      },
      {
        title: 'MY LICENSES',
        total: statsData.total_licenses,
        deltaPct: 0,
        trendingUp: 0,
      },
      {
        title: 'MY SUBSCRIPTIONS',
        total: statsData.total_subscriptions,
        deltaPct: 0,
        trendingUp: 0,
      },
      // {
      //   title: 'TEAMS WITHOUT ACTIVE LICENSE',
      //   total: statsData.teams_without_active_license,
      // },
    ];
  }, [statsData]);

  const handleRangeChange = (r?: DateRange) => {
    if (!r?.from || !r.to) return; // wait for full selection
    setRange([dayjs(r.from), dayjs(r.to)]);
    // no manual refetch needed; useDashboardStats key depends on start/endO
  };

  // --- Errors
  useEffect(() => {
    if (statsError) toast.error('Failed to fetch dashboard stats.');
  }, [statsError]);

  const [page, setPage] = useState(0); // 0-based UI
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const applySearch = useMemo(
    () => debounce((v: string) => setSearch(v), 400),
    []
  );
  useEffect(() => () => applySearch.cancel(), [applySearch]);

  useEffect(() => {
    setPage(0);
  }, [start_date, end_date]);

  const {
    data: voteData,
    isLoading: votesLoading,
    isError: votesError,
  } = useTeamVoteHistory({
    start_date,
    end_date,
    page: page + 1, // API is 1-based
    page_size: pageSize,
    search: search || undefined,
  });

  useEffect(() => {
    if (votesError) toast.error('Failed to fetch team sponsorships.');
  }, [votesError]);

  // map api -> table rows
  const rows: MySponsorshipRow[] = useMemo(() => {
    const list = voteData?.data ?? [];
    const fmtUSD = (n?: number) => {
      const v = typeof n === 'number' ? n : 0;
      try {
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2,
        }).format(v);
      } catch {
        return `$${v.toLocaleString()}`;
      }
    };
    return list.map((r) => ({
      id: r.id,
      sponsor_name: r.sponsor_name,
      units: r.units,
      amount: fmtUSD(r.equivalent_amount),
      created_at: `${dayjs(r.created_at).format('M/D/YYYY')}  ${dayjs(
        r.created_at
      ).format('h:mma')}`,
    }));
  }, [voteData]);

  const total = voteData?.metadata?.total_count ?? 0;

  // =========================================================
  // MY SUBSCRIPTIONS (NEW)
  // =========================================================

  const [subsPage, setSubsPage] = useState(0);
  const [subsPageSize, setSubsPageSize] = useState(10);
  const [subsSearch, setSubsSearch] = useState('');
  const [subsSearchInput, setSubsSearchInput] = useState('');
  const applySubsSearch = useMemo(
    () => debounce((v: string) => setSubsSearch(v), 400),
    []
  );
  useEffect(() => () => applySubsSearch.cancel(), [applySubsSearch]);
  useEffect(() => {
    setSubsPage(0);
  }, [start_date, end_date]);

  const {
    data: subsData,
    isLoading: subsLoading,
    isError: subsError,
  } = useMySubscriptions({
    start_date,
    end_date,
    page: subsPage + 1,
    page_size: subsPageSize,
    search: subsSearch || undefined,
  });
  useEffect(() => {
    if (subsError) toast.error('Failed to fetch subscriptions.');
  }, [subsError]);

  const subsRows: MySubscriptionRow[] = useMemo(() => {
    const list = subsData?.table.data ?? [];
    const fmtUSD = (n?: number | null) => {
      const v = typeof n === 'number' ? n : 0;
      try {
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2,
        }).format(v);
      } catch {
        return `$${v.toLocaleString()}`;
      }
    };
    const nice = (s?: string | null) => (s ? dayjs(s).format('M/D/YYYY') : '—');
    const titleize = (t?: string | null) =>
      t
        ? t.replace(/[_-]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
        : '—';

    const now = dayjs();
    return list.map((r) => {
      const end = r.end_date ? dayjs(r.end_date) : null;
      const active = end ? end.isAfter(now) : false;
      return {
        id: r.id,
        subscription_type: titleize(r.type),
        start_date: nice(r.start_date),
        end_date: nice(r.end_date),
        amount_paid: fmtUSD(r.payment_amount),
        status: active ? 'Active' : 'Expired',
      };
    });
  }, [subsData]);

  const subsTotal = subsData?.table.metadata.total_count ?? 0;

  // ===============================
  // MY LICENSES (NEW)
  // ===============================

  const [licPage, setLicPage] = useState(0);
  const [licPageSize, setLicPageSize] = useState(10);
  // keep search UI consistent; endpoint doesn’t support it yet
  const [licSearchInput, setLicSearchInput] = useState('');
  useEffect(() => {
    setLicPage(0);
  }, [start_date, end_date]); // if you later add date filtering

  const {
    data: licData,
    isLoading: licLoading,
    isError: licError,
  } = useTeamLicenseHistory({
    page: licPage + 1,
    page_size: licPageSize,
  });
  useEffect(() => {
    if (licError) toast.error('Failed to fetch licenses.');
  }, [licError]);

  const licRows: MyLicenseRow[] = useMemo(() => {
    const list = licData?.data ?? [];
    const fmtUSD = (n?: number | null) => {
      const v = typeof n === 'number' ? n : 0;
      try {
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2,
        }).format(v);
      } catch {
        return `$${v.toLocaleString()}`;
      }
    };
    const nice = (s?: string | null) => (s ? dayjs(s).format('M/D/YYYY') : '—');

    const now = dayjs();
    return list.map((r) => {
      const end = r.end_date ? dayjs(r.end_date) : null;
      const active = end ? end.isAfter(now) : false;

      return {
        id: r.id,
        license_name: r.team?.license_number || '—',
        start_date: nice(r.start_date),
        end_date: nice(r.end_date),
        amount_paid: fmtUSD(r.payment_amount),
        status: active ? 'Active' : 'Expired',
      };
    });
  }, [licData]);

  const licTotal = licData?.metadata.total_count ?? 0;

  // ===============================
  // TEAMS BY RANKING
  // ===============================
  const [rankPage, setRankPage] = useState(0);
  const [rankPageSize, setRankPageSize] = useState(9); // show 3x3 grid
  const [rankSearch, setRankSearch] = useState('');
  const [rankSearchInput, setRankSearchInput] = useState('');
  const rankApplySearch = useMemo(
    () => debounce((v: string) => setRankSearch(v), 400),
    []
  );
  useEffect(() => () => rankApplySearch.cancel(), [rankApplySearch]);

  const {
    data: rankData,
    isLoading: rankLoading,
    isError: rankError,
  } = useRankedTeams({
    page: rankPage + 1, // API is 1-based
    page_size: rankPageSize,
    search: rankSearch || undefined,
  });
  useEffect(() => {
    if (rankError) toast.error('Failed to fetch ranked teams.');
  }, [rankError]);

  // map to cards
  const ordinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const rankedCards = useMemo(() => {
    const list = rankData?.data ?? [];
    return list.map((rt) => ({
      team_id: rt.team_id,
      team_name: rt.team_name,
      license_number: rt.license_number,
      sponsors: rt.sponsorships ?? 0,
      position: ordinal(rt.rank).toUpperCase(),
      contributors: rt.sponsors ?? 0, // will be 0 unless backend adds it
    }));
  }, [rankData]);

  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
  } = useTeamPosts();

  useEffect(() => {
    if (postsError) toast.error('Failed to fetch team posts.');
  }, [postsError]);

  return (
    <>
      <DashboardSection
        title='TEAM DASHBOARD'
        toolbar={
          <DateRangeFilter
            range={dayPickerRange}
            onChange={handleRangeChange}
            icon={<DateFilterIcon />}
          />
        }
        cards={statsLoading ? undefined : cards}
        loading={statsLoading}
        sidebarItems={TEAM_SIDENAV_ITEMS}
      ></DashboardSection>

      <Box
        sx={{
          padding: '1.56em 6.98em',
          '@media (min-width:910px) and (max-width:1000px)': {
            padding: '1.56em 2em',
            pl: '3em',
          },
          '@media (min-width:1000px) and (max-width:1100px)': {
            paddingX: '1em',
            pl: '2rem',
          },
        }}
      >
        <DesktopMyCatalogue
          posts={postsData ?? []}
          loading={postsLoading}
          onViewPost={(post) => {
            console.log(post)
            // TODO: open a modal, route to a details page, etc.
            // console.log('view post', post);
          }}
        />

        <DesktopMySponsorshipsTable
          rows={rows}
          loading={votesLoading}
          totalCount={total}
          pageIndex={page}
          rowsPerPage={pageSize}
          onPageChange={setPage}
          onRowsPerPageChange={setPageSize}
          searchValue={searchInput}
          onSearchChange={(val) => {
            setSearchInput(val);
            applySearch(val);
          }}
        />

        {/* My Subscriptions */}
        <DesktopMySubscriptionsTable
          rows={subsRows}
          loading={subsLoading}
          totalCount={subsTotal}
          pageIndex={subsPage}
          rowsPerPage={subsPageSize}
          onPageChange={setSubsPage}
          onRowsPerPageChange={setSubsPageSize}
          searchValue={subsSearchInput}
          onSearchChange={(val) => {
            setSubsSearchInput(val);
            applySubsSearch(val);
          }}
          // onView={(row) => {/* TODO: open details/slip if you want */}}
        />

        <DesktopMyLicensesTable
          rows={licRows}
          loading={licLoading}
          totalCount={licTotal}
          pageIndex={licPage}
          rowsPerPage={licPageSize}
          onPageChange={setLicPage}
          onRowsPerPageChange={setLicPageSize}
          searchValue={licSearchInput}
          onSearchChange={(val) => {
            setLicSearchInput(val);
          }}
          // onView={(row) => {/* open slip/details if desired */}}
        />

        <DesktopTeamsByRanking
          rows={rankedCards}
          loading={rankLoading}
          totalCount={rankData?.metadata.total_count}
          pageIndex={rankPage}
          rowsPerPage={rankPageSize}
          onPageChange={setRankPage}
          onRowsPerPageChange={setRankPageSize}
          searchValue={rankSearchInput}
          onSearchChange={(val) => {
            setRankSearchInput(val);
            rankApplySearch(val);
          }}
        />
      </Box>
    </>
  );
}

export default DesktopDashboardPage;
