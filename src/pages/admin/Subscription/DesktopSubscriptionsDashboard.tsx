// pages/admin/Subscription/DesktopSubscriptionsDashboard.tsx
import dayjs, { Dayjs } from 'dayjs';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';
import AdminSection from '../components/AdminSection';
import DateRangeFilter from '../../../components/filters/DateRangeFilter';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
import type { DateRange } from 'react-day-picker';
import type { MetricCard } from '../components/CardGrid';
import { useSubscriptions } from './hooks/useSubscriptions';
import DesktopSubscriptionsSection, {
  type SubRow,
} from './components/DesktopSubscriptionsSection';
import ROUTES from '../../../routes/routePath';

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

export default function DesktopSubscriptionsDashboard() {
  const navigate = useNavigate();

  // date range (cards + table)
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;
  const start_date = useMemo(() => fmt(start), [start]);
  const end_date = useMemo(() => fmt(end), [end]);

  // server pagination + search
  const [page, setPage] = useState(0); // UI 0-based
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const applySearch = useMemo(
    () => debounce((v: string) => setSearch(v), 400),
    []
  );
  useEffect(() => () => applySearch.cancel(), [applySearch]);

  // reset page when date range changes
  useEffect(() => {
    setPage(0);
  }, [start_date, end_date]);

  const { data, isLoading, isError } = useSubscriptions({
    start_date,
    end_date,
    page: page + 1, // API is 1-based
    page_size: pageSize,
    search: search || undefined,
  });

  useEffect(() => {
    if (isError) toast.error('Failed to fetch subscriptions.');
  }, [isError]);

  // cards
  const cards: MetricCard[] = useMemo(() => {
    const c = data?.cards;
    return [
      {
        title: 'ALL SUBSCRIBED TEAMS',
        total: c?.teams_with_active_subs ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'TEAMS WITHOUT SUBSC.',
        total: c?.teams_without_active_subs ?? 0,
        deltaPct: 0,
        trendingUp: false,
      },
      {
        title: 'SUBSCRIPTION REQUESTS',
        total: c?.total_subs ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'PROCESSED SUBSCRIPTIONS',
        total: c?.active_subs ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'SUBSCRIPTIONS VALUE',
        total: c?.total_value ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'SUBSCRIPTIONS VOLUME',
        total: c?.unconfirmed_non_active_subs ?? 0,
        deltaPct: 0,
        trendingUp: false,
      },
    ];
  }, [data]);

  // rows
  const rows: SubRow[] = useMemo(() => {
    const apiRows = data?.table.data ?? [];
    return apiRows.map((r) => ({
      id: r.id,
      team_id: r.team.id,
      team_name: r.team.team_name,
      phone_number: r.team.phone_number,
      payment_confirmation_status: r.payment_status ?? '—',
      subs_status: r.subscription_status ?? '—',
    }));
  }, [data]);

  const total = data?.table.metadata.total_count ?? 0;

  // navigate to details (if you have a route; otherwise omit onView)
  const handleView = (row: SubRow) => {
    // e.g., go to a subscription details page (create if needed)
    navigate(
      ROUTES.SUBSCRIPTION_DETAILS.replace(':team_id', String(row.team_id))
    );
  };

  const dayPickerRange: DateRange | undefined = {
    from: range[0].toDate(),
    to: range[1].toDate(),
  };

  return (
    <>
      <AdminSection
        title='SUBSCRIPTION'
        cards={isLoading ? undefined : cards}
        loading={isLoading}
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
        <DesktopSubscriptionsSection
          rows={rows}
          mode='server'
          loading={isLoading}
          totalCount={total}
          pageIndex={page}
          rowsPerPage={pageSize}
          onPageChange={setPage}
          onRowsPerPageChange={setPageSize}
          searchValue={searchInput}
          onSearchChange={(val) => {
            setSearchInput(val);
            applySearch(val);
          }}
          onView={handleView} // remove if no details route
        />
      </Box>
    </>
  );
}
