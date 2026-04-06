import { Box } from '@mui/material';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'react-toastify';
import DateFilterIcon from '../../../../assets/filterTimeFrameIcon.svg?react';
import DateRangeFilter from '../../../../components/filters/DateRangeFilter.tsx';
import { useRankedTeams } from '../../Dashboard/hooks';
import AdminSection from '../../components/AdminSection.tsx';
import { useTeamDashboardStats } from '../hooks/useTeamDashboardStats.ts';

import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../../routes/routePath.ts';
import type { TeamTableRow } from './TeamsSection.tsx';
import TeamsSection from './TeamsSection.tsx';

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

function DesktopTeamDashboard() {

  const navigate = useNavigate()
  // ---- date range for TEAMS dashboard cards ----
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);

  const dayPickerRange: DateRange | undefined = {
    from: range[0].toDate(),
    to: range[1].toDate(),
  };
  const [start, end] = range;

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useTeamDashboardStats({
    start_date: fmt(start),
    end_date: fmt(end),
  });

  useEffect(() => {
    if (statsError) toast.error('Failed to fetch team dashboard stats.');
  }, [statsError]);

  const cards = useMemo(() => {
    const s = stats;
    return [
      {
        title: 'All Teams',
        total: s?.total_teams ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'Teams with Subscriptions',
        total: s?.teams_with_active_sub ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'Teams with License',
        total: s?.teams_with_active_license ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'Without Subscription',
        total: s?.teams_without_active_sub ?? 0,
        deltaPct: 0,
        trendingUp: false,
      },
      {
        title: 'Without License',
        total: s?.teams_without_active_license ?? 0,
        deltaPct: 0,
        trendingUp: false,
      },
    ];
  }, [stats]);

  // ---- server table (same pattern as dashboard) ----
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const debouncedApplySearch = useMemo(
    () => debounce((value: string) => setSearch(value), 400),
    []
  );

  useEffect(() => () => debouncedApplySearch.cancel(), [debouncedApplySearch]);

  const {
    data: teamResp,
    isLoading: teamsLoading,
    isError: teamsError,
  } = useRankedTeams({
    page: page + 1,
    page_size: pageSize,
    search,
  });

  useEffect(() => {
    if (teamsError) toast.error('Failed to fetch ranked teams.');
  }, [teamsError]);

  const teamRows: TeamTableRow[] = useMemo(() => {
    const apiRows = teamResp?.data.data ?? [];
    return apiRows.map((rt) => ({
      team_id: rt.team_id,
      team_name: rt.team_name,
      license_number: rt.license_number,
      sponsors_accrued: rt.sponsorships,
      ranking: rt.rank,
    }));
  }, [teamResp]);

  const handleView = (row: TeamTableRow) => {
    navigate(ROUTES.TEAMS_DETAILS.replace(':teamId', String(row.team_id
      
    )));
  }

  return (
    <>
      <AdminSection
        title='TEAMS DASHBOARD'
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
        cards={statsLoading ? undefined : cards}
        loading={statsLoading}
      />

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
        <TeamsSection
          title='TEAMS TABLE'
          rows={teamRows}
          mode='server'
          loading={teamsLoading}
          totalCount={teamResp?.data.metadata.total_count ?? 0} // ✅ correct total
          pageIndex={page}
          rowsPerPage={pageSize}
          onPageChange={setPage}
          onRowsPerPageChange={setPageSize}
          searchValue={searchInput}
          onSearchChange={(val) => {
            setSearchInput(val);
            debouncedApplySearch(val);
          }}
          onView={handleView}
        />
        ;
      </Box>
    </>
  );
}

export default DesktopTeamDashboard;
