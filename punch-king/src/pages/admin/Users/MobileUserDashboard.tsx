// pages/admin/Users/components/MobileUsersHome.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import debounce from 'lodash.debounce';
import type { DateRange } from 'react-day-picker';
import { toast } from 'react-toastify';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import { useNavigate } from 'react-router-dom';

import { colors } from '../../../theme/colors.ts';
import { useUserDashboardStats } from './hooks/useUserDashboardStats.ts';
import { useUserDashboardTable } from './hooks/useUserDashboardTable.ts';
import type { UserTableApiRow } from './api/users.types.ts';
import MetricsDateFilterDrawer from '../Dashboard/components/MetricsDateFilterDrawer.tsx';
import { ScrollableSection } from '../components/ScrollableSection.tsx';
import ROUTES from '../../../routes/routePath.ts';
import { userSponsorshipFieldData } from './ui/fields.ts';


const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');
const formatRangeLabel = (from?: Date, to?: Date) => {
  if (!from || !to) return 'Last 30 days';
  const a = dayjs(from).format('MMM D');
  const b = dayjs(to).format('MMM D, YYYY');
  return `${a} – ${b}`;
};

/** Lightweight item contract for the mobile list */
export type UserListItem = {
  sponsor_id: number;
  user_name: string;
  phone_number: string;
  email: string;
  sponsorships: number; // total_amount_given
  sponsor_units: number; // sponsorship_balance
};

export default function MobileUserDashboard() {
  const navigate = useNavigate();

  // ===== metrics date range (metrics-only) =====
  const [metricRange, setMetricRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = metricRange;
  const metricDayPickerRange: DateRange | undefined = {
    from: start.toDate(),
    to: end.toDate(),
  };

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useUserDashboardStats({ start_date: fmt(start), end_date: fmt(end) });

  useEffect(() => {
    if (statsError) toast.error('Failed to fetch users metrics.');
  }, [statsError]);

  // default the percentage to "0" to avoid “undefined%”
  const metricCards = [
    {
      title: 'All Users',
      total: stats?.total_sponsors_created ?? 0,
      percentage: 0, // 👈 default to 0
      status: true,
    },
    {
      title: 'Sponsoring Users',
      total: stats?.total_unique_sponsors ?? 0,
      percentage: 0,
      status: true,
    },
    {
      title: 'Sponsorship Value',
      total: stats?.total_sponsorships ?? 0,
      percentage: 0,
      status: true,
    },
  ];

  // center horizontal scroller on second card for the “peek” effect
  const containerRef = useRef<HTMLDivElement | null>(null);
  const secondCardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    secondCardRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
    });
  }, []);

  // ===== users list (server search + paging) =====
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<UserListItem[]>([]);
  const [query, setQuery] = useState('');

  const debouncedApplySearch = useMemo(
    () =>
      debounce((q: string) => {
        setQuery(q);
        setPage(1);
        setRows([]);
      }, 400),
    []
  );
  useEffect(() => () => debouncedApplySearch.cancel(), [debouncedApplySearch]);

  const {
    data: tableResp,
    isFetching,
    isError: tableError,
  } = useUserDashboardTable({
    start_date: fmt(start),
    end_date: fmt(end),
    page,
    page_size: 10,
    search: query,
  });

  useEffect(() => {
    if (tableError) toast.error('Failed to fetch users list.');
  }, [tableError]);

  // map API page to list items, append on scroll
  useEffect(() => {
    const apiRows: UserTableApiRow[] = tableResp?.data.data ?? [];

    const mapped: UserListItem[] = apiRows.map((r) => ({
      sponsor_id: r.sponsor_id,
      user_name: r.name,
      phone_number: r.phone_number,
      email: r.email,
      sponsorships: r.total_amount_given,
      sponsor_units: r.sponsorship_balance,
    }));
    if (page === 1) setRows(mapped);
    else if (mapped.length) setRows((prev) => [...prev, ...mapped]);
  }, [tableResp, page]);

  const total = tableResp?.data.metadata.total_count ?? 0;
  const hasMore = rows.length < total;

  return (
    <>
      {/* Header: title + metrics date filter (metrics only) */}
      <Box
        sx={{
          px: 2,
          pt: 1,
          pb: 0.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='mediumHeaderBold' sx={{ color: colors.Freeze }}>
          Users
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant='bodyTextMilkDefault'
            sx={{ color: colors.Freeze, opacity: 0.8 }}
          >
            {formatRangeLabel(
              metricDayPickerRange?.from,
              metricDayPickerRange?.to
            )}
          </Typography>
          <MetricsDateFilterDrawer
            range={metricDayPickerRange}
            title='Filter user metrics'
            onApply={(r) => {
              if (!r.from || !r.to) return;
              setMetricRange([dayjs(r.from), dayjs(r.to)]);
              // list remains scoped to *current* metric dates by design
              setPage(1);
            }}
          />
        </Box>
      </Box>

      {/* Sliding metric cards */}
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          overflow: 'auto',
          flexDirection: 'row',
          width: '100%',
          gap: '40px',
          px: 2,
          py: 1,
        }}
      >
        {metricCards.map((item, idx) => (
          <Box
            key={item.title}
            ref={idx === 1 ? secondCardRef : null}
            sx={{
              background: colors.Card,
              minWidth: '230px',
              width: '110vw',
              maxWidth: '489px',
              border: '1px solid #3B3B3B',
              height: '135px',
              borderRadius: '10px',
              boxShadow: '2px 2px 10px 2px #2B2B2BB0',
              p: '20px 10px',
              gap: '25px',
              display: 'flex',
              flexDirection: 'column',
              opacity: statsLoading ? 0.6 : 1,
            }}
          >
            <Typography
              variant='mediumHeaderBold'
              component='p'
              sx={{ textTransform: 'uppercase', color: colors.Freeze }}
            >
              {item.title}
            </Typography>
            <Typography
              variant='bodyTextMilkDefault'
              component='p'
              sx={{ fontWeight: 700, color: colors.Freeze }}
            >
              {item.total}
            </Typography>
            <Box sx={{ width: '100%', textAlign: 'right' }}>
              <Typography
                variant='bodyTextMilkDefault'
                component='p'
                sx={{
                  fontWeight: 500,
                  color: item.status ? colors.Success : colors.Caution,
                }}
              >
                {`you have ${item.percentage ?? 0}% ${
                  item.status ? 'climbed' : 'dip'
                }`}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Users server list */}
      <ScrollableSection<UserListItem>
        title='USER table'
        items={rows}
        fields={userSponsorshipFieldData}
        searchKeys={['user_name', 'phone_number', 'email']}
        searchPlaceholder='Search by name, phone or email...'
        serverSearch
        loading={isFetching && rows.length === 0}
        hasMore={hasMore}
        onSearchChange={(q) => debouncedApplySearch(q)}
        onLoadMore={() => setPage((p) => p + 1)}
        getItemKey={(u) => u.sponsor_id}
        renderRight={(u) => (
          <IconButton
            aria-label='View user'
            onClick={() =>
              navigate(
                ROUTES.USERS_DETAILS.replace(
                  ':sponsor_id',
                  String(u.sponsor_id)
                )
              )
            }
            sx={{ color: '#fff', mt: 0.5 }}
          >
            <VisibilityRounded />
          </IconButton>
        )}
      />
    </>
  );
}
