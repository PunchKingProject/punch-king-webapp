import { Box, Typography, useMediaQuery } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'react-toastify';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
import DateRangeFilter from '../../../components/filters/DateRangeFilter';
import {
  type TableColumn,
} from '../../../components/tables/PaginatedTable';
import { colors } from '../../../theme/colors';
import AdminSection from '../components/AdminSection';
import type { MetricCard } from '../components/CardGrid';
import { ScrollableSection } from '../components/ScrollableSection';
import {
  teamData,
  teamFieldData,
  userSponsorshipData,
  userSponsorshipFieldData,
} from '../data';
import TeamsSection, { type TeamRow } from './TeamsSection';
import type { UserRow } from './UsersSection';
import UsersSection from './UsersSection';
import { useDashboardStats } from './hooks/useDashboardStats';
import { useRankedTeams } from './hooks/useRankedTeams';
import { useRankedUsers } from './hooks/useRankedUsers';

const data = [
  { title: 'All Users', total: 200, percentage: '30', status: true },
  { title: 'All Team', total: 200, percentage: '30', status: false },
  { title: 'Subscription Volume', total: 200, percentage: '30', status: true },
  { title: 'Licensing Volume', total: 200, percentage: '30', status: false },
  { title: 'Sponsorship Volume', total: 200, percentage: '30', status: true },
];

const teamColumns: TableColumn<TeamRow>[] = [
  { field: 'team_name', header: 'Team name' },
  { field: 'license_no', header: 'License number' },
  { field: 'sponsors_accrued', header: 'Sponsors accrued', align: 'right' },
  { field: 'ranking', header: 'Ranking', align: 'right' },
];

const rankedUserColumns: TableColumn<UserRow>[] = [
  { field: 'name', header: 'User name' },
  { field: 'email', header: 'Email' },
  { field: 'phone_number', header: 'Phone number' },
  {
    field: 'total_points_purchased',
    header: 'Points purchased',
    align: 'right',
  },
  {
    field: 'total_amount_sponsored',
    header: 'Amount sponsored',
    align: 'right',
  },
];


export type UserSponsorship = {
  user_name: string;
  phone_number: string;
  sponsors_purchased: number;
  sponsors_used: number;
};

const DashboardPage = () => {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box
        sx={{
          display: isTabletUp ? 'block' : 'none',
        }}
      >
        <DesktopDashboardPage />
      </Box>
      <Box
        sx={{
          display: isTabletUp ? 'none' : 'block',
        }}
      >
        <MobileDashboardPage />
      </Box>
    </>
  );
};
export default DashboardPage;

const MobileDashboardPage = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const secondCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (secondCardRef.current) {
      secondCardRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
      });
    }
  }, []);

  return (
    <>
      {/* Sliding Cards */}
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          border: '2px solid red',
          overflow: 'auto',
          flexDirection: 'row',
          width: '100%',
          gap: '40px',
        }}
      >
        {data.map((item, index) => {
          return (
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
              }}
            >
              <Typography
                variant='mediumHeaderBold'
                component={'p'}
                sx={{
                  textTransform: 'uppercase',
                  color: colors.Freeze,
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant='bodyTextMilkDefault'
                component={'p'}
                sx={{
                  fontWeight: 700,
                  color: colors.Freeze,
                }}
              >
                {item.total}
              </Typography>
              <Box
                sx={{
                  border: '2px solid red',
                  width: '100%',
                  textAlign: 'right',
                }}
              >
                <Typography
                  variant='bodyTextMilkDefault'
                  component={'p'}
                  sx={{
                    fontWeight: 500,
                    color: item.status ? colors.Success : colors.Caution,
                  }}
                >
                  {`You have ${item.percentage}% ${
                    item.status ? 'climbed ' : 'dip'
                  }`}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <ScrollableSection<Team>
        title='TEAMS by ranking'
        items={teamData}
        fields={teamFieldData}
        searchKeys={['team_name', 'license_no']}
        searchPlaceholder='Search by team or license...'
      />

      <ScrollableSection<UserSponsorship>
        title='Users by sponsorships'
        items={userSponsorshipData}
        fields={userSponsorshipFieldData}
        searchKeys={['user_name', 'phone_number']}
        searchPlaceholder='Search by username or phone number...'
      />
    </>
  );
};

const DesktopDashboardPage = () => {
  const format = (d: Dayjs) => d.format('YYYY-MM-DD');

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
          title: 'Sponsorship Volume',
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
        title: 'Sponsorship Volume',
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

  const teamRows: TeamRow[] = useMemo(() => {
    const apiRows = teamSectionData?.rows ?? [];
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

  const userRows: UserRow[] = useMemo(() => {
    const apiRows = rankedUsersData?.rows ?? [];
    return apiRows.map((u) => ({
      name: u.name,
      email: u.email,
      phone_number: u.phone_number,
      total_points_purchased: u.total_points_purchased,
      total_amount_sponsored: u.total_amount_sponsored,
    }));
  }, [rankedUsersData]);

  useEffect(() => {
    if (usersError) toast.error('Failed to fetch ranked users.');
  }, [usersError]);

  return (
    <>
      <AdminSection
        title='Dashboard'
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
          totalCount={teamSectionData?.meta?.total_count ?? 0}
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
          totalCount={rankedUsersData?.meta?.total_count ?? 0}
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

const dashboardCards: MetricCard[] = [
  { title: 'All Users', total: 200, deltaPct: 30, trendingUp: false },
  { title: 'All Team', total: 200, deltaPct: 30, trendingUp: true },
  { title: 'Subscription Volume', total: 200, deltaPct: 30, trendingUp: true },
  {
    title: 'Licensing Volume',
    total: 200,
    deltaPct: 30,
    trendingUp: false,
  },
  {
    title: 'Sponsorship Volume',
    total: 200,
    deltaPct: 30,
    trendingUp: false,
  },
];



