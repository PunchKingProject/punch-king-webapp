import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';

import ROUTES from '../../../routes/routePath';
import { colors } from '../../../theme/colors';
import { ScrollableSection } from '../../admin/components/ScrollableSection';

import MetricsDateFilterDrawer from '../../admin/Dashboard/components/MetricsDateFilterDrawer';

import {
  mapApiToRows,
  type SponsorshipRow,
} from './components/DesktopSponsorshipHistoryTable';
import { useTeamSponsorshipStats } from './hooks/useTeamSponsorshipStats';
import { useTeamSponsorshipHistory } from './hooks/useTeamSponsorshipHistory';

import MobileSponsorStatsStrip from './components/MobileSponsorStatsStrip';
import {
  sponsorshipHistoryFieldData,
  type MobileSponsorshipItem,
} from './ui/fields';

// ✅ Stats = YYYY-MM-DD, History = DD-MM-YYYY
const fmtStatsYMD = (d: Dayjs) => d.format('YYYY-MM-DD');
const fmtHistDMY = (d: Dayjs) => d.format('DD-MM-YYYY');

const formatRangeLabel = (from?: Date, to?: Date) => {
  if (!from || !to) return 'Last 30 days';
  const a = dayjs(from).format('MMM D');
  const b = dayjs(to).format('MMM D, YYYY');
  return `${a} – ${b}`;
};

export default function MobileMySponsorshipPage() {


  const navigate = useNavigate();

  /** ======== Metrics date filter (matches other mobile dashboards) ======== */
  const [metricRange, setMetricRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = metricRange;
  const dayPickerRange: DateRange | undefined = {
    from: start.toDate(),
    to: end.toDate(),
  };

  // Stats: YYYY-MM-DD
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useTeamSponsorshipStats({
    start_date: fmtStatsYMD(start),
    end_date: fmtStatsYMD(end),
  });

  useEffect(() => {
    if (statsError) {
      // keep quiet on mobile like subs
      console.log('Failed to fetch sponsorship stats.');
    }
  }, [statsError]);

  /** ======== Sponsorship history (server paging; no server search) ======== */
  const [histPage, setHistPage] = useState(1);
  const [histRows, setHistRows] = useState<MobileSponsorshipItem[]>([]);

  // History: DD-MM-YYYY (required by your types)
  const { data: histResp, isFetching: histFetching } =
    useTeamSponsorshipHistory({
      page: histPage,
      page_size: 10,
      start_date: fmtHistDMY(start),
      end_date: fmtHistDMY(end),
    });

  const histMapped: SponsorshipRow[] = useMemo(
    () => mapApiToRows(histResp?.data ?? []),
    [histResp]
  );

  useEffect(() => {
    const pageItems: MobileSponsorshipItem[] = histMapped.map((r) => ({
      sponsor_id: r.sponsor_id,
      sponsor_name: r.sponsor_name,
      sponsorship_date: r.date, // already display-ready
      amount: String(r.amount ?? ''), // ScrollableSection expects strings
      qty: String(r.qty ?? ''), // ^
    }));

    if (histPage === 1) setHistRows(pageItems);
    else if (pageItems.length) setHistRows((prev) => [...prev, ...pageItems]);
  }, [histMapped, histPage]);

  const histTotal = histResp?.metadata?.total_count ?? histRows.length;
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
          {' '}
          Sponsorships
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
            title='Filter sponsorship metrics'
            onApply={(r) => {
              if (!r.from || !r.to) return;
              const s = dayjs(r.from);
              const e = dayjs(r.to);
              setMetricRange([s, e]);
            }}
          />
        </Box>
      </Box>
      {/* Sliding stats strip */}
      <MobileSponsorStatsStrip
        loading={statsLoading}
        totalSponsorships={stats?.total_sponsorships ?? 0}
        totalSponsors={stats?.total_sponsors ?? 0}
        sponsorshipValue={stats?.sponsorship_value ?? 0}
        teamRank={stats?.team_rank ?? 0}
      />
      {/* Sponsorship history */}
      <ScrollableSection<MobileSponsorshipItem>
        title='Sponsorship history'
        items={histRows}
        fields={sponsorshipHistoryFieldData}
        searchKeys={['sponsor_name', 'sponsorship_date', 'amount', 'qty']}
        searchPlaceholder='Search'
        loading={histFetching && histRows.length === 0}
        serverSearch={false}
        hasMore={histHasMore}
        onLoadMore={() => setHistPage((p) => p + 1)}
        getItemKey={(r) =>
          `${r.sponsor_id}-${r.sponsorship_date}-${r.amount}-${r.qty}`
        }
        renderRight={(r) => (
          <Tooltip title='View'>
            <IconButton
              aria-label='View sponsorship'
              onClick={() =>
                navigate(
                  ROUTES.TEAM_MYSPONSORSHIP_DETAILS.replace(
                    ':sponsorId',
                    String(r.sponsor_id),
                  ),
                )
              }
              sx={{ color: '#fff', mt: 0.5 }}
            >
              <VisibilityRounded />
            </IconButton>
          </Tooltip>
        )}
      />
    </Box>
  );
}
