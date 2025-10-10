// src/pages/team/MySponsorship/SponsorDetails/DesktopMySponsorshipDetailsPage.tsx
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Button, Link as MLink, Typography } from '@mui/material';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
import DashboardSection from '../../../components/dashboards/DashboardSection';
import DateRangeFilter from '../../../components/filters/DateRangeFilter';
import ROUTES from '../../../routes/routePath';
import { TEAM_SIDENAV_ITEMS } from '../../../utils/sidebarPresets';
import DesktopSponsorRelatedHistoryTable, {
  mapSponsorRelatedApiToRows,
  type SponsorRelatedTableRow,
} from './components/DesktopSponsorRelatedHistoryTable';
import DesktopSponsorRelatedStatsCards from './components/DesktopSponsorRelatedStatsCards';
import { useSponsorRelatedList } from './hooks/useSponsorRelatedList';
import { useSponsorRelatedStats } from './hooks/useSponsorRelatedStats';

const fmtDMY = (d: Dayjs) => d.format('DD-MM-YYYY');

const contentPaddingSx = {
  padding: '1.56em 6.98em',
  '@media (min-width:910px) and (max-width:1000px)': {
    padding: '1.56em 2em',
    pl: '3em',
  },
  '@media (min-width:1000px) and (max-width:1100px)': {
    paddingX: '1em',
    pl: '2rem',
  },
};

export default function DesktopMySponsorshipDetailsPage() {
  const navigate = useNavigate();
  const { sponsorId } = useParams<{ sponsorId: string }>();
  const sId = Number(sponsorId); // 👈 actual sponsor id from the route

  // default to last 30 days
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;
  const start_date = useMemo(() => fmtDMY(start), [start]);
  const end_date = useMemo(() => fmtDMY(end), [end]);

  const dayPickerRange: DateRange = { from: start.toDate(), to: end.toDate() };

  // ----- cards (stats) -----
  const { data: statsData, isLoading: statsLoading } = useSponsorRelatedStats({
    sponsor_id: sId,
    start_date,
    end_date,
  });

  // ----- table (list) -----
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const { data: listData, isLoading: listLoading } = useSponsorRelatedList({
    sponsor_id: sId,
    page: page + 1, // API is 1-based
    page_size: pageSize,
    start_date,
    end_date,
  });

  const rows: SponsorRelatedTableRow[] = useMemo(
    () => mapSponsorRelatedApiToRows(listData?.data ?? []),
    [listData]
  );
  const total = listData?.metadata.total_count ?? rows.length;

  return (
    <>
      <DashboardSection
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MLink
              component={RouterLink}
              to={ROUTES.TEAM}
              underline='none'
              sx={{
                color: '#A2A2A2',
                fontWeight: 700,
                fontSize: 14,
                '&:hover': { color: '#fff' },
              }}
            >
              TEAM DASHBOARD
            </MLink>
            <Typography sx={{ color: '#A2A2A2' }}>/</Typography>

            <MLink
              component={RouterLink}
              to={ROUTES.MY_SPONSORSHIP}
              underline='none'
              sx={{
                color: '#A2A2A2',
                fontWeight: 700,
                fontSize: 14,
                '&:hover': { color: '#fff' },
              }}
            >
              SPONSORSHIPS
            </MLink>
            <Typography sx={{ color: '#A2A2A2' }}>/</Typography>

            <Typography
              sx={{ color: '#A2A2A2', fontWeight: 700, fontSize: 14 }}
            >
              SPONSORS HISTORY
            </Typography>
          </Box>
        }
        toolbar={
          <>
            <DateRangeFilter
              range={dayPickerRange}
              onChange={(r?: DateRange) => {
                if (!r?.from || !r.to) return;
                setRange([dayjs(r.from), dayjs(r.to)]);
              }}
              icon={<DateFilterIcon />}
              label='Filter by time frame'
            />
            <Button
              variant='outlined'
              onClick={() => navigate(-1)}
              size='small'
              sx={{
                ml: 1,
                borderColor: '#EFAF00',
                color: '#EFAF00',
                textTransform: 'none',
              }}
              startIcon={<ArrowBackIosNewIcon fontSize='small' />}
            >
              Back
            </Button>
          </>
        }
        sidebarItems={TEAM_SIDENAV_ITEMS}
      >
        <DesktopSponsorRelatedStatsCards
          loading={statsLoading}
          totalPoints={statsData?.total_points ?? 0}
          totalCash={statsData?.total_cash ?? 0}
        />
      </DashboardSection>

      <Box sx={contentPaddingSx}>
        <DesktopSponsorRelatedHistoryTable
          rows={rows}
          loading={listLoading}
          totalCount={total}
          pageIndex={page}
          rowsPerPage={pageSize}
          onPageChange={setPage}
          onRowsPerPageChange={setPageSize}
          searchValue={search}
          onSearchChange={setSearch}
        />
      </Box>
    </>
  );
}
