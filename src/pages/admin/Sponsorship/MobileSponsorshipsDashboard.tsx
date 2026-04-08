// pages/admin/Sponsorships/MobileSponsorshipsDashboard.tsx
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import { Box, IconButton, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import ROUTES from '../../../routes/routePath';
import { colors } from '../../../theme/colors';
import { ScrollableSection } from '../components/ScrollableSection';
import { useSponsorships } from './hooks/useSponsorships';

import MetricsDateFilterDrawer from '../Dashboard/components/MetricsDateFilterDrawer';
import type { SponsorshipListItem } from './ui/fields';
import { sponsorshipFieldData } from './ui/fields';

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

export default function MobileSponsorshipsDashboard() {

  const navigate = useNavigate();

  // ----- date range
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

  // ----- server list
  const [page, setPage] = useState(1); // API is 1-based
  const [search, setSearch] = useState('');
  const debouncedSearch = useMemo(
    () =>
      debounce((q: string) => {
        setPage(1);
        setSearch(q);
      }, 400),
    []
  );
  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const { data, isFetching, isError } = useSponsorships({
    start_date,
    end_date,
    page,
    page_size: 10,
    search: search || undefined,
  });

  useEffect(() => {
    if (isError) toast.error('Failed to fetch sponsorships.');
  }, [isError]);

  // ----- cards
  const cards = [
    {
      title: 'ALL SPONSORSHIPS',
      total: data?.cards?.total_requests ?? 0,
      percentage: 0,
      status: true,
    },
    {
      title: 'SPONSORSHIP VALUE',
      total: data?.cards?.total_amount ?? 0,
      percentage: 0,
      status: true,
    },
    {
      title: 'VOLUME',
      total: data?.cards?.total_points ?? 0,
      percentage: 0,
      status: true,
    },
  ];

  // “peek” scroll
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const secondCardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    secondCardRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
    });
  }, []);

  // ----- map to mobile rows
  const rows: SponsorshipListItem[] = useMemo(() => {
    const list = data?.table?.data ?? [];
    return list.map((r) => ({
      id: r.id,
      team_id: r.team?.id ?? 0, // ✅ use team id for navigation
      sponsor_name: r.team?.username || r.team?.team_name || '—',
      phone_number: r.team?.phone_number || '—',
      payment_confirmation_status: r.payment_status
        ? (capitalize(r.payment_status) as 'Pending' | 'Failed' | 'Confirmed')
        : '—',
      sponsorship_status: r.purchase_status
        ? (capitalize(r.purchase_status) as 'Pending' | 'Processed' | 'Failed')
        : '—',
    }));
  }, [data]);

  const total = data?.table?.metadata?.total_count ?? 0;
  const hasMore = (data?.table?.data?.length ?? 0) < total;

  return (
    <>
      {/* header + timeframe */}
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
          SPONSORSHIPS
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant='bodyTextMilkDefault'
            sx={{ color: colors.Freeze, opacity: 0.8 }}
          >
            {`${start.format('MMM D')} – ${end.format('MMM D, YYYY')}`}
          </Typography>
          <MetricsDateFilterDrawer
            range={dayPickerRange}
            title='Filter sponsorship metrics'
            onApply={(r) => {
              if (!r?.from || !r.to) return;
              setRange([dayjs(r.from), dayjs(r.to)]);
              setPage(1);
            }}
          />
        </Box>
      </Box>
      {/* cards slider */}
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
                {`you have ${m.percentage}% ${m.status ? 'climbed' : 'dip'}`}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      {/* list */}
      <ScrollableSection<SponsorshipListItem>
        title='SPONSORSHIP requests'
        items={rows}
        fields={sponsorshipFieldData}
        searchKeys={[
          'sponsor_name',
          'phone_number',
          'payment_confirmation_status',
          'sponsorship_status',
        ]}
        searchPlaceholder='Search sponsorships...'
        serverSearch
        loading={isFetching && rows.length === 0}
        hasMore={hasMore}
        onSearchChange={(q) => debouncedSearch(q)}
        onLoadMore={() => setPage((p) => p + 1)}
        renderRight={(row) => (
          <IconButton
            aria-label='View'
            sx={{ color: '#fff', mt: 0.5 }}
            onClick={() =>
              navigate(
                ROUTES.SPONSORSHIP_DETAILS.replace(
                  ':sponsor_id',
                  String(row.team_id),
                ),
              )
            }
          >
            <VisibilityRounded />
          </IconButton>
        )}
      />
    </>
  );
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
