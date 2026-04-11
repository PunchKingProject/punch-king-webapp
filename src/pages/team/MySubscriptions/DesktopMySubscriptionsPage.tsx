import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'react-toastify';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
import DashboardSection from '../../../components/dashboards/DashboardSection.tsx';
import DateRangeFilter from '../../../components/filters/DateRangeFilter.tsx';
import { TEAM_SIDENAV_ITEMS } from '../../../utils/sidebarPresets.ts';
import DesktopTeamSubStatsCards from './components/DesktopTeamSubStatsCards.tsx';
import { useTeamSubStats } from './hooks/useTeamSubStats.ts';
import DesktopSubHistoryTable, { mapSubHistoryApiToRows, type SubHistoryRow } from './components/DesktopSubHistoryTable.tsx';
import { useTeamSubActiveInactive, useTeamSubPayments } from './hooks/useSubTables.ts';
import DesktopSubPaymentHistoryTable, { mapPaymentApiToRows, type SubPaymentRow } from './components/DesktopSubPaymentHistoryTable.tsx';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../routes/routePath.ts';




// Stats endpoint expects DD-MM-YYYY
const fmt = (d: Dayjs) => d.format("DD-MM-YYYY");


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
export default function DesktopMySubscriptionsPage() {

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
  const start_date = useMemo(() => fmt(start), [start]);
  const end_date = useMemo(() => fmt(end), [end]);

  const { data, isLoading, isError } = useTeamSubStats({
    start_date,
    end_date,
  });

  useEffect(() => {
    if (isError) toast.error('Failed to fetch subscription stats.');
  }, [isError]);

  const handleRangeChange = (r?: DateRange) => {
    if (!r?.from || !r.to) return;
    setRange([dayjs(r.from), dayjs(r.to)]);
  };

  /** ---------- table #1: payments ---------- */
  const [payPage, setPayPage] = useState(0);
  const [payPageSize, setPayPageSize] = useState(10);
  const [paySearch, setPaySearch] = useState('');

  const {
    data: payData,
    isLoading: payLoading,
    isError: payError,
  } = useTeamSubPayments({ page: payPage + 1, page_size: payPageSize });

  useEffect(() => {
    if (payError) toast.error('Failed to fetch subscription payments.');
  }, [payError]);

  const payRows: SubPaymentRow[] = useMemo(
    () => mapPaymentApiToRows(payData?.data ?? []),
    [payData]
  );
  const payTotal = payData?.metadata.total_count ?? payRows.length;

  /** ---------- table #2: active/inactive ---------- */
  const [histPage, setHistPage] = useState(0);
  const [histPageSize, setHistPageSize] = useState(10);
  const [histSearch, setHistSearch] = useState('');

  const {
    data: histData,
    isLoading: histLoading,
    isError: histError,
  } = useTeamSubActiveInactive({ page: histPage + 1, page_size: histPageSize });

  useEffect(() => {
    if (histError) toast.error('Failed to fetch subscription history.');
  }, [histError]);

  const histRows: SubHistoryRow[] = useMemo(
    () => mapSubHistoryApiToRows(histData?.data ?? []),
    [histData]
  );
  const histTotal = histData?.metadata.total_count ?? histRows.length;

  return (
    <>
      <DashboardSection
        title='MY SUBSCRIPTIONS'
        toolbar={
          <DateRangeFilter
            range={dayPickerRange}
            onChange={handleRangeChange}
            icon={<DateFilterIcon />}
            label='Filter by time frame'
          />
        }
        sidebarItems={TEAM_SIDENAV_ITEMS}
      >
        <DesktopTeamSubStatsCards
          loading={isLoading}
          active={
            data?.active_sub
              ? {
                  type: data.active_sub.type,
                  end_date: data.active_sub.end_date,
                }
              : null
          }
          annualCount={data?.annual_count ?? 0}
          semiAnnualCount={data?.semi_annual_count ?? 0}
          onSubscribe={() => {
            // TODO: navigate to your subscription purchase flow
            // e.g. navigate(ROUTES.TEAM_SUBSCRIBE) or open a modal
            console.log('subscribe clicked');
            navigate(ROUTES.TEAM_SUBSCRIPTION_PAYMENT)
          }}
        />
      </DashboardSection>

      <Box sx={contentPaddingSx}>
        <DesktopSubPaymentHistoryTable
          rows={payRows}
          loading={payLoading}
          totalCount={payTotal}
          pageIndex={payPage}
          rowsPerPage={payPageSize}
          onPageChange={setPayPage}
          onRowsPerPageChange={setPayPageSize}
          searchValue={paySearch}
          onSearchChange={setPaySearch}
        />
        <DesktopSubHistoryTable
          rows={histRows}
          loading={histLoading}
          totalCount={histTotal}
          pageIndex={histPage}
          rowsPerPage={histPageSize}
          onPageChange={setHistPage}
          onRowsPerPageChange={setHistPageSize}
          searchValue={histSearch}
          onSearchChange={setHistSearch}
        />
      </Box>
    </>
  );
}
