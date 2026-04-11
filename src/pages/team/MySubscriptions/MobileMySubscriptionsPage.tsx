import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import {
  Box,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../routes/routePath.ts';
import { colors } from '../../../theme/colors.ts';

import { ScrollableSection } from '../../admin/components/ScrollableSection.tsx';

import {
  mapSubHistoryApiToRows,
  type SubHistoryRow,
} from './components/DesktopSubHistoryTable.tsx';
import {
  mapPaymentApiToRows,
  type SubPaymentRow,
} from './components/DesktopSubPaymentHistoryTable.tsx';
import {
  useTeamSubActiveInactive,
  useTeamSubPayments,
} from './hooks/useSubTables.ts';
import { useTeamSubStats } from './hooks/useTeamSubStats.ts';

import MetricsDateFilterDrawer from '../../admin/Dashboard/components/MetricsDateFilterDrawer.tsx';
import MobileSubStatsStrip from './components/MobileSubStatsStrip.tsx';
import {
  subHistoryFieldData,
  subPaymentFieldData,
  type MobileSubHistoryItem,
  type MobileSubPaymentItem,
} from './ui/fields.ts';

const fmtStats = (d: Dayjs) => d.format('DD-MM-YYYY'); // API expects DD-MM-YYYY (same as desktop)
const formatRangeLabel = (from?: Date, to?: Date) => {
  if (!from || !to) return 'Last 30 days';
  const a = dayjs(from).format('MMM D');
  const b = dayjs(to).format('MMM D, YYYY');
  return `${a} – ${b}`;
};



export default function MobileMySubscriptionsPage() {
  const navigate = useNavigate();

  /** ======== Metrics date filter (consistent with other mobile dashboards) ======== */
  const [metricRange, setMetricRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = metricRange;
  const dayPickerRange: DateRange | undefined = {
    from: start.toDate(),
    to: end.toDate(),
  };

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useTeamSubStats({
    start_date: fmtStats(start),
    end_date: fmtStats(end),
  });

  useEffect(() => {
    if (statsError) {
      // toast has been used elsewhere; keeping UI clean on mobile

      console.log('Failed to fetch subscription stats.');
    }
  }, [statsError]);



  /** ======== Subscription payment history (server paging; no server search) ======== */
  const [payPage, setPayPage] = useState(1);
  const [payRows, setPayRows] = useState<MobileSubPaymentItem[]>([]);
  const { data: payResp, isFetching: payFetching } = useTeamSubPayments({
    page: payPage,
    page_size: 10,
  });
  const payMapped: SubPaymentRow[] = useMemo(
    () => mapPaymentApiToRows(payResp?.data ?? []),
    [payResp]
  );
  useEffect(() => {
    const pageItems: MobileSubPaymentItem[] = payMapped.map((r) => ({
      id: r.id,
      subscription_type: r.subscription_type,
      amount_paid: r.amount_paid,
      payment_date: r.payment_date,
      status: r.status,
      payment_slip: r.payment_slip,
    }));
    if (payPage === 1) setPayRows(pageItems);
    else if (pageItems.length) setPayRows((prev) => [...prev, ...pageItems]);
  }, [payMapped, payPage]);

  const payTotal = payResp?.metadata.total_count ?? payRows.length;
  const payHasMore = payRows.length < payTotal;

  /** ======== Subscription history (server paging; no server search) ======== */
  const [histPage, setHistPage] = useState(1);
  const [histRows, setHistRows] = useState<MobileSubHistoryItem[]>([]);
  const { data: histResp, isFetching: histFetching } = useTeamSubActiveInactive(
    {
      page: histPage,
      page_size: 10,
    }
  );
  const histMapped: SubHistoryRow[] = useMemo(
    () => mapSubHistoryApiToRows(histResp?.data ?? []),
    [histResp]
  );
  useEffect(() => {
    const pageItems: MobileSubHistoryItem[] = histMapped.map((r) => ({
      id: r.id,
      subscription_type: r.subscription_type,
      start_date: r.start_date,
      end_date: r.end_date,
      amount_paid: r.amount_paid,
      status: r.status,
    }));
    if (histPage === 1) setHistRows(pageItems);
    else if (pageItems.length) setHistRows((prev) => [...prev, ...pageItems]);
  }, [histMapped, histPage]);

  const histTotal = histResp?.metadata.total_count ?? histRows.length;
  const histHasMore = histRows.length < histTotal;

  return (
    <Box sx={{ px: 2, py: 2 }}>
      {/* Header + metrics date filter */}
      <Box
        sx={{
          pt: 1,
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='mediumHeaderBold' sx={{ color: colors.Freeze }}>
          Subscriptions
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
              if (!r.from || !r.to) return;
              // update metrics range; the lists remain independent of the metrics filter like other mobile pages
              const s = dayjs(r.from);
              const e = dayjs(r.to);
              setMetricRange([s, e]);
            }}
          />
        </Box>
      </Box>

      {/* Sliding stats strip (NEW) */}
      <MobileSubStatsStrip
        loading={statsLoading}
        active={stats?.active_sub ?? null}
        annualCount={stats?.annual_count ?? 0}
        semiAnnualCount={stats?.semi_annual_count ?? 0}
        onSubscribe={() => navigate(ROUTES.TEAM_SUBSCRIPTION_PAYMENT)}
      />

      {/* Subscription payment history (scrollable list) */}
      <ScrollableSection<MobileSubPaymentItem>
        title='Subscription payment history'
        items={payRows}
        fields={subPaymentFieldData}
        // client-side search across these fields (API doesn’t support search)
        searchKeys={['subscription_type', 'payment_date', 'status']}
        searchPlaceholder='Search'
        loading={payFetching && payRows.length === 0}
        serverSearch={false}
        hasMore={payHasMore}
        onLoadMore={() => setPayPage((p) => p + 1)}
        getItemKey={(r) => r.id}
        renderRight={(r) =>
          r.payment_slip ? (
            <Tooltip title='View slip'>
              <IconButton
                aria-label='View slip'
                onClick={() =>
                  window.open(r.payment_slip as string, '_blank', 'noopener')
                }
                sx={{ color: '#fff', mt: 0.5 }}
              >
                <VisibilityRounded />
              </IconButton>
            </Tooltip>
          ) : null
        }
      />

      {/* Subscription history (scrollable list) */}
      <ScrollableSection<MobileSubHistoryItem>
        title='Subscription history'
        items={histRows}
        fields={subHistoryFieldData}
        searchKeys={['subscription_type', 'start_date', 'end_date', 'status']}
        searchPlaceholder='Search'
        loading={histFetching && histRows.length === 0}
        serverSearch={false}
        hasMore={histHasMore}
        onLoadMore={() => setHistPage((p) => p + 1)}
        getItemKey={(r) => r.id}
      />
    </Box>
  );
}
