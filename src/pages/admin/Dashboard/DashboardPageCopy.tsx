// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Drawer,
//   IconButton,
//   InputAdornment,
//   Skeleton,
//   TextField,
//   Typography,
//   useMediaQuery,
// } from '@mui/material';
// import dayjs, { Dayjs } from 'dayjs';
// import debounce from 'lodash.debounce';
// import { useEffect, useMemo, useRef, useState } from 'react';
// import type { DateRange } from 'react-day-picker';
// import { toast } from 'react-toastify';
// import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
// import DateRangeFilter from '../../../components/filters/DateRangeFilter';
// import { type TableColumn } from '../../../components/tables/PaginatedTable';
// import { colors } from '../../../theme/colors';
// import AdminSection from '../components/AdminSection';
// import type { MetricCard } from '../components/CardGrid';
// import { ScrollableSection } from '../components/ScrollableSection';
// import FilterListIcon from '@mui/icons-material/FilterList';

// import SearchIcon from '@mui/icons-material/Search';

// import {
//   teamData,
//   teamFieldData,
//   userSponsorshipData,
//   userSponsorshipFieldData,
// } from '../data';
// import TeamsSection, { type TeamRow } from './components/TeamsSection';
// import type { UserRow } from './components/UsersSection';
// import UsersSection from './components/UsersSection';
// import { useDashboardStats } from './hooks/useDashboardStats';
// import { useRankedTeams } from './hooks/useRankedTeams';
// import { useRankedUsers } from './hooks/useRankedUsers';

// const data = [
//   { title: 'All Users', total: 200, percentage: '30', status: true },
//   { title: 'All Team', total: 200, percentage: '30', status: false },
//   { title: 'Subscription Volume', total: 200, percentage: '30', status: true },
//   { title: 'Licensing Volume', total: 200, percentage: '30', status: false },
//   { title: 'Sponsorship Volume', total: 200, percentage: '30', status: true },
// ];

// const teamColumns: TableColumn<TeamRow>[] = [
//   { field: 'team_name', header: 'Team name' },
//   { field: 'license_no', header: 'License number' },
//   { field: 'sponsors_accrued', header: 'Sponsors accrued', align: 'right' },
//   { field: 'ranking', header: 'Ranking', align: 'right' },
// ];

// const rankedUserColumns: TableColumn<UserRow>[] = [
//   { field: 'name', header: 'User name' },
//   { field: 'email', header: 'Email' },
//   { field: 'phone_number', header: 'Phone number' },
//   {
//     field: 'total_points_purchased',
//     header: 'Points purchased',
//     align: 'right',
//   },
//   {
//     field: 'total_amount_sponsored',
//     header: 'Amount sponsored',
//     align: 'right',
//   },
// ];

// export type UserSponsorship = {
//   user_name: string;
//   email?:string;
//   phone_number: string;
//   sponsors_purchased: number;
//   sponsors_used: number;
// };

// const DashboardPage = () => {
//   const isTabletUp = useMediaQuery('(min-width:910px)');
//   return (
//     <>
//       <Box
//         sx={{
//           display: isTabletUp ? 'block' : 'none',
//         }}
//       >
//         <DesktopDashboardPage />
//       </Box>
//       <Box
//         sx={{
//           display: isTabletUp ? 'none' : 'block',
//         }}
//       >
//         <MobileDashboardPage />
//       </Box>
//     </>
//   );
// };
// export default DashboardPage;

// const MobileDashboardPage = () => {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const secondCardRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (secondCardRef.current) {
//       secondCardRef.current.scrollIntoView({
//         behavior: 'smooth',
//         inline: 'start',
//       });
//     }
//   }, []);

//   return (
//     <>
//       {/* Sliding Cards */}
//       {/* <Box
//         ref={containerRef}
//         sx={{
//           display: 'flex',
//           border: '2px solid red',
//           overflow: 'auto',
//           flexDirection: 'row',
//           width: '100%',
//           gap: '40px',
//         }}
//       >
//         {data.map((item, index) => {
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
//                   border: '2px solid red',
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

//       <ScrollableSection<Team>
//         title='TEAMS by ranking'
//         items={teamData}
//         fields={teamFieldData}
//         searchKeys={['team_name', 'license_no']}
//         searchPlaceholder='Search by team or license...'
//       />

//       <ScrollableSection<UserSponsorship>
//         title='Users by sponsorships'
//         items={userSponsorshipData}
//         fields={userSponsorshipFieldData}
//         searchKeys={['user_name', 'phone_number']}
//         searchPlaceholder='Search by username or phone number...'
//       /> */}
//       <MetricCardsScroller />
//       <MobileTeamsPanel />
//       <MobileUsersPanel />
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

// const dashboardCards: MetricCard[] = [
//   { title: 'All Users', total: 200, deltaPct: 30, trendingUp: false },
//   { title: 'All Team', total: 200, deltaPct: 30, trendingUp: true },
//   { title: 'Subscription Volume', total: 200, deltaPct: 30, trendingUp: true },
//   {
//     title: 'Licensing Volume',
//     total: 200,
//     deltaPct: 30,
//     trendingUp: false,
//   },
//   {
//     title: 'Sponsorship Volume',
//     total: 200,
//     deltaPct: 30,
//     trendingUp: false,
//   },
// ];

// // ---------- Utilities ----------
// function useDebouncedSetter<T>(setter: (v: T) => void, delay = 400) {
//   const debounced = useMemo(() => debounce(setter, delay), [setter, delay]);
//   useEffect(() => () => debounced.cancel(), [debounced]);
//   return debounced;
// }

// // ---------- Metric Cards ----------
// type MetricCardItem = {
//   title: string;
//   total: number | string;
//   percentChange?: number; // optional until backend provides delta %
//   isUpwardTrend?: boolean;
// };

// function MetricStatCard({ item }: { item: MetricCardItem }) {
//   const showDelta =
//     typeof item.percentChange === 'number' &&
//     typeof item.isUpwardTrend === 'boolean';
//   return (
//     <Box
//       sx={{
//         backgroundColor: colors.Card,
//         minWidth: 230,
//         width: '85vw',
//         maxWidth: 489,
//         height: 135,
//         borderRadius: '10px',
//         border: '1px solid #3B3B3B',
//         boxShadow: '2px 2px 10px 2px #2B2B2BB0',
//         p: '20px 12px',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//         scrollSnapAlign: 'start',
//       }}
//     >
//       <Typography
//         variant='mediumHeaderBold'
//         component='p'
//         sx={{ textTransform: 'uppercase', color: colors.Freeze }}
//       >
//         {item.title}
//       </Typography>

//       <Typography
//         variant='bodyTextMilkDefault'
//         component='p'
//         sx={{ fontWeight: 700, color: colors.Freeze }}
//       >
//         {item.total}
//       </Typography>

//       {showDelta && (
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'flex-end',
//             alignItems: 'center',
//             gap: 0.5,
//           }}
//         >
//           {item.isUpwardTrend ? (
//             <ArrowUpwardIcon sx={{ fontSize: 18, color: colors.Success }} />
//           ) : (
//             <ArrowDownwardIcon sx={{ fontSize: 18, color: colors.Caution }} />
//           )}
//           <Typography
//             variant='bodyTextMilkDefault'
//             component='p'
//             sx={{
//               fontWeight: 500,
//               color: item.isUpwardTrend ? colors.Success : colors.Caution,
//               whiteSpace: 'nowrap',
//             }}
//           >
//             {`You have ${Math.abs(item.percentChange!)}% ${
//               item.isUpwardTrend ? 'climbed' : 'dip'
//             }`}
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   );
// }

// function MetricStatCardSkeleton() {
//   return (
//     <Box
//       sx={{
//         backgroundColor: colors.Card,
//         minWidth: 230,
//         width: '85vw',
//         maxWidth: 489,
//         height: 135,
//         borderRadius: '10px',
//         border: '1px solid #3B3B3B',
//         boxShadow: '2px 2px 10px 2px #2B2B2BB0',
//         p: '20px 12px',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//         scrollSnapAlign: 'start',
//       }}
//     >
//       <Skeleton variant='text' width='60%' height={20} />
//       <Skeleton variant='text' width='40%' height={28} />
//       <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//         <Skeleton variant='text' width={140} height={20} />
//       </Box>
//     </Box>
//   );
// }

// // ---------- Mobile Date Filter (Drawer) ----------
// function MobileDateFilter({
//   range,
//   onChange,
// }: {
//   range: DateRange | undefined;
//   onChange: (r?: DateRange) => void;
// }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <>
//       <IconButton
//         onClick={() => setOpen(true)}
//         aria-label='Open date filter'
//         sx={{ color: colors.Freeze }}
//       >
//         {/* Use your SVG icon; keeping a tiny MUI icon fallback for dev */}
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
//             backgroundColor: colors.Card,
//           },
//         }}
//       >
//         <Box sx={{ p: 2 }}>
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               mb: 1,
//             }}
//           >
//             <Typography
//               variant='mediumHeaderBold'
//               sx={{ color: colors.Freeze }}
//             >
//               Filter by date
//             </Typography>
//             <IconButton
//               onClick={() => setOpen(false)}
//               aria-label='Close date filter'
//               sx={{ color: colors.Freeze }}
//             >
//               <FilterListIcon />
//             </IconButton>
//           </Box>

//           <DateRangeFilter
//             range={range}
//             onChange={onChange}
//             icon={<DateFilterIcon />}
//           />

//           <Button
//             fullWidth
//             sx={{ mt: 2 }}
//             variant='contained'
//             onClick={() => setOpen(false)}
//           >
//             Apply
//           </Button>
//         </Box>
//       </Drawer>
//     </>
//   );
// }

// // ---------- Metric cards scroller (uses dashboard stats + date filter) ----------
// function MetricCardsScroller() {
//   // date state (same format as your desktop flow)
//   const format = (d: Dayjs) => d.format('YYYY-MM-DD');
//   const [range, setRange] = useState<[Dayjs, Dayjs]>([
//     dayjs().subtract(30, 'day'),
//     dayjs(),
//   ]);
//   const dayPickerRange: DateRange | undefined = {
//     from: range[0].toDate(),
//     to: range[1].toDate(),
//   };
//   const [start, end] = range;
//   const startStr = format(start);
//   const endStr = format(end);

//   const {
//     data: stats,
//     isLoading,
//     isError,
//   } = useDashboardStats({ start_date: startStr, end_date: endStr });

//   useEffect(() => {
//     if (isError) toast.error('Failed to fetch dashboard stats.');
//   }, [isError]);

//   const cards: MetricCardItem[] = useMemo(() => {
//     if (!stats) return [];
//     return [
//       { title: 'All Users (Sponsors)', total: stats.sponsor_count },
//       { title: 'All Team', total: stats.team_count },
//       { title: 'Subscription Volume', total: stats.subscriptions_in_range },
//       { title: 'Licensing Volume', total: stats.licenses_in_range },
//       { title: 'Sponsorship Volume', total: stats.sponsorship_purchases_range },
//     ];
//   }, [stats]);

//   const scrollContainerRef = useRef<HTMLDivElement | null>(null);
//   const focusCardRef = useRef<HTMLDivElement | null>(null);

//   // nice “peek” to the second card
//   useEffect(() => {
//     if (!scrollContainerRef.current || !focusCardRef.current) return;
//     const container = scrollContainerRef.current;
//     const card = focusCardRef.current;
//     const containerRect = container.getBoundingClientRect();
//     const cardRect = card.getBoundingClientRect();
//     const delta = cardRect.left - containerRect.left;
//     container.scrollTo({
//       left: container.scrollLeft + delta - 12,
//       behavior: 'smooth',
//     });
//   }, []);

//   // split for attaching the focus ref
//   const [firstCard, secondCard, ...restCards] = useMemo(
//     () => [cards[0], cards[1], ...(cards.slice(2) || [])],
//     [cards]
//   );

//   return (
//     <>
//       {/* Header row with mobile date filter */}
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
//         <MobileDateFilter
//           range={dayPickerRange}
//           onChange={(r?: DateRange) => {
//             if (!r?.from || !r.to) return;
//             setRange([dayjs(r.from), dayjs(r.to)]);
//           }}
//         />
//       </Box>

//       <Box
//         ref={scrollContainerRef}
//         sx={{
//           display: 'flex',
//           overflowX: 'auto',
//           gap: '16px',
//           px: 2,
//           py: 1,
//           width: '100%',
//           scrollSnapType: 'x mandatory',
//           WebkitOverflowScrolling: 'touch',
//           maskImage:
//             'linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)',
//         }}
//       >
//         {isLoading ? (
//           <>
//             <MetricStatCardSkeleton />
//             <MetricStatCardSkeleton />
//             <MetricStatCardSkeleton />
//           </>
//         ) : (
//           <>
//             {firstCard && <MetricStatCard item={firstCard} />}
//             {secondCard && (
//               <Box ref={focusCardRef}>
//                 <MetricStatCard item={secondCard} />
//               </Box>
//             )}
//             {restCards.map((item) => (
//               <MetricStatCard key={item.title} item={item} />
//             ))}
//           </>
//         )}
//       </Box>
//     </>
//   );
// }

// // ---------- Teams (mobile, server-driven) ----------
// type TeamCardRow = {
//   team_name: string;
//   license_no: string;
//   sponsors_accrued: number;
//   ranking: number | string;
// };

// function TeamCardSkeleton() {
//   return (
//     <Card
//       sx={{
//         backgroundColor: colors.Card,
//         border: '1px solid #3B3B3B',
//         borderRadius: '10px',
//       }}
//     >
//       <CardContent sx={{ py: 1.5 }}>
//         <Skeleton width='60%' height={20} />
//         <Skeleton width='40%' height={16} />
//         <Skeleton width='30%' height={14} sx={{ mt: 1 }} />
//         <Skeleton width='20%' height={14} />
//       </CardContent>
//     </Card>
//   );
// }

// function MobileTeamsPanel() {
//   const [pageIndex, setPageIndex] = useState(1); // API is 1-based
//   const [pageSize] = useState(10);
//   const [searchInput, setSearchInput] = useState('');
//   const [searchParam, setSearchParam] = useState('');
//   const [rows, setRows] = useState<TeamCardRow[]>([]);

//   const applySearch = useDebouncedSetter((value: string) => {
//     setSearchParam(value);
//     setPageIndex(1);
//     setRows([]);
//   }, 400);

//   const { data, isLoading, isFetching, isError } = useRankedTeams({
//     page: pageIndex,
//     page_size: pageSize,
//     search: searchParam,
//   });

//   useEffect(() => {
//     const apiRows = data?.rows ?? [];
//     const mapped: TeamCardRow[] = apiRows.map((rt: any) => ({
//       team_name: rt.team_name,
//       license_no: rt.license_number,
//       sponsors_accrued: rt.sponsorships,
//       ranking: rt.rank,
//     }));
//     if (pageIndex === 1) setRows(mapped);
//     else if (mapped.length) setRows((prev) => [...prev, ...mapped]);
//   }, [data, pageIndex]);

//   useEffect(() => {
//     if (isError) toast.error('Failed to fetch ranked teams.');
//   }, [isError]);

//   const totalCount = data?.meta?.total_count ?? 0;
//   const canLoadMore = rows.length < totalCount && !isFetching;

//   return (
//     <Box sx={{ px: 2, py: 2 }}>
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           mb: 1,
//         }}
//       >
//         <Typography variant='mediumHeaderBold' sx={{ color: colors.Freeze }}>
//           TEAMS by ranking
//         </Typography>
//         <SearchIcon sx={{ color: 'yellow' }} />
//       </Box>

//       <TextField
//         size='small'
//         placeholder='Search by team or license...'
//         value={searchInput}
//         onChange={(e) => {
//           setSearchInput(e.target.value);
//           applySearch(e.target.value);
//         }}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position='start'>
//               <SearchIcon sx={{ opacity: 0.8 }} />
//             </InputAdornment>
//           ),
//         }}
//         sx={{
//           mb: 2,
//           '& .MuiInputBase-root': {
//             backgroundColor: '#1f1f1f',
//             color: 'white',
//           },
//           width: '100%',
//         }}
//       />

//       <Box sx={{ display: 'grid', gap: 1.5 }}>
//         {isLoading && rows.length === 0
//           ? Array.from({ length: 4 }).map((_, i) => (
//               <TeamCardSkeleton key={i} />
//             ))
//           : rows.map((row) => (
//               <Card
//                 key={`${row.team_name}-${row.license_no}-${row.ranking}`}
//                 sx={{
//                   backgroundColor: colors.Card,
//                   border: '1px solid #3B3B3B',
//                   borderRadius: '10px',
//                 }}
//               >
//                 <CardContent sx={{ py: 1.5 }}>
//                   <Typography sx={{ color: colors.Freeze, fontWeight: 700 }}>
//                     {row.team_name}
//                   </Typography>
//                   <Typography
//                     sx={{ color: colors.Freeze, fontSize: 12, opacity: 0.9 }}
//                   >
//                     License • {row.license_no}
//                   </Typography>
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       mt: 1,
//                     }}
//                   >
//                     <Typography
//                       sx={{ color: colors.Freeze, fontSize: 12, opacity: 0.85 }}
//                     >
//                       Sponsors Accrued
//                     </Typography>
//                     <Typography sx={{ color: colors.Freeze, fontWeight: 700 }}>
//                       {row.sponsors_accrued}
//                     </Typography>
//                   </Box>
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       mt: 0.5,
//                     }}
//                   >
//                     <Typography
//                       sx={{ color: colors.Freeze, fontSize: 12, opacity: 0.85 }}
//                     >
//                       Ranking
//                     </Typography>
//                     <Typography sx={{ color: colors.Freeze, fontWeight: 700 }}>
//                       {row.ranking}
//                     </Typography>
//                   </Box>
//                 </CardContent>
//               </Card>
//             ))}
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
//         <Button
//           variant='outlined'
//           disabled={!canLoadMore}
//           onClick={() => setPageIndex((p) => p + 1)}
//         >
//           {isFetching
//             ? 'Loading…'
//             : canLoadMore
//             ? 'Load more'
//             : 'No more results'}
//         </Button>
//       </Box>
//     </Box>
//   );
// }

// // ---------- Users (mobile, server-driven) ----------
// type UserCardRow = {
//   name: string;
//   email: string;
//   phone_number: string;
//   total_points_purchased: number;
//   total_amount_sponsored: number;
// };

// function UserCardSkeleton() {
//   return (
//     <Card
//       sx={{
//         backgroundColor: colors.Card,
//         border: '1px solid #3B3B3B',
//         borderRadius: '10px',
//       }}
//     >
//       <CardContent sx={{ py: 1.5 }}>
//         <Skeleton width='50%' height={20} />
//         <Skeleton width='70%' height={16} />
//         <Skeleton width='40%' height={16} />
//         <Skeleton width='30%' height={14} sx={{ mt: 1 }} />
//         <Skeleton width='35%' height={14} />
//       </CardContent>
//     </Card>
//   );
// }

// function MobileUsersPanel() {
//   const [pageIndex, setPageIndex] = useState(1); // API is 1-based
//   const [pageSize] = useState(10);
//   const [searchInput, setSearchInput] = useState('');
//   const [searchParam, setSearchParam] = useState('');
//   const [rows, setRows] = useState<UserCardRow[]>([]);

//   const applySearch = useDebouncedSetter((value: string) => {
//     setSearchParam(value);
//     setPageIndex(1);
//     setRows([]);
//   }, 400);

//   const { data, isLoading, isFetching, isError } = useRankedUsers({
//     page: pageIndex,
//     page_size: pageSize,
//     search: searchParam,
//   });

//   useEffect(() => {
//     const apiRows = data?.rows ?? [];
//     const mapped: UserCardRow[] = apiRows.map((u: any) => ({
//       name: u.name,
//       email: u.email,
//       phone_number: u.phone_number,
//       total_points_purchased: u.total_points_purchased,
//       total_amount_sponsored: u.total_amount_sponsored,
//     }));
//     if (pageIndex === 1) setRows(mapped);
//     else if (mapped.length) setRows((prev) => [...prev, ...mapped]);
//   }, [data, pageIndex]);

//   useEffect(() => {
//     if (isError) toast.error('Failed to fetch ranked users.');
//   }, [isError]);

//   const totalCount = data?.meta?.total_count ?? 0;
//   const canLoadMore = rows.length < totalCount && !isFetching;

//   return (
//     <Box sx={{ px: 2, py: 2 }}>
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           mb: 1,
//         }}
//       >
//         <Typography variant='mediumHeaderBold' sx={{ color: colors.Freeze }}>
//           Users by sponsorships
//         </Typography>
//         <SearchIcon sx={{ color: 'yellow' }} />
//       </Box>

//       <TextField
//         size='small'
//         placeholder='Search by username or phone number...'
//         value={searchInput}
//         onChange={(e) => {
//           setSearchInput(e.target.value);
//           applySearch(e.target.value);
//         }}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position='start'>
//               <SearchIcon sx={{ opacity: 0.8 }} />
//             </InputAdornment>
//           ),
//         }}
//         sx={{
//           mb: 2,
//           '& .MuiInputBase-root': {
//             backgroundColor: '#1f1f1f',
//             color: 'white',
//           },
//           width: '100%',
//         }}
//       />

//       <Box sx={{ display: 'grid', gap: 1.5 }}>
//         {isLoading && rows.length === 0
//           ? Array.from({ length: 4 }).map((_, i) => (
//               <UserCardSkeleton key={i} />
//             ))
//           : rows.map((row, idx) => (
//               <Card
//                 key={`${row.email}-${idx}`}
//                 sx={{
//                   backgroundColor: colors.Card,
//                   border: '1px solid #3B3B3B',
//                   borderRadius: '10px',
//                 }}
//               >
//                 <CardContent sx={{ py: 1.5 }}>
//                   <Typography sx={{ color: colors.Freeze, fontWeight: 700 }}>
//                     {row.name}
//                   </Typography>
//                   <Typography
//                     sx={{ color: colors.Freeze, fontSize: 12, opacity: 0.9 }}
//                   >
//                     {row.email}
//                   </Typography>
//                   <Typography
//                     sx={{ color: colors.Freeze, fontSize: 12, opacity: 0.9 }}
//                   >
//                     {row.phone_number}
//                   </Typography>

//                   <Box
//                     sx={{
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       mt: 1,
//                     }}
//                   >
//                     <Typography
//                       sx={{ color: colors.Freeze, fontSize: 12, opacity: 0.85 }}
//                     >
//                       Points Purchased
//                     </Typography>
//                     <Typography sx={{ color: colors.Freeze, fontWeight: 700 }}>
//                       {row.total_points_purchased}
//                     </Typography>
//                   </Box>

//                   <Box
//                     sx={{
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       mt: 0.5,
//                     }}
//                   >
//                     <Typography
//                       sx={{ color: colors.Freeze, fontSize: 12, opacity: 0.85 }}
//                     >
//                       Amount Sponsored
//                     </Typography>
//                     <Typography sx={{ color: colors.Freeze, fontWeight: 700 }}>
//                       ₦
//                       {Number(row.total_amount_sponsored ?? 0).toLocaleString()}
//                     </Typography>
//                   </Box>
//                 </CardContent>
//               </Card>
//             ))}
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
//         <Button
//           variant='outlined'
//           disabled={!canLoadMore}
//           onClick={() => setPageIndex((p) => p + 1)}
//         >
//           {isFetching
//             ? 'Loading…'
//             : canLoadMore
//             ? 'Load more'
//             : 'No more results'}
//         </Button>
//       </Box>
//     </Box>
//   );
// }


