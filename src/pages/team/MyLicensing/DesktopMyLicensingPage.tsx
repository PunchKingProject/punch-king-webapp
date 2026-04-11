import { Box } from '@mui/material';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
import TeamBreadcrumbs from '../../../components/breadcrumbs/TeamBreadcrumbs.tsx';
import DashboardSection from '../../../components/dashboards/DashboardSection.tsx';
import DateRangeFilter from '../../../components/filters/DateRangeFilter.tsx';
import ROUTES from '../../../routes/routePath.ts';
import { TEAM_SIDENAV_ITEMS } from '../../../utils/sidebarPresets.ts';
import DesktopLicenseHistoryTable from './components/DesktopLicenseHistoryTable.tsx';
import DesktopLicensePaymentHistoryTable from './components/DesktopLicensePaymentHistoryTable.tsx';
import DesktopLicensingStatsCards from './components/DesktopLicensingStatsCards.tsx';
import { useTeamLicenseStats } from './hooks/useTeamLicenseStats.ts';

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

// const fmt = (d: Dayjs) => d.format('DD-MM-YYYY'); // 👈 API example uses DD-MM-YYYY
const fmtStats = (d: Dayjs) => d.format('DD-MM-YYYY');   // for stats API
const fmtISO = (d: Dayjs) => d.format('YYYY-MM-DD'); // for history API

export default function DesktopMyLicensingPage() {

  const navigate = useNavigate();
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);

  const dayPickerRange: DateRange | undefined = {
    from: range[0].toDate(),
    to: range[1].toDate(),
  };

  const [start, end] = range;
  const start_date_stats = useMemo(() => fmtStats(start), [start]);
  const end_date_stats = useMemo(() => fmtStats(end), [end]);
  const start_date_iso = useMemo(() => fmtISO(start), [start]);
  const end_date_iso = useMemo(() => fmtISO(end), [end]);

  const { data, isLoading, isError } = useTeamLicenseStats({
    start_date: start_date_stats,
    end_date: end_date_stats,
  });

  useEffect(() => {
    if (isError) toast.error('Failed to fetch licensing stats.');
  }, [isError]);

  const handleRangeChange = (r?: DateRange) => {
    if (!r?.from || !r.to) return;
    setRange([dayjs(r.from), dayjs(r.to)]);
  };


  const [licHistSearchInput, setLicHistSearchInput] = useState('');

  return (
    <>
      <DashboardSection
        title={
          <TeamBreadcrumbs
            rootLabel='TEAM DASHBOARD'
            rootTo={ROUTES.TEAM}
            currentLabel='MY LICENSING'
          />
        }
        toolbar={
          <DateRangeFilter
            range={dayPickerRange}
            onChange={handleRangeChange}
            icon={<DateFilterIcon />}
          />
        }
        sidebarItems={TEAM_SIDENAV_ITEMS}
      >
        <DesktopLicensingStatsCards
          loading={isLoading}
          active={data?.active_sub ?? null}
          total={data?.total_licenses ?? 0}
          onGetLicense={() => {
            // navigate(ROUTES.TEAM_MY_LICENSING || '/team/my-licensing')
            navigate(ROUTES.USER_LICENSE_PAYMENT);
          }}
          onViewAll={() => {
            // navigate(ROUTES.TEAM_MY_LICENSING || '/team/my-licensing');
          }}
        />
      </DashboardSection>
      <Box sx={contentPaddingSx}>
        <DesktopLicensePaymentHistoryTable
          startDate={start_date_iso} // YYYY-MM-DD
          endDate={end_date_iso} // YYYY-MM-DD
          onViewSlip={(url) => {
            // swap for your modal system if you want
            if (!url) return;
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
        />

        <Box sx={{ mt: 6 }}>
          <DesktopLicenseHistoryTable
            searchValue={licHistSearchInput}
            onSearchChange={setLicHistSearchInput}
          />
        </Box>
      </Box>
    </>
  );
}
