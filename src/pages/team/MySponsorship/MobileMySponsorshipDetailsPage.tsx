// src/pages/team/MySponsorship/SponsorDetails/MobileMySponsorshipDetailsPage.tsx
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {
  Box,
  Button,
  IconButton,
  Link as MLink,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

import { useSponsorRelatedStats } from './hooks/useSponsorRelatedStats';
import { useSponsorRelatedList } from './hooks/useSponsorRelatedList';
import {
  sponsorRelatedFieldData,
  type MobileSponsorRelatedItem,
} from './ui/fields';
import ROUTES from '../../../routes/routePath';
import { colors } from '../../../theme/colors';
import MetricsDateFilterDrawer from '../../admin/Dashboard/components/MetricsDateFilterDrawer';
import MobileSponsorStatsStrip from './components/MobileSponsorStatsStrip';
import { ScrollableSection } from '../../admin/components/ScrollableSection';

// ---- helpers (this route family uses DD-MM-YYYY) ----
const fmtDMY = (d: Dayjs) => d.format('DD-MM-YYYY');
const fmtListDate = (iso: string) => dayjs(iso).format('D/M/YYYY');

const formatRangeLabel = (from?: Date, to?: Date) => {
  if (!from || !to) return 'Last 30 days';
  const a = dayjs(from).format('MMM D');
  const b = dayjs(to).format('MMM D, YYYY');
  return `${a} – ${b}`;
};

export default function MobileMySponsorshipDetailsPage() {
 

  const navigate = useNavigate();
  const { sponsorId } = useParams<{ sponsorId: string }>();
  const sponsor_id = Number(sponsorId);

  // ===== Date filter
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;
  const dayPickerRange: DateRange | undefined = {
    from: start.toDate(),
    to: end.toDate(),
  };

  // ===== Stats (DD-MM-YYYY per your types)
  const { data: stats, isLoading: statsLoading } = useSponsorRelatedStats({
    sponsor_id,
    start_date: fmtDMY(start),
    end_date: fmtDMY(end),
  });

  // ===== Paginated list (DD-MM-YYYY)
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<MobileSponsorRelatedItem[]>([]);
  const { data: listResp, isFetching: listFetching } = useSponsorRelatedList({
    sponsor_id,
    page,
    page_size: 10,
    start_date: fmtDMY(start),
    end_date: fmtDMY(end),
  });

  const mapped: MobileSponsorRelatedItem[] = useMemo(() => {
    const d = listResp?.data ?? [];
    return d.map((r) => ({
      id: r.id,
      date: fmtListDate(r.created_at),
      units: String(r.units ?? ''),
      amount: String(r.equivalent_amount ?? ''),
      team_name: r.team_name ?? '',
    }));
  }, [listResp]);

  // Reset when date range / sponsor changes
  useEffect(() => {
    setPage(1);
    setRows([]);
  }, [start, end, sponsor_id]);

  // Append current page
  useEffect(() => {
    if (page === 1) setRows(mapped);
    else if (mapped.length) setRows((prev) => [...prev, ...mapped]);
  }, [mapped, page]);

  const total = listResp?.metadata?.total_count ?? rows.length;
  const hasMore = rows.length < total;

  return (
    <Box sx={{ px: 2, py: 2 }}>
      {/* Back + breadcrumbs (kept identical to other mobile pages) */}
      <Button
        variant='outlined'
        onClick={() => navigate(-1)}
        size='small'
        sx={{
          borderColor: '#EFAF00',
          color: '#EFAF00',
          textTransform: 'none',
          mb: 1,
          height: 28,
          px: 1.25,
          borderRadius: '10px',
        }}
        startIcon={<ArrowBackIosNewIcon fontSize='small' />}
      >
        Back
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
        <MLink
          component={RouterLink}
          to={ROUTES.TEAM}
          underline='none'
          sx={{ color: '#A2A2A2', fontWeight: 700, fontSize: 12 }}
        >
          TEAM DASHBOARD
        </MLink>
        <Typography sx={{ color: '#A2A2A2' }}>/</Typography>
        <MLink
          component={RouterLink}
          to={ROUTES.MY_SPONSORSHIP}
          underline='none'
          sx={{ color: '#A2A2A2', fontWeight: 700, fontSize: 12 }}
        >
          SPONSORSHIPS
        </MLink>
        <Typography sx={{ color: '#A2A2A2' }}>/</Typography>
        <Typography sx={{ color: '#A2A2A2', fontWeight: 700, fontSize: 12 }}>
          SPONSOR DETAILS
        </Typography>
      </Box>
      {/* Header + date filter */}
      <Box
        sx={{
          pt: 0.5,
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='mediumHeaderBold' sx={{ color: colors.Freeze }}>
          Sponsor details
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
            title='Filter sponsor details'
            onApply={(r) => {
              if (!r.from || !r.to) return;
              setRange([dayjs(r.from), dayjs(r.to)]);
            }}
          />
        </Box>
      </Box>
      {/* Sliding metrics */}
      <MobileSponsorStatsStrip
        loading={statsLoading}
        totalSponsorships={stats?.total_points ?? 0} // points = units
        totalSponsors={0} // N/A here; keeps strip consistent (4 cards)
        sponsorshipValue={stats?.total_cash ?? 0}
        teamRank={0}
      />
      {/* Transactions with this sponsor */}
      <ScrollableSection<MobileSponsorRelatedItem>
        title='Sponsorship history'
        items={rows}
        fields={sponsorRelatedFieldData}
        searchKeys={['date', 'units', 'amount', 'team_name']}
        searchPlaceholder='Search'
        loading={listFetching && rows.length === 0}
        serverSearch={false}
        hasMore={hasMore}
        onLoadMore={() => setPage((p) => p + 1)}
        getItemKey={(r) => r.id}
        renderRight={() => (
          <Tooltip title='View'>
            <IconButton aria-label='View' sx={{ color: '#fff', mt: 0.5 }}>
              <VisibilityRounded />
            </IconButton>
          </Tooltip>
        )}
      />
    </Box>
  );
}
