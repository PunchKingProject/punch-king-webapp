import {
    Box,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'react-toastify';
import DateFilterIcon from '../../../../assets/filterTimeFrameIcon.svg?react';
import DateRangeFilter from '../../../../components/filters/DateRangeFilter.tsx';
import AdminSection from '../../components/AdminSection.tsx';
import type { MetricCard } from '../../components/CardGrid.tsx';
import { useDashboardStats, useRankedTeams, useRankedUsers } from '../hooks';
import { rankedUserColumns, teamColumns } from '../ui/columns.ts';
import TeamsSection from './TeamsSection.tsx';
import UsersSection from './UsersSection.tsx';





  const format = (d: Dayjs) => d.format('YYYY-MM-DD');
export const DesktopDashboard = () => {


  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs('2025-08-11'),
    dayjs(),
  ]);

  // adapter for react-day-picker (Date objects)
  const dayPickerRange: DateRange | undefined = {
    from: range[0].toDate(),
    to: range[1].toDate(),
  };

  const handleRangeChange = (r?: DateRange) => {
    if (!r?.from || !r.to) return; // wait for full selection
    setRange([dayjs(r.from), dayjs(r.to)]);
    // no manual refetch needed; useDashboardStats key depends on start/end
  };

  const [start, end] = range;
  const startStr = start ? format(start) : '';
  const endStr = end ? format(end) : '';

  // ---- Dashboard cards (stats) ----
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
  } = useDashboardStats({
    start_date: startStr,
    end_date: endStr,
  });

  const cards: MetricCard[] = useMemo(() => {
    if (!statsData) {
      return [
        { title: 'All Users', total: 0, deltaPct: 0, trendingUp: true },
        { title: 'All Team', total: 0, deltaPct: 0, trendingUp: true },
        {
          title: 'Subscription Volume',
          total: 0,
          deltaPct: 0,
          trendingUp: true,
        },
        {
          title: 'Licensing Volume',
          total: 0,
          deltaPct: 0,
          trendingUp: true,
        },
        {
          title: 'Chips Volume',
          total: 0,
          deltaPct: 0,
          trendingUp: true,
        },
      ];
    }

    return [
      {
        title: 'All Users (Sponsors)',
        total: statsData.sponsor_count,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'All Team',
        total: statsData.team_count,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'Subscription Volume',
        total: statsData.subscriptions_in_range,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'Licensing Volume',
        total: statsData.licenses_in_range,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'Chip Volume',
        total: statsData.sponsorship_purchases_range,
        deltaPct: 0,
        trendingUp: true,
      },
    ];
  }, [statsData]);

  // ---- Teams section (server pagination/search) ----
  const [page, setPage] = useState(0); // zero-based page for UI
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState(''); // <-- used for fetching (debounced)
  const [searchInput, setSearchInput] = useState(''); // <-- used to control the input immediately

  // stable debounced applier
  const debouncedApplySearch = useMemo(
    () => debounce((value: string) => setSearch(value), 400),
    []
  );

  // clean up on unmount
  useEffect(() => {
    return () => debouncedApplySearch.cancel();
  }, [debouncedApplySearch]);

  const {
    data: teamSectionData,
    isLoading: teamsLoading,
    isError: teamsError,
  } = useRankedTeams({ page: page + 1, page_size: pageSize, search });

  const teamRows = useMemo(() => {
    const apiRows = teamSectionData?.data.data ?? [];
    return apiRows.map((rt) => ({
      team_name: rt.team_name,
      license_no: rt.license_number,
      sponsors_accrued: rt.sponsorships,
      ranking: rt.rank,
    }));
  }, [teamSectionData]);

  // --- Errors
  useEffect(() => {
    if (statsError) toast.error('Failed to fetch dashboard stats.');
    if (teamsError) toast.error('Failed to fetch ranked teams.');
  }, [statsError, teamsError]);

  // ---------- Users (server pagination/search) ----------
  const [usersPage, setUsersPage] = useState(0); // 0-based UI
  const [usersPageSize, setUsersPageSize] = useState(10);

  const [usersSearch, setUsersSearch] = useState(''); // debounced param
  const [usersSearchInput, setUsersSearchInput] = useState(''); // immediate input

  const debouncedApplyUsersSearch = useMemo(
    () => debounce((value: string) => setUsersSearch(value), 400),
    []
  );
  useEffect(
    () => () => debouncedApplyUsersSearch.cancel(),
    [debouncedApplyUsersSearch]
  );

  const {
    data: rankedUsersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useRankedUsers({
    page: usersPage + 1, // API is 1-based
    page_size: usersPageSize,
    search: usersSearch,
  });

  const userRows= useMemo(() => {
    const apiRows = rankedUsersData?.data.data ?? [];
    return apiRows.map((u) => ({
      user_name: u.name,
      email: u.email,
      phone_number: u.phone_number,
      sponsors_purchased: u.total_points_purchased,
      sponsors_used: u.total_amount_sponsored,
    }));
  }, [rankedUsersData]);

  useEffect(() => {
    if (usersError) toast.error('Failed to fetch ranked users.');
  }, [usersError]);

  return (
    <>
      <AdminSection
        title=''
        toolbar={
          <DateRangeFilter
            range={dayPickerRange}
            onChange={handleRangeChange}
            icon={<DateFilterIcon />}
          />
        }
        cards={statsLoading ? undefined : cards}
        loading={statsLoading}
      ></AdminSection>

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
        {/* <PaginatedTable
          title='TEAMS by ranking'
          rows={teamData}
          columns={teamColumns}
          searchFields={['team_name', 'license_no']}
          searchPlaceholder='Search'
          initialRowsPerPage={10}
          maxBodyHeight={430}
          getRowKey={(r) => `${r.team_name}-${r.license_no}`}
        /> */}

        <TeamsSection
          columns={teamColumns} // pass your columns
          mode='server'
          loading={teamsLoading}
          rows={teamRows}
          totalCount={teamSectionData?.data?.metadata?.total_count ?? 0}
          pageIndex={page}
          rowsPerPage={pageSize}
          onPageChange={setPage}
          onRowsPerPageChange={setPageSize}
          // 👇 input shows this immediately
          searchValue={searchInput}
          // 👇 update input instantly, trigger API param after debounce
          onSearchChange={(val) => {
            setSearchInput(val);
            debouncedApplySearch(val);
          }}
        />

        {/* USERS server table */}
        <UsersSection
          columns={rankedUserColumns}
          mode='server'
          loading={usersLoading}
          rows={userRows}
          totalCount={rankedUsersData?.data.metadata.total_count ?? 0}
          pageIndex={usersPage}
          rowsPerPage={usersPageSize}
          onPageChange={setUsersPage}
          onRowsPerPageChange={setUsersPageSize}
          searchValue={usersSearchInput}
          onSearchChange={(val) => {
            setUsersSearchInput(val);
            debouncedApplyUsersSearch(val);
          }}
        />
      </Box>
    </>
  );
};
