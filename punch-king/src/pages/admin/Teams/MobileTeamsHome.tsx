// src/pages/admin/Teams/components/MobileTeamsHome.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import debounce from 'lodash.debounce';
import type { DateRange } from 'react-day-picker';
import { toast } from 'react-toastify';

import { colors } from '../../../theme/colors.ts';
import MetricsDateFilterDrawer from '../Dashboard/components/MetricsDateFilterDrawer.tsx';
import { ScrollableSection } from '../components/ScrollableSection.tsx';

// Reuse the dashboard list contracts
import type { RankedTeam, Team } from '../Dashboard/api/dashboard.types.ts';
import { useRankedTeams } from '../Dashboard/hooks/useRankedTeams.ts';
import { teamFieldData } from './ui/fields.ts';

// Teams metrics hook
import { useTeamDashboardStats } from './hooks/useTeamDashboardStats.ts';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import { useNavigate } from 'react-router-dom';

// ---- helpers ----
const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');
const formatRangeLabel = (from?: Date, to?: Date) => {
  if (!from || !to) return 'Last 30 days';
  const a = dayjs(from).format('MMM D');
  const b = dayjs(to).format('MMM D, YYYY');
  return `${a} – ${b}`;
};

export default function MobileTeamsHome() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const secondCardRef = useRef<HTMLDivElement | null>(null);

  // ===== Metrics date range (controls metrics ONLY) =====
  const [metricRange, setMetricRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = metricRange;

  const metricDayPickerRange: DateRange | undefined = {
    from: start.toDate(),
    to: end.toDate(),
  };

  // ===== Fetch TEAMS metrics =====
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useTeamDashboardStats({
    start_date: fmt(start),
    end_date: fmt(end),
  });

  useEffect(() => {
    if (statsError) toast.error('Failed to fetch team metrics.');
  }, [statsError]);

  // Keep the same card look & feel as MobileDashboard
  const metricCards = [
    {
      title: 'All Teams',
      total: stats?.total_teams ?? 0,
      percentage: '—',
      status: true,
    },
    {
      title: 'Active Subscriptions',
      total: stats?.teams_with_active_sub ?? 0,
      percentage: '—',
      status: true,
    },
    {
      title: 'Active Licenses',
      total: stats?.teams_with_active_license ?? 0,
      percentage: '—',
      status: true,
    },
    {
      title: 'No Subscription',
      total: stats?.teams_without_active_sub ?? 0,
      percentage: '—',
      status: false,
    },
    {
      title: 'No License',
      total: stats?.teams_without_active_license ?? 0,
      percentage: '—',
      status: false,
    },
  ];

  // Center on the 2nd card for the “peek” effect (same as dashboard)
  useEffect(() => {
    if (secondCardRef.current) {
      secondCardRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
      });
    }
  }, []);

  // ===== Teams list (server search + paging) =====
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
    const apiRows = teamResp?.data.data ?? [];
    const mapped: Team[] = (apiRows as RankedTeam[]).map((rt) => ({
      team_name: rt.team_name,
      license_no: rt.license_number,
      sponsors_accrued: rt.sponsorships,
      ranking: rt.rank,
      team_id: rt.team_id,
    }));
    if (teamPage === 1) setTeamRows(mapped);
    else if (mapped.length) setTeamRows((prev) => [...prev, ...mapped]);
  }, [teamResp, teamPage]);

  useEffect(() => {
    if (teamsError) toast.error('Failed to fetch ranked teams.');
  }, [teamsError]);

  const teamHasMore =
    (teamResp?.data.metadata?.total_count ?? 0) > (teamRows?.length ?? 0);

  return (
    <>
      {/* Header: title + metrics date filter (metrics only) */}
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
          Teams
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
            title='Filter team metrics'
            onApply={(r) => {
              if (!r.from || !r.to) return;
              setMetricRange([dayjs(r.from), dayjs(r.to)]);
              // List is intentionally NOT scoped by date (to match Dashboard UX)
            }}
          />
        </Box>
      </Box>

      {/* Sliding metric cards (identical structure to MobileDashboard) */}
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
              p: '20px 10px',
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
                {item.status ? 'Trending up' : 'Trending down'}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Server-driven Teams list (same ScrollableSection pattern) */}
      <ScrollableSection<Team>
        title='TEAMS table'
        items={teamRows}
        fields={teamFieldData}
        searchKeys={['team_name', 'license_no']}
        searchPlaceholder='Search by team or license...'
        serverSearch
        loading={teamsFetching && teamRows.length === 0}
        hasMore={teamHasMore}
        onSearchChange={(q) => debouncedApplyTeamSearch(q)}
        onLoadMore={() => setTeamPage((p) => p + 1)}
        getItemKey={(t, i) => t.team_id ?? `${t.team_name}-${i}`}
        renderRight={(t) => (
          <IconButton
            aria-label='View team'
            onClick={() =>
              t.team_id && navigate(`/admin/teams/details/${t.team_id}`)
            }
            sx={{ color: '#fff', mt: 0.5 }}
          >
            <VisibilityRounded />
          </IconButton>
        )}
      />
    </>
  );
}
