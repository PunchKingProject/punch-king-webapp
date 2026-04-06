  import { useEffect, useMemo, useRef, useState } from 'react';
  import { Box, Typography } from '@mui/material';
  import dayjs, { Dayjs } from 'dayjs';
  import type { DateRange } from 'react-day-picker';
  import debounce from 'lodash.debounce';
  import { toast } from 'react-toastify';


  import MetricsDateFilterDrawer from './MetricsDateFilterDrawer.tsx';

  import { useDashboardStats, useRankedTeams, useRankedUsers } from '../hooks';
  import type {
    RankedTeam,
    RankedUser,
    Team,
    UserSponsorship,

  } from '../api/dashboard.types.ts';
  import { teamFieldData, userSponsorshipFieldData } from '../ui/fields.ts';
  import { colors } from '../../../../theme/colors.ts';
  import { ScrollableSection } from '../../components/ScrollableSection.tsx';

  // ===== Helpers =====
  const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');
  const formatRangeLabel = (from?: Date, to?: Date) => {
    if (!from || !to) return 'Last 30 days';
    const a = dayjs(from).format('MMM D');
    const b = dayjs(to).format('MMM D, YYYY');
    return `${a} – ${b}`;
  };

  export default function MobileDashboard() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const secondCardRef = useRef<HTMLDivElement | null>(null);

    // ---- Metrics-only date range (controls stats only) ----
    const [metricRange, setMetricRange] = useState<[Dayjs, Dayjs]>([
      dayjs().subtract(30, 'day'),
      dayjs(),
    ]);
    const [start, end] = metricRange;
    const metricDayPickerRange: DateRange | undefined = {
      from: start.toDate(),
      to: end.toDate(),
    };

    // ---- Fetch stats based on metricRange ----
    const {
      data: stats,
      isLoading: statsLoading,
      isError: statsError,
    } = useDashboardStats({
      start_date: fmt(start),
      end_date: fmt(end),
    });

    useEffect(() => {
      if (statsError) toast.error('Failed to fetch dashboard stats.');
    }, [statsError]);

    // Keep your existing card visual structure, fill with server numbers
    const metricCards = [
      {
        title: 'All Users',
        total: stats?.sponsor_count ?? 0,
        percentage: '30',
        status: true,
      },
      {
        title: 'All Team',
        total: stats?.team_count ?? 0,
        percentage: '30',
        status: false,
      },
      {
        title: 'Subscription Volume',
        total: stats?.subscriptions_in_range ?? 0,
        percentage: '30',
        status: true,
      },
      {
        title: 'Licensing Volume',
        total: stats?.licenses_in_range ?? 0,
        percentage: '30',
        status: false,
      },
      {
        title: 'Chip Volume',
        total: stats?.sponsorship_purchases_range ?? 0,
        percentage: '30',
        status: true,
      },
    ];

    // Center on the second card for “peek” effect
    useEffect(() => {
      if (secondCardRef.current) {
        secondCardRef.current.scrollIntoView({
          behavior: 'smooth',
          inline: 'start',
        });
      }
    }, []);

    // ---- TEAMS (server search + paging) — NOT date-scoped on mobile per design ----
    const [teamQuery, setTeamQuery] = useState('');
    const [teamPage, setTeamPage] = useState(1);
    const [teamRows, setTeamRows] = useState<Team[]>([]);

    const debouncedApplyTeamSearch = useMemo(
      () =>
        debounce((q: string) => {
          setTeamQuery(q);
          setTeamPage(1);
          setTeamRows([]);
        }, 400),
      []
    );
    useEffect(
      () => () => debouncedApplyTeamSearch.cancel(),
      [debouncedApplyTeamSearch]
    );

    const {
      data: teamResp,
      isFetching: teamsFetching,
      isError: teamsError,
    } = useRankedTeams({ page: teamPage, page_size: 10, search: teamQuery });

    useEffect(() => {
      const apiRows = (teamResp?.data.data ?? []);
      const mapped: Team[] = apiRows.map((rt: RankedTeam) => ({
        team_name: rt.team_name,
        license_no: rt.license_number,
        sponsors_accrued: rt.sponsorships,
        ranking: rt.rank,
      }));
      if (teamPage === 1) setTeamRows(mapped);
      else if (mapped.length) setTeamRows((prev) => [...prev, ...mapped]);
    }, [teamResp, teamPage]);

    useEffect(() => {
      if (teamsError) toast.error('Failed to fetch ranked teams.');
    }, [teamsError]);

    const teamHasMore = (teamResp?.data.metadata?.total_count ?? 0) > teamRows.length;

    // ---- USERS (server search + paging) — NOT date-scoped on mobile per design ----
    const [userQuery, setUserQuery] = useState('');
    const [userPage, setUserPage] = useState(1);
    const [userRows, setUserRows] = useState<UserSponsorship[]>([]);

    const debouncedApplyUserSearch = useMemo(
      () =>
        debounce((q: string) => {
          setUserQuery(q);
          setUserPage(1);
          setUserRows([]);
        }, 400),
      []
    );
    useEffect(
      () => () => debouncedApplyUserSearch.cancel(),
      [debouncedApplyUserSearch]
    );

    const {
      data: usersResp,
      isFetching: usersFetching,
      isError: usersError,
    } = useRankedUsers({ page: userPage, page_size: 10, search: userQuery });

    useEffect(() => {
      const apiRows = (usersResp?.data.data ?? []) ;
      const mapped: UserSponsorship[] = apiRows.map(
        (u:RankedUser) => ({
          user_name: u.name,
          phone_number: u.phone_number,
          sponsors_purchased: u.total_points_purchased,
          sponsors_used: u.total_amount_sponsored, // adjust if API differs
        })
      );
      if (userPage === 1) setUserRows(mapped);
      else if (mapped.length) setUserRows((prev) => [...prev, ...mapped]);
    }, [usersResp, userPage]);

    useEffect(() => {
      if (usersError) toast.error('Failed to fetch ranked users.');
    }, [usersError]);

    const userHasMore = (usersResp?.data.metadata?.total_count ?? 0) > userRows.length;

    return (
      <>
        {/* Header with range label + drawer trigger — applies ONLY to metrics */}
        <Box
          sx={{
            px: 2,
            pt: 1,
            pb: 0.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='mediumHeaderBold' sx={{ color: colors.Freeze }}>
            Dashboard
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant='bodyTextMilkDefault'
              sx={{ color: colors.Freeze, opacity: 0.8 }}
            >
              {formatRangeLabel(
                metricDayPickerRange?.from,
                metricDayPickerRange?.to
              )}
            </Typography>
            <MetricsDateFilterDrawer
              range={metricDayPickerRange}
              onApply={(r) => {
                if (!r.from || !r.to) return;
                setMetricRange([dayjs(r.from), dayjs(r.to)]);
                // Teams/Users intentionally NOT reset by date on mobile
              }}
            />
          </Box>
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
            <Box
              key={item.title}
              ref={index === 1 ? secondCardRef : null}
              sx={{
                background: colors.Card,
                minWidth: '230px',
                width: '110vw',
                maxWidth: '489px',
                border: '1px solid #3B3B3B',
                height: '135px',
                borderRadius: '10px',
                boxShadow: '2px 2px 10px 2px #2B2B2BB0',
                padding: '20px 10px',
                gap: '25px',
                display: 'flex',
                flexDirection: 'column',
                opacity: statsLoading ? 0.6 : 1,
              }}
            >
              <Typography
                variant='mediumHeaderBold'
                component='p'
                sx={{ textTransform: 'uppercase', color: colors.Freeze }}
              >
                {item.title}
              </Typography>
              <Typography
                variant='bodyTextMilkDefault'
                component='p'
                sx={{ fontWeight: 700, color: colors.Freeze }}
              >
                {item.total}
              </Typography>
              <Box sx={{ width: '100%', textAlign: 'right' }}>
                <Typography
                  variant='bodyTextMilkDefault'
                  component='p'
                  sx={{
                    fontWeight: 500,
                    color: item.status ? colors.Success : colors.Caution,
                  }}
                >
                  {`You have ${item.percentage}% ${
                    item.status ? 'climbed' : 'dip'
                  }`}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* TEAMS server list (unchanged by date) */}
        <ScrollableSection<Team>
          title='TEAMS by ranking'
          items={teamRows}
          fields={teamFieldData}
          searchKeys={['team_name', 'license_no']}
          searchPlaceholder='Search by team or license...'
          serverSearch
          loading={teamsFetching && teamRows.length === 0}
          hasMore={teamHasMore}
          onSearchChange={(q) => {
            debouncedApplyTeamSearch(q);
          }}
          onLoadMore={() => setTeamPage((p) => p + 1)}
        />

        {/* USERS server list (unchanged by date) */}
        <ScrollableSection<UserSponsorship>
          title='Users by sponsorships'
          items={userRows}
          fields={userSponsorshipFieldData}
          searchKeys={['user_name', 'phone_number']}
          searchPlaceholder='Search by username or phone number...'
          serverSearch
          loading={usersFetching && userRows.length === 0}
          hasMore={userHasMore}
          onSearchChange={(q) => {
            debouncedApplyUserSearch(q);
          }}
          onLoadMore={() => setUserPage((p) => p + 1)}
        />
      </>
    );
  }
