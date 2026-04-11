import { Box } from '@mui/material';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
import DashboardSection from '../../../components/dashboards/DashboardSection';
import DateRangeFilter from '../../../components/filters/DateRangeFilter';
import { TEAM_SIDENAV_ITEMS } from '../../../utils/sidebarPresets';
import DesktopMySponsorshipStatsCards from './components/DesktopMySponsorshipStatsCards';
import { useTeamSponsorshipStats } from './hooks/useTeamSponsorshipStats';
import { useTeamSponsorshipHistory } from './hooks/useTeamSponsorshipHistory';
import DesktopSponsorshipHistoryTable, {
  mapApiToRows,
  type SponsorshipRow,
} from './components/DesktopSponsorshipHistoryTable';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../routes/routePath';

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

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');
// history API: DD-MM-YYYY (per your sample)
const fmtHist = (d: Dayjs) => d.format('DD-MM-YYYY');

export default function DesktopMySponsorshipPage() {
  const navigate = useNavigate();
  // date range for stats
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;
  const start_date = useMemo(() => fmt(start), [start]);
  const end_date = useMemo(() => fmt(end), [end]);
  const startHist = useMemo(() => fmtHist(start), [start]);
  const endHist = useMemo(() => fmtHist(end), [end]);

  const dayPickerRange: DateRange | undefined = {
    from: range[0].toDate(),
    to: range[1].toDate(),
  };

  const { data, isLoading } = useTeamSponsorshipStats({ start_date, end_date });

  // ---------- NEW: table state + query ----------
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const { data: hist, isLoading: tableLoading } = useTeamSponsorshipHistory({
    page: page + 1, // API is 1-based
    page_size: pageSize,
    start_date: startHist,
    end_date: endHist,
  });

  const rows: SponsorshipRow[] = useMemo(
    () => mapApiToRows(hist?.data ?? []),
    [hist]
  );
  const total = hist?.metadata?.total_count ?? rows.length;

  return (
    <>
      <DashboardSection
        title='MY SPONSORSHIP'
        sidebarItems={TEAM_SIDENAV_ITEMS}
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
      >
        <Box>
          <DesktopMySponsorshipStatsCards
            loading={isLoading}
            sponsorships={data?.total_sponsorships ?? 0}
            sponsors={data?.total_sponsors ?? 0}
            value={data?.sponsorship_value ?? 0}
            rank={data?.team_rank ?? 0}
          />
        </Box>
      </DashboardSection>

      <Box sx={contentPaddingSx}>
        <DesktopSponsorshipHistoryTable
          rows={rows}
          loading={tableLoading}
          totalCount={total}
          pageIndex={page}
          rowsPerPage={pageSize}
          onPageChange={setPage}
          onRowsPerPageChange={setPageSize}
          searchValue={search}
          onSearchChange={setSearch} // (client-side filtering if you want to add it later)
          onView={(row) => {
            /* open details if you have any */
            console.log(row);
            navigate(
              ROUTES.TEAM_MYSPONSORSHIP_DETAILS.replace(
                ':sponsorId',
                String(row.sponsor_id)
              )
            );
            console.log(row.sponsor_id);
          }}
        />
      </Box>
    </>
  );
}
