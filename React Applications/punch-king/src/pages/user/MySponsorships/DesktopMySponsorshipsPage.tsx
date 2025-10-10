import { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { DateRange } from 'react-day-picker';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
import DesktopUserStatsCards from '../components/DesktopUserStatsCards';
import { useUserStats } from '../Dashboard/hooks/useUserStats';
import DashboardSection from '../../../components/dashboards/DashboardSection';
import { USER_SIDENAV_ITEMS } from '../../../utils/sidebarPresets';
import DateRangeFilter from '../../../components/filters/DateRangeFilter';
import { usePurchaseHistory } from './hooks/usePurchaseHistory';
import DesktopPurchaseHistorySection, { mapApiToRows, type PurchaseRow } from './components/DesktopPurchaseHistorySection';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ROUTES from '../../../routes/routePath';



const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

export default function DesktopMySponsorshipsPage() {
  // date range (last 30 days by default)
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);

  const [start, end] = range;
  const picker: DateRange = { from: start.toDate(), to: end.toDate() };

  const start_date = useMemo(() => fmt(start), [start]);
  const end_date = useMemo(() => fmt(end), [end]);

  const { data, isLoading } = useUserStats({ start_date, end_date });

  const navigate = useNavigate();

  // NEW — table state (client mode pagination/search)
  const [page, setPage] = useState(0); // 0-based UI
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  // NEW — fetch purchase history
  const { data: history, isLoading: tableLoading } = usePurchaseHistory({
    page: page + 1, // API is 1-based
    page_size: pageSize,
    start_date,
    end_date,
  });

  // NEW — map API rows to table rows
  const rows: PurchaseRow[] = useMemo(
    () =>
      mapApiToRows(
        (history?.data ?? []).map((item) => ({
          ...item,
          team: item.team
            ? {
                ...item.team,
                username: item.team.username ?? '',
                email: item.team.email ?? '',
                phone_number: item.team.phone_number ?? '',
                address: item.team.address ?? '',
                country: item.team.country ?? '',
                state: item.team.state ?? '',
                gender: item.team.gender ?? '',
                dob: item.team.dob ?? '',
                bio: item.team.bio ?? '',
                profile_picture: item.team.profile_picture ?? '',
                last_login_date: item.team.last_login_date ?? '',
                sponsorships: item.team.sponsorships ?? 0,
              }
            : null,
        }))
      ),
    [history]
  );

  const total = history?.metadata.total_count ?? rows.length;



  const myUnits = data?.sponsorship_balance ?? 0;
  const spentUnits = data?.spent_units ?? 0;
  const costOfUnits = data?.total_amount_spent ?? 0;
  const sponsoredTeams = data?.distinct_teams_sponsored ?? 0;

  return (
    <>
      <DashboardSection
        // keep the left sidebar (design shows My Sponsorships + Inbox)
        sidebarItems={USER_SIDENAV_ITEMS}
        title={
          // Breadcrumbs: USER DASHBOARD / SPONSORSHIPS
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              component={RouterLink}
              to='/user'
              sx={{
                color: '#A2A2A2',
                fontWeight: 600,
                fontSize: 16,
                textDecoration: 'none', // no underline
              }}
            >
              USER DASHBOARD
            </Typography>
            <Typography sx={{ color: '#A2A2A2' }}>/</Typography>
           
            <Typography
              sx={{ color: '#A2A2A2', fontWeight: 700, fontSize: 16 }}
            >
              SPONSORSHIPS
            </Typography>
          </Box>
        }
        toolbar={
          <DateRangeFilter
            range={picker}
            onChange={(r) => {
              if (!r?.from || !r.to) return;
              setRange([dayjs(r.from), dayjs(r.to)]);
            }}
            icon={<DateFilterIcon />}
            label='Filter by time frame'
          />
        }
      >
        <DesktopUserStatsCards
          loading={isLoading}
          myUnits={myUnits}
          spentUnits={spentUnits}
          costOfUnits={costOfUnits}
          sponsoredTeams={sponsoredTeams}
          onBuy={() => {
            // plug your buy flow here
            // e.g. open modal
            console.log('Buy sponsor units');
            navigate(ROUTES.USER_BUY_SPONSORS);
          }}
          // onViewSponsored={() => {
          //   // optional: navigate to a “sponsored teams” list
          //   console.log('View sponsored teams');
          // }}
        />
      </DashboardSection>

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
        {/* NEW — purchase history table using PaginatedTable */}
        <DesktopPurchaseHistorySection
          rows={rows}
          mode='client' // API has no search param; keep search client-side
          loading={tableLoading}
          totalCount={total}
          pageIndex={page}
          rowsPerPage={pageSize}
          onPageChange={setPage}
          onRowsPerPageChange={setPageSize}
          searchValue={search}
          onSearchChange={setSearch}
          onViewSlip={(row) => {
            if (row.payment_slip) window.open(row.payment_slip, '_blank');
          }}
        />
      </Box>
    </>
  );
}
