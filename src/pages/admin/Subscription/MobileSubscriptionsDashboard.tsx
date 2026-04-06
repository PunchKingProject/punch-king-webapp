import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import debounce from 'lodash.debounce';
import type { DateRange } from 'react-day-picker';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';

import MetricsDateFilterDrawer from '../Dashboard/components/MetricsDateFilterDrawer.tsx';
import { ScrollableSection } from '../components/ScrollableSection.tsx';
import ROUTES from '../../../routes/routePath.ts';

import { useSubscriptions } from './hooks/useSubscriptions.ts';
import StatusChip from '../../../components/chips/StatusChip.tsx';
import { subFieldData, type SubListItem } from './ui/fields.ts';
import { colors } from '../../../theme/colors.ts';

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');
const formatRangeLabel = (from?: Date, to?: Date) => {
  if (!from || !to) return 'Last 30 days';
  return `${dayjs(from).format('MMM D')} – ${dayjs(to).format('MMM D, YYYY')}`;
};

export default function MobileSubscriptionsDashboard() {
  const navigate = useNavigate();

  // ===== metrics + list date scope =====
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;
  const start_date = fmt(start);
  const end_date = fmt(end);

  const dayPickerRange: DateRange | undefined = {
    from: start.toDate(),
    to: end.toDate(),
  };

  // ===== cards source =====
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<SubListItem[]>([]);
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

  const { data, isFetching, isError } = useSubscriptions({
    start_date,
    end_date,
    page,
    page_size: 10,
    search: query || undefined,
  });

  useEffect(() => {
    if (isError) toast.error('Failed to fetch subscriptions.');
  }, [isError]);

  // ===== metric cards (like your mock) =====
  const cards = [
    {
      title: 'ALL SUBSCRIBED TEAMS',
      total: data?.cards?.teams_with_active_subs ?? 0,
      percentage: 0,
      status: true,
    },
    {
      title: 'TEAMS WITHOUT SUBSC.',
      total: data?.cards?.teams_without_active_subs ?? 0,
      percentage: 0,
      status: true,
    },
    {
      title: 'SUBSCRIPTION REQUESTS',
      total: data?.cards?.total_subs ?? 0,
      percentage: 0,
      status: true,
    },
  ];

  // center the scroller on the second card (peek effect)
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const secondCardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    secondCardRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
    });
  }, []);

  // ===== map API page to list items =====
  useEffect(() => {
    const apiRows = data?.table.data ?? [];
    const mapped: SubListItem[] = apiRows.map((r) => ({
      id: r.id,
      team_id: r.team.id,
      team_name: r.team.team_name,
      phone_number: r.team.phone_number,
      // chips as values (ScrollableSection supports ReactNode values)
      payment_confirmation_status: (
        <StatusChip label={(r.payment_status ?? '—') as string} />
      ),
      subs_status: (
        <StatusChip label={(r.subscription_status ?? '—') as string} />
      ),
    }));

    if (page === 1) setRows(mapped);
    else if (mapped.length) setRows((prev) => [...prev, ...mapped]);
  }, [data, page]);

  const total = data?.table.metadata.total_count ?? 0;
  const hasMore = rows.length < total;

  return (
    <>
      {/* Header + time frame filter */}
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
          SUBSCRIPTION
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant='bodyTextMilkDefault'
            sx={{ color: colors.Freeze, opacity: 0.8 }}
          >
            {formatRangeLabel(dayPickerRange?.from, dayPickerRange?.to)}
          </Typography>
          <MetricsDateFilterDrawer
            range={dayPickerRange}
            title='Filter subscription metrics'
            onApply={(r) => {
              if (!r?.from || !r.to) return;
              setRange([dayjs(r.from), dayjs(r.to)]);
              setPage(1);
            }}
          />
        </Box>
      </Box>

      {/* Sliding metric cards (same style as other mobile pages) */}
      <Box
        ref={scrollerRef}
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
        {cards.map((m, i) => (
          <Box
            key={m.title}
            ref={i === 1 ? secondCardRef : null}
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
              opacity: isFetching ? 0.6 : 1,
            }}
          >
            <Typography
              variant='mediumHeaderBold'
              component='p'
              sx={{ textTransform: 'uppercase', color: colors.Freeze }}
            >
              {m.title}
            </Typography>
            <Typography
              variant='bodyTextMilkDefault'
              component='p'
              sx={{ fontWeight: 700, color: colors.Freeze }}
            >
              {m.total}
            </Typography>
            <Box sx={{ width: '100%', textAlign: 'right' }}>
              <Typography
                variant='bodyTextMilkDefault'
                component='p'
                sx={{
                  fontWeight: 500,
                  color: m.status ? colors.Success : colors.Caution,
                }}
              >
                {m.status ? 'Trending up' : 'Trending down'}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* SUBSCRIPTION requests (server list) */}
      <ScrollableSection<SubListItem>
        title='SUBSCRIPTION requests'
        items={rows}
        fields={subFieldData}
        searchKeys={['team_name', 'phone_number']}
        searchPlaceholder='Search by team or phone...'
        serverSearch
        loading={isFetching && rows.length === 0}
        hasMore={hasMore}
        onSearchChange={(q) => debouncedApplySearch(q)}
        onLoadMore={() => setPage((p) => p + 1)}
        getItemKey={(r, i) => r.id ?? `${r.team_id}-${i}`}
        renderRight={(r) => (
          <IconButton
            aria-label='View'
            onClick={() =>
              navigate(
                ROUTES.SUBSCRIPTION_DETAILS.replace(
                  ':team_id',
                  String(r.team_id)
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
