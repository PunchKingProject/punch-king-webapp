// pages/admin/Licensing/MobileLicensingDashboard.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import debounce from 'lodash.debounce';
import type { DateRange } from 'react-day-picker';
import { toast } from 'react-toastify';
import MetricsDateFilterDrawer from '../Dashboard/components/MetricsDateFilterDrawer';
import { ScrollableSection } from '../components/ScrollableSection';
import { useLicenses } from './hooks/useLicenses';
import { colors } from '../../../theme/colors';
import { licenseFieldData, type LicenseListItem } from './ui/fields';
import ROUTES from '../../../routes/routePath';
import { useNavigate } from 'react-router-dom';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';


const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');
const formatRangeLabel = (from?: Date, to?: Date) => {
  if (!from || !to) return 'Last 30 days';
  return `${dayjs(from).format('MMM D')} – ${dayjs(to).format('MMM D, YYYY')}`;
};

export default function MobileLicensingDashboard() {
 

  const navigate = useNavigate();

  // ===== metrics-only date range =====
  const [metricRange, setMetricRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = metricRange;
  const metricDayPickerRange: DateRange | undefined = {
    from: start.toDate(),
    to: end.toDate(),
  };

  // hit the same endpoint as desktop, but use it to derive both cards + list
  const start_date = fmt(start);
  const end_date = fmt(end);

  // ===== fetch (server pagination + search) =====
  const [page, setPage] = useState(1); // API is 1-based
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<LicenseListItem[]>([]);

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

  const { data, isFetching, isError } = useLicenses({
    start_date,
    end_date,
    page,
    page_size: 10,
    search: query || undefined,
  });

  useEffect(() => {
    if (isError) toast.error('Failed to fetch licenses.');
  }, [isError]);

  // ===== metric cards (same text as desktop) =====
  const metricCards = useMemo(() => {
    const c = data?.cards;
    return [
      {
        title: 'ALL LICENSED TEAMS',
        total: c?.teams_with_active_licenses ?? 0,
        percentage: 0,
        status: true,
      },
      {
        title: 'TEAMS WITHOUT LICENSE',
        total: c?.teams_without_active_licenses ?? 0,
        percentage: 0,
        status: false,
      },
      {
        title: 'LICENSE REQUESTS',
        total: c?.total_licenses ?? 0,
        percentage: 0,
        status: true,
      },
      {
        title: 'PROCESSED LICENSE',
        total: c?.active_licenses ?? 0,
        percentage: 0,
        status: true,
      },
      {
        title: 'LICENSE IN PROCESSING',
        total: c?.unconfirmed_non_active_licenses ?? 0,
        percentage: 0,
        status: false,
      },
      {
        title: 'LICENSING VALUE',
        total: c?.total_license_value ?? 0,
        percentage: 0,
        status: true,
      },
    ];
  }, [data]);

  // center scroller on 2nd card
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const secondCardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    secondCardRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
    });
  }, []);

  // ===== map/append rows =====
  useEffect(() => {
    const apiRows = data?.table.data ?? [];
    const mapped: LicenseListItem[] = apiRows.map((r) => ({
      id: r.id,
      team_id: r.team.id,
      team_name: r.team.team_name,
      phone_number: r.team.phone_number,
      payment_confirmation_status: (r.payment_status ??
        '—') as LicenseListItem['payment_confirmation_status'],
      licensing_status: (r.license_status ??
        '—') as LicenseListItem['licensing_status'],
    }));
    if (page === 1) setRows(mapped);
    else if (mapped.length) setRows((prev) => [...prev, ...mapped]);
  }, [data, page]);

  const total = data?.table.metadata.total_count ?? 0;
  const hasMore = rows.length < total;

  return (
    <>
      {/* Header w/ date filter for metrics + list (same as Users/Teams mobile) */}
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
          LICENSING
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
            title='Filter licensing metrics'
            onApply={(r) => {
              if (!r?.from || !r.to) return;
              setMetricRange([dayjs(r.from), dayjs(r.to)]);
              setPage(1);
            }}
          />
        </Box>
      </Box>
      {/* Sliding metric cards */}
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
        {metricCards.map((m, i) => (
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
                {`you have ${m.percentage ?? 0}% ${m.status ? 'climb' : 'dip'}`}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      {/* LICENSE requests list (server) */}
      <ScrollableSection<LicenseListItem>
        title='LICENSE requests'
        items={rows}
        fields={licenseFieldData}
        searchKeys={[
          'team_name',
          'phone_number',
          'payment_confirmation_status',
          'licensing_status',
        ]}
        searchPlaceholder='Search by team, phone or status...'
        serverSearch
        loading={isFetching && rows.length === 0}
        hasMore={hasMore}
        onSearchChange={(q) => debouncedApplySearch(q)}
        onLoadMore={() => setPage((p) => p + 1)}
        getItemKey={(r, i) => r.id ?? `${r.team_name}-${i}`}
        renderRight={(
          r // ⬅️ add the eye
        ) => (
          <IconButton
            aria-label='View license'
            onClick={() =>
              navigate(
                ROUTES.LICENSING_DETAILS.replace(':team_id', String(r.team_id))
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
