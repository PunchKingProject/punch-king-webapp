import {
  Box,
  useMediaQuery
} from '@mui/material';

import { DesktopDashboard } from './components/DesktopDashboard.tsx';
import MobileDashboard from './components/MobileDashboard.tsx';


const DashboardPage = () => {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box
        sx={{
          display: isTabletUp ? 'block' : 'none',
        }}
      >
        <DesktopDashboard />
   
      </Box>
      <Box
        sx={{
          display: isTabletUp ? 'none' : 'block',
        }}
      >
        <MobileDashboard />
      </Box>
    </>
  );
};
export default DashboardPage;

// type TeamCard = {
//   team_name: string;
//   license_no: string;
//   sponsors_accrued: number;
//   ranking: number | string;
// };

// type UserSponsorshipCard = {
//   user_name: string;
//   phone_number: string;
//   sponsors_purchased: number;
//   sponsors_used: number;
// };

// // ===== Helpers =====
// const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');
// const formatRangeLabel = (from?: Date, to?: Date) => {
//   if (!from || !to) return 'Last 30 days';
//   const a = dayjs(from).format('MMM D');
//   const b = dayjs(to).format('MMM D, YYYY');
//   return `${a} – ${b}`;
// };

// // ===== Bottom Drawer just for Metrics =====
// function MetricsDateFilterDrawer({
//   range,
//   onApply,
// }: {
//   range: DateRange | undefined;
//   onApply: (next: DateRange) => void;
// }) {
//   const [open, setOpen] = useState(false);
//   const [staged, setStaged] = useState<DateRange | undefined>(range);

//   useEffect(() => setStaged(range), [range]);

//   return (
//     <>
//       <IconButton
//         aria-label='Filter metrics by date'
//         onClick={() => setOpen(true)}
//         sx={{ color: colors.Freeze }}
//       >
//         <DateFilterIcon />
//       </IconButton>

//       <Drawer
//         anchor='bottom'
//         open={open}
//         onClose={() => setOpen(false)}
//         PaperProps={{
//           sx: {
//             borderTopLeftRadius: 12,
//             borderTopRightRadius: 12,
//             background: colors.Card,
//           },
//         }}
//       >
//         <Box sx={{ p: 2 }}>
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               mb: 1,
//             }}
//           >
//             <Typography
//               variant='mediumHeaderBold'
//               sx={{ color: colors.Freeze }}
//             >
//               Filter dashboard metrics
//             </Typography>
//             <CalendarTodayIcon sx={{ color: colors.Freeze, opacity: 0.8 }} />
//           </Box>

//           <DateRangeFilter
//             range={staged}
//             onChange={(r?: DateRange) => {
//               // accept partial selection in state; only apply on button press
//               setStaged(r);
//             }}
//             icon={<DateFilterIcon />}
//           />

//           <Button
//             fullWidth
//             variant='contained'
//             sx={{ mt: 2 }}
//             onClick={() => {
//               if (staged?.from && staged.to) onApply(staged);
//               setOpen(false);
//             }}
//           >
//             Apply
//           </Button>
//         </Box>
//       </Drawer>
//     </>
//   );
// }

// const MobileDashboardPage = () => {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const secondCardRef = useRef<HTMLDivElement | null>(null);

//   // ---- Date window for metrics (you can expose a mobile date picker later) ----
//   const [metricRange, setMetricRange] = useState<[Dayjs, Dayjs]>([
//     dayjs().subtract(30, 'day'),
//     dayjs(),
//   ]);
//   const metricDayPickerRange: DateRange | undefined = {
//     from: metricRange[0].toDate(),
//     to: metricRange[1].toDate(),
//   };

//   const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');
//   const [start, end] = metricRange;

//   const {
//     data: stats,
//     isLoading: statsLoading,
//     isError: statsError,
//   } = useDashboardStats({
//     start_date: fmt(start),
//     end_date: fmt(end),
//   });

//   useEffect(() => {
//     if (statsError) toast.error('Failed to fetch dashboard stats.');
//   }, [statsError]);

//   // ---- Metrics data (keeps your UI shape) ----
//   const metricCards = [
//     {
//       title: 'All Users',
//       total: stats?.sponsor_count ?? 0,
//       percentage: '30',
//       status: true,
//     },
//     {
//       title: 'All Team',
//       total: stats?.team_count ?? 0,
//       percentage: '30',
//       status: false,
//     },
//     {
//       title: 'Subscription Volume',
//       total: stats?.subscriptions_in_range ?? 0,
//       percentage: '30',
//       status: true,
//     },
//     {
//       title: 'Licensing Volume',
//       total: stats?.licenses_in_range ?? 0,
//       percentage: '30',
//       status: false,
//     },
//     {
//       title: 'Sponsorship Volume',
//       total: stats?.sponsorship_purchases_range ?? 0,
//       percentage: '30',
//       status: true,
//     },
//   ];

//   // Center on second card for the “peek” effect
//   useEffect(() => {
//     if (secondCardRef.current) {
//       secondCardRef.current.scrollIntoView({
//         behavior: 'smooth',
//         inline: 'start',
//       });
//     }
//   }, []);

//   // ---- TEAMS (server search + paging) ----
//   const [teamSearchInput, setTeamSearchInput] = useState('');
//   const [teamQuery, setTeamQuery] = useState('');
//   const [teamPage, setTeamPage] = useState(1);
//   const [teamRows, setTeamRows] = useState<TeamCard[]>([]);

//   const debouncedApplyTeamSearch = useMemo(
//     () =>
//       debounce((q: string) => {
//         setTeamQuery(q);
//         setTeamPage(1);
//         setTeamRows([]);
//       }, 400),
//     []
//   );
//   useEffect(
//     () => () => debouncedApplyTeamSearch.cancel(),
//     [debouncedApplyTeamSearch]
//   );

//   const {
//     data: teamResp,
//     isFetching: teamsFetching,
//     isError: teamsError,
//   } = useRankedTeams({ page: teamPage, page_size: 10, search: teamQuery });

//   useEffect(() => {
//     const apiRows = teamResp?.rows ?? [];
//     const mapped: TeamCard[] = apiRows.map((rt: any) => ({
//       team_name: rt.team_name,
//       license_no: rt.license_number,
//       sponsors_accrued: rt.sponsorships,
//       ranking: rt.rank,
//     }));
//     if (teamPage === 1) setTeamRows(mapped);
//     else if (mapped.length) setTeamRows((prev) => [...prev, ...mapped]);
//   }, [teamResp, teamPage]);

//   useEffect(() => {
//     if (teamsError) toast.error('Failed to fetch ranked teams.');
//   }, [teamsError]);

//   const teamHasMore = (teamResp?.meta?.total_count ?? 0) > teamRows.length;

//   // ---- USERS (server search + paging) ----
//   const [userSearchInput, setUserSearchInput] = useState('');
//   const [userQuery, setUserQuery] = useState('');
//   const [userPage, setUserPage] = useState(1);
//   const [userRows, setUserRows] = useState<UserSponsorshipCard[]>([]);

//   const debouncedApplyUserSearch = useMemo(
//     () =>
//       debounce((q: string) => {
//         setUserQuery(q);
//         setUserPage(1);
//         setUserRows([]);
//       }, 400),
//     []
//   );
//   useEffect(
//     () => () => debouncedApplyUserSearch.cancel(),
//     [debouncedApplyUserSearch]
//   );

//   const {
//     data: usersResp,
//     isFetching: usersFetching,
//     isError: usersError,
//   } = useRankedUsers({ page: userPage, page_size: 3, search: userQuery });

//   useEffect(() => {
//     const apiRows = usersResp?.rows ?? [];
//     const mapped: UserSponsorshipCard[] = apiRows.map((u) => ({
//       user_name: u.name,
//       phone_number: u.phone_number,
//       sponsors_purchased: u.total_points_purchased,
//       sponsors_used: u.total_amount_sponsored, // adjust if you have a different field for "used"
//     }));
//     if (userPage === 1) setUserRows(mapped);
//     else if (mapped.length) setUserRows((prev) => [...prev, ...mapped]);
//   }, [usersResp, userPage]);

//   useEffect(() => {
//     if (usersError) toast.error('Failed to fetch ranked users.');
//   }, [usersError]);

//   const userHasMore = (usersResp?.meta?.total_count ?? 0) > userRows.length;

//   return (
//     <>
//       {/* Sliding Cards */}

//       {/* Header with range label + drawer trigger — applies ONLY to metrics */}
//       <Box
//         sx={{
//           px: 2,
//           pt: 1,
//           pb: 0.5,
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <Typography variant='mediumHeaderBold' sx={{ color: colors.Freeze }}>
//           Dashboard
//         </Typography>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <Typography
//             variant='bodyTextMilkDefault'
//             sx={{ color: colors.Freeze, opacity: 0.8 }}
//           >
//             {formatRangeLabel(
//               metricDayPickerRange?.from,
//               metricDayPickerRange?.to
//             )}
//           </Typography>
//           <MetricsDateFilterDrawer
//             range={metricDayPickerRange}
//             onApply={(r) => {
//               if (!r.from || !r.to) return;
//               setMetricRange([dayjs(r.from), dayjs(r.to)]);
//               // NOTE: teams/users are intentionally NOT reset here per design.
//             }}
//           />
//         </Box>
//       </Box>

//       <Box
//         ref={containerRef}
//         sx={{
//           display: 'flex',
//           overflow: 'auto',
//           flexDirection: 'row',
//           width: '100%',
//           gap: '40px',
//         }}
//       >
//         {metricCards.map((item, index) => {
//           return (
//             <Box
//               key={item.title}
//               ref={index === 1 ? secondCardRef : null}
//               sx={{
//                 background: colors.Card,
//                 minWidth: '230px',
//                 width: '110vw',
//                 maxWidth: '489px',
//                 border: '1px solid #3B3B3B',
//                 height: '135px',
//                 borderRadius: '10px',
//                 boxShadow: '2px 2px 10px 2px #2B2B2BB0',
//                 padding: '20px 10px',
//                 gap: '25px',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 opacity: statsLoading ? 0.6 : 1,
//               }}
//             >
//               <Typography
//                 variant='mediumHeaderBold'
//                 component={'p'}
//                 sx={{
//                   textTransform: 'uppercase',
//                   color: colors.Freeze,
//                 }}
//               >
//                 {item.title}
//               </Typography>
//               <Typography
//                 variant='bodyTextMilkDefault'
//                 component={'p'}
//                 sx={{
//                   fontWeight: 700,
//                   color: colors.Freeze,
//                 }}
//               >
//                 {item.total}
//               </Typography>
//               <Box
//                 sx={{
//                   width: '100%',
//                   textAlign: 'right',
//                 }}
//               >
//                 <Typography
//                   variant='bodyTextMilkDefault'
//                   component={'p'}
//                   sx={{
//                     fontWeight: 500,
//                     color: item.status ? colors.Success : colors.Caution,
//                   }}
//                 >
//                   {`You have ${item.percentage}% ${
//                     item.status ? 'climbed ' : 'dip'
//                   }`}
//                 </Typography>
//               </Box>
//             </Box>
//           );
//         })}
//       </Box>

//       <ScrollableSection<TeamCard>
//         title='TEAMS by ranking'
//         items={teamRows}
//         fields={teamFieldData}
//         searchKeys={['team_name', 'license_no']}
//         searchPlaceholder='Search by team or license...'
//         serverSearch
//         loading={teamsFetching && teamRows.length === 0}
//         hasMore={teamHasMore}
//         onSearchChange={(q) => {
//           setTeamSearchInput(q);
//           debouncedApplyTeamSearch(q);
//         }}
//         onLoadMore={() => setTeamPage((p) => p + 1)}
//       />

//       <ScrollableSection<UserSponsorshipCard>
//         title='Users by sponsorships'
//         items={userRows}
//         fields={userSponsorshipFieldData}
//         searchKeys={['user_name', 'phone_number']}
//         searchPlaceholder='Search by username or phone number...'
//         serverSearch
//         loading={usersFetching && userRows.length === 0}
//         hasMore={userHasMore}
//         onSearchChange={(q) => {
//           setUserSearchInput(q);
//           debouncedApplyUserSearch(q);
//         }}
//         onLoadMore={() => setUserPage((p) => p + 1)}
//       />
//     </>
//   );
// };

// const DesktopDashboardPage = () => {
//   const format = (d: Dayjs) => d.format('YYYY-MM-DD');

//   const [range, setRange] = useState<[Dayjs, Dayjs]>([
//     dayjs('2025-08-11'),
//     dayjs(),
//   ]);

//   // adapter for react-day-picker (Date objects)
//   const dayPickerRange: DateRange | undefined = {
//     from: range[0].toDate(),
//     to: range[1].toDate(),
//   };

//   const handleRangeChange = (r?: DateRange) => {
//     if (!r?.from || !r.to) return; // wait for full selection
//     setRange([dayjs(r.from), dayjs(r.to)]);
//     // no manual refetch needed; useDashboardStats key depends on start/end
//   };

//   const [start, end] = range;
//   const startStr = start ? format(start) : '';
//   const endStr = end ? format(end) : '';

//   // ---- Dashboard cards (stats) ----
//   const {
//     data: statsData,
//     isLoading: statsLoading,
//     isError: statsError,
//   } = useDashboardStats({
//     start_date: startStr,
//     end_date: endStr,
//   });

//   const cards: MetricCard[] = useMemo(() => {
//     if (!statsData) {
//       return [
//         { title: 'All Users', total: 0, deltaPct: 0, trendingUp: true },
//         { title: 'All Team', total: 0, deltaPct: 0, trendingUp: true },
//         {
//           title: 'Subscription Volume',
//           total: 0,
//           deltaPct: 0,
//           trendingUp: true,
//         },
//         {
//           title: 'Licensing Volume',
//           total: 0,
//           deltaPct: 0,
//           trendingUp: true,
//         },
//         {
//           title: 'Sponsorship Volume',
//           total: 0,
//           deltaPct: 0,
//           trendingUp: true,
//         },
//       ];
//     }

//     return [
//       {
//         title: 'All Users (Sponsors)',
//         total: statsData.sponsor_count,
//         deltaPct: 0,
//         trendingUp: true,
//       },
//       {
//         title: 'All Team',
//         total: statsData.team_count,
//         deltaPct: 0,
//         trendingUp: true,
//       },
//       {
//         title: 'Subscription Volume',
//         total: statsData.subscriptions_in_range,
//         deltaPct: 0,
//         trendingUp: true,
//       },
//       {
//         title: 'Licensing Volume',
//         total: statsData.licenses_in_range,
//         deltaPct: 0,
//         trendingUp: true,
//       },
//       {
//         title: 'Sponsorship Volume',
//         total: statsData.sponsorship_purchases_range,
//         deltaPct: 0,
//         trendingUp: true,
//       },
//     ];
//   }, [statsData]);

//   // ---- Teams section (server pagination/search) ----
//   const [page, setPage] = useState(0); // zero-based page for UI
//   const [pageSize, setPageSize] = useState(10);

//   const [search, setSearch] = useState(''); // <-- used for fetching (debounced)
//   const [searchInput, setSearchInput] = useState(''); // <-- used to control the input immediately

//   // stable debounced applier
//   const debouncedApplySearch = useMemo(
//     () => debounce((value: string) => setSearch(value), 400),
//     []
//   );

//   // clean up on unmount
//   useEffect(() => {
//     return () => debouncedApplySearch.cancel();
//   }, [debouncedApplySearch]);

//   const {
//     data: teamSectionData,
//     isLoading: teamsLoading,
//     isError: teamsError,
//   } = useRankedTeams({ page: page + 1, page_size: pageSize, search });

//   const teamRows: TeamRow[] = useMemo(() => {
//     const apiRows = teamSectionData?.rows ?? [];
//     return apiRows.map((rt) => ({
//       team_name: rt.team_name,
//       license_no: rt.license_number,
//       sponsors_accrued: rt.sponsorships,
//       ranking: rt.rank,
//     }));
//   }, [teamSectionData]);

//   // --- Errors
//   useEffect(() => {
//     if (statsError) toast.error('Failed to fetch dashboard stats.');
//     if (teamsError) toast.error('Failed to fetch ranked teams.');
//   }, [statsError, teamsError]);

//   // ---------- Users (server pagination/search) ----------
//   const [usersPage, setUsersPage] = useState(0); // 0-based UI
//   const [usersPageSize, setUsersPageSize] = useState(10);

//   const [usersSearch, setUsersSearch] = useState(''); // debounced param
//   const [usersSearchInput, setUsersSearchInput] = useState(''); // immediate input

//   const debouncedApplyUsersSearch = useMemo(
//     () => debounce((value: string) => setUsersSearch(value), 400),
//     []
//   );
//   useEffect(
//     () => () => debouncedApplyUsersSearch.cancel(),
//     [debouncedApplyUsersSearch]
//   );

//   const {
//     data: rankedUsersData,
//     isLoading: usersLoading,
//     isError: usersError,
//   } = useRankedUsers({
//     page: usersPage + 1, // API is 1-based
//     page_size: usersPageSize,
//     search: usersSearch,
//   });

//   const userRows: UserRow[] = useMemo(() => {
//     const apiRows = rankedUsersData?.rows ?? [];
//     return apiRows.map((u) => ({
//       name: u.name,
//       email: u.email,
//       phone_number: u.phone_number,
//       total_points_purchased: u.total_points_purchased,
//       total_amount_sponsored: u.total_amount_sponsored,
//     }));
//   }, [rankedUsersData]);

//   useEffect(() => {
//     if (usersError) toast.error('Failed to fetch ranked users.');
//   }, [usersError]);

//   return (
//     <>
//       <AdminSection
//         title='Dashboard'
//         toolbar={
//           <DateRangeFilter
//             range={dayPickerRange}
//             onChange={handleRangeChange}
//             icon={<DateFilterIcon />}
//           />
//         }
//         cards={statsLoading ? undefined : cards}
//         loading={statsLoading}
//       ></AdminSection>

//       <Box
//         sx={{
//           padding: '1.56em 6.98em',
//           '@media (min-width:910px) and (max-width:1000px)': {
//             padding: '1.56em 2em', // override between 900px and 1000px
//             pl: '3em',
//           },
//           '@media (min-width:1000px) and (max-width:1100px)': {
//             // height: '200px',
//             paddingX: '1em', // override between 900px and 1000px
//             pl: '2rem',
//           },
//         }}
//       >
//         {/* <PaginatedTable
//           title='TEAMS by ranking'
//           rows={teamData}
//           columns={teamColumns}
//           searchFields={['team_name', 'license_no']}
//           searchPlaceholder='Search'
//           initialRowsPerPage={10}
//           maxBodyHeight={430}
//           getRowKey={(r) => `${r.team_name}-${r.license_no}`}
//         /> */}

//         <TeamsSection
//           columns={teamColumns} // pass your columns
//           mode='server'
//           loading={teamsLoading}
//           rows={teamRows}
//           totalCount={teamSectionData?.meta?.total_count ?? 0}
//           pageIndex={page}
//           rowsPerPage={pageSize}
//           onPageChange={setPage}
//           onRowsPerPageChange={setPageSize}
//           // 👇 input shows this immediately
//           searchValue={searchInput}
//           // 👇 update input instantly, trigger API param after debounce
//           onSearchChange={(val) => {
//             setSearchInput(val);
//             debouncedApplySearch(val);
//           }}
//         />

//         {/* USERS server table */}
//         <UsersSection
//           columns={rankedUserColumns}
//           mode='server'
//           loading={usersLoading}
//           rows={userRows}
//           totalCount={rankedUsersData?.meta?.total_count ?? 0}
//           pageIndex={usersPage}
//           rowsPerPage={usersPageSize}
//           onPageChange={setUsersPage}
//           onRowsPerPageChange={setUsersPageSize}
//           searchValue={usersSearchInput}
//           onSearchChange={(val) => {
//             setUsersSearchInput(val);
//             debouncedApplyUsersSearch(val);
//           }}
//         />
//       </Box>
//     </>
//   );
// };
