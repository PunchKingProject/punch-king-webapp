import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import { Box, Button, IconButton, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import ROUTES from '../../../routes/routePath';
import { colors } from '../../../theme/colors';
import MetricsDateFilterDrawer from '../../admin/Dashboard/components/MetricsDateFilterDrawer';
import { ScrollableSection } from '../../admin/components/ScrollableSection';

import PKImageDialog from '../../../components/modal/PkImageDialog';
import { useUserStats } from '../Dashboard/hooks/useUserStats';
import { usePurchaseHistory } from './hooks/usePurchaseHistory';
import { purchaseFieldData, type MobilePurchaseListItem } from './fields';


const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 2,
  }).format(n);

export default function MobileMySponsorshipsPage() {
  const navigate = useNavigate();

  // ===== Date range (cards + list) =====
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;
  const start_date = fmt(start);
  const end_date = fmt(end);

  const dayPickerRange: DateRange = { from: start.toDate(), to: end.toDate() };

  // ===== Stats cards =====
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsErr,
  } = useUserStats({ start_date, end_date });
  useEffect(() => {
    if (statsErr) toast.error('Failed to fetch sponsorship stats.');
  }, [statsErr]);

  const cards = [
    {
      title: 'MY CHIPS',
      total: stats?.sponsorship_balance ?? 0,
      cta: (
        <Button
          size='small'
          variant='outlined'
          onClick={() => navigate(ROUTES.USER_BUY_SPONSORS)}
          sx={{
            borderColor: '#f0c040',
            color: '#f0c040',
            textTransform: 'none',
            fontWeight: 700,
            px: 1.5,
            py: 0.5,
            mt: 1,
          }}
        >
          Buy sponsor units
        </Button>
      ),
    },
    { title: 'SPENT UNITS', total: stats?.spent_units ?? 0 },
    {
      title: 'SPONSORSHIP VALUE',
      total: fmtCurrency(stats?.total_amount_spent ?? 0),
    },
    { title: 'SPONSORED TEAMS', total: stats?.distinct_teams_sponsored ?? 0 },
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

const [page, setPage] = useState(1); // API is 1-based


  const {
    data: history,
    isFetching,
    isError,
  } = usePurchaseHistory({
    page,
    page_size: 10,
    start_date,
    end_date,
  });
  useEffect(() => {
    if (isError) toast.error('Failed to fetch purchase history.');
  }, [isError]);

  const listItems: MobilePurchaseListItem[] = useMemo(() => {
    const rows = history?.data ?? [];
    return rows.map((r) => ({
      id: r.id,
      payment_date: dayjs(r.payment_date).format('M/D/YYYY'),
      payment_amount: fmtCurrency(r.payment_amount),
      sponsorship_points: r.sponsorship_points,
      username: r.team?.team_name ?? r.team?.username ?? '—',
      payment_slip: r.payment_slip || null,
    }));
  }, [history]);

  const total = history?.metadata.total_count ?? 0;
  const hasMore = (history?.data.length ?? 0) < total;

  // ===== Image dialog (slip) =====
  const [openSlip, setOpenSlip] = useState<{
    open: boolean;
    src: string | null;
  }>({ open: false, src: null });

  return (
    <>
      {/* Header + timeframe */}
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

      {/* Cards slider */}
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
              gap: '8px',
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
              {m.title}
            </Typography>
            <Typography
              variant='bodyTextMilkDefault'
              component='p'
              sx={{ fontWeight: 700, color: colors.Freeze }}
            >
              {m.total}
            </Typography>
            {m.cta}
          </Box>
        ))}
      </Box>

      {/* Purchase history list */}
      <ScrollableSection<MobilePurchaseListItem>
        title='SPONSORSHIP purchase history'
        items={listItems}
        fields={purchaseFieldData}
        // client-only search – hide icon for now (API doesn’t support)
        searchKeys={['username', 'payment_date']}
        searchPlaceholder='Search purchases…'
        serverSearch={false}
        loading={isFetching && listItems.length === 0}
        hasMore={hasMore}
        onLoadMore={() => setPage((p) => p + 1)}
        // trailing eye to view slip
        renderRight={(row) =>
          row.payment_slip ? (
            <IconButton
              aria-label='View'
              sx={{ color: '#fff', mt: 0.5 }}
              onClick={() => setOpenSlip({ open: true, src: row.payment_slip ?? null })}
            >
              <VisibilityRounded />
            </IconButton>
          ) : undefined
        }
      />

      {/* Slip preview (mobile-friendly) */}
      <PKImageDialog
        open={openSlip.open}
        onClose={() => setOpenSlip({ open: false, src: null })}
        title='Payment slip'
        src={openSlip.src ?? undefined}
      />
    </>
  );
}
