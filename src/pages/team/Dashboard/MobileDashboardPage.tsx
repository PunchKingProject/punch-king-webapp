import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import MobileMyCatalogue from './components/MobileMyCatalogue';
import MobileMyLicenses from './components/MobileMyLicenses';
import MobileMySponsorships from './components/MobileMySponsorships';
import MobileMySubscriptions from './components/MobileMySubscriptions';

import MobileTeamsByRanking from './components/MobileTeamsByRanking';

import { useMySubscriptions } from './hooks/useMySubscriptions';
import { useRankedTeams } from './hooks/useRankedTeams';
import { useTeamDashboardStats } from './hooks/useTeamDashboardStats';
import { useTeamLicenseHistory } from './hooks/useTeamLicenseHistory';
import { useTeamPosts } from './hooks/useTeamPosts';
import { useTeamVoteHistory } from './hooks/useTeamVoteHistory';

// shared drawer used across your other mobile dashboards
// ⬇️ adjust path to where your shared drawer actually lives:
import MetricsDateFilterDrawer from '../../admin/Dashboard/components/MetricsDateFilterDrawer';

// Types for mapping (strict — no any)
import type { TeamPost } from './api/dashboard.types';
import type { MobileMetric } from './components/MobileTeamMetricCards';
import MobileTeamMetricCards from './components/MobileTeamMetricCards';

type TeamVoteItem = {
  id: number;
  sponsor_name: string | null;
  units: number;
  equivalent_amount: number;
  created_at: string; // ISO
};
type VoteHistoryPayload = {
  data: TeamVoteItem[];
  metadata: { total_count: number };
};

type TeamSubscriptionItem = {
  id: number;
  type: string | null;
  start_date: string | null;
  end_date: string | null;
  payment_amount: number | null;
};
type SubscriptionsPayload = {
  table: {
    data: TeamSubscriptionItem[];
    metadata: { total_count: number };
  };
};

type TeamLicenseItem = {
  id: number;
  team?: { license_number?: string | null } | null;
  start_date: string | null;
  end_date: string | null;
  payment_amount: number | null;
};
type LicensesPayload = {
  data: TeamLicenseItem[];
  metadata: { total_count: number };
};

type RankedTeamApi = {
  team_id: number;
  team_name: string;
  license_number: string;
  sponsorships: number;
  rank: number;
  sponsors?: number;
};
type RankedTeamsPayload = {
  data: RankedTeamApi[];
  metadata: { total_count: number };
};

const toYMD = (d: Date) => d.toISOString().slice(0, 10);
const fmtNGN = (n?: number | null) => {
  const v = typeof n === 'number' ? n : 0;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 2,
    }).format(v);
  } catch {
    return `₦${v.toLocaleString()}`;
  }
};
const formatRangeLabel = (from?: Date, to?: Date) => {
  if (!from || !to) return 'Last 30 days';
  const a = dayjs(from).format('MMM D');
  const b = dayjs(to).format('MMM D, YYYY');
  return `${a} – ${b}`;
};

function ordinal(n: number) {


  const s = ['th', 'st', 'nd', 'rd'] as const;
  const v = n % 100;
  return `${n}${
    (s as readonly string[])[(v - 20) % 10] ||
    (s as readonly string[])[v] ||
    s[0]
  }`.toUpperCase();
}

export default function MobileDashboardPage() {
  // ===== metrics date range (stats + server lists)
  const [range, setRange] = React.useState<DateRange>(() => {
    const to = new Date();
    const from = new Date(to);
    from.setDate(from.getDate() - 30);
    return { from, to };
  });

  const start_date = React.useMemo(
    () => (range.from ? toYMD(range.from) : toYMD(new Date())),
    [range.from]
  );
  const end_date = React.useMemo(
    () => (range.to ? toYMD(range.to) : toYMD(new Date())),
    [range.to]
  );

  // ===== stats for metric cards
  const { data: statsData, isLoading: statsLoading } = useTeamDashboardStats({
    start_date,
    end_date,
  });
  const metricCards: MobileMetric[] = [
    {
      title: 'SPONSORS',
      total: statsData?.total_sponsors ?? 0,
      percentage: 0,
      climbed: true,
    },
    {
      title: 'CHIPS',
      total: statsData?.sponsorship_balance ?? 0,
      percentage: 0,
      climbed: true,
    },
    {
      title: 'MY LICENSES',
      total: statsData?.total_licenses ?? 0,
      percentage: 0,
      climbed: true,
    },
    {
      title: 'MY SUBSCRIPTIONS',
      total: statsData?.total_subscriptions ?? 0,
      percentage: 0,
      climbed: true,
    },
  ];

  // ===== catalogue
  const { data: postsData, isLoading: postsLoading } = useTeamPosts();
  const catalogue = ((postsData ?? []) as TeamPost[]).map((p, idx) => ({
    idx: idx + 1,
    id: p.id,
    img: p.file_url,
    caption: p.caption,
    date: dayjs(p.created_at).format('D/M/YYYY'),
    comments: p.comments_count,
    sponsors: p.sponsors ?? 0,
  }));

  // ===== sponsorships (server search + load more)
  const [spPageSize, setSpPageSize] = React.useState<number>(10);
  const [spSearch, setSpSearch] = React.useState<string>('');
  const applySpSearch = React.useMemo(
    () => debounce((q: string) => setSpSearch(q), 350),
    []
  );
  React.useEffect(() => () => applySpSearch.cancel(), [applySpSearch]);

  const { data: voteData, isLoading: votesLoading } = useTeamVoteHistory({
    start_date,
    end_date,
    page: 1,
    page_size: spPageSize,
    search: spSearch || undefined,
  });

  const votePayload = voteData as VoteHistoryPayload | undefined;
  const sponsorshipRows = (votePayload?.data ?? []).map((r, idx) => ({
    idx: idx + 1,
    sponsor_name: r.sponsor_name ?? '—',
    date: dayjs(r.created_at).format('D/M/YYYY'),
    amount_paid: fmtNGN(r.equivalent_amount),
    units: r.units ?? 0,
  }));
  const spTotal = votePayload?.metadata.total_count ?? 0;
  const spHasMore = sponsorshipRows.length < spTotal;

  // ===== subscriptions (server search + load more)
  const [subPageSize, setSubPageSize] = React.useState<number>(10);
  const [subSearch, setSubSearch] = React.useState<string>('');
  const applySubSearch = React.useMemo(
    () => debounce((q: string) => setSubSearch(q), 350),
    []
  );
  React.useEffect(() => () => applySubSearch.cancel(), [applySubSearch]);

  const { data: subsData, isLoading: subsLoading } = useMySubscriptions({
    start_date,
    end_date,
    page: 1,
    page_size: subPageSize,
    search: subSearch || undefined,
  });

  const subsPayload = subsData as SubscriptionsPayload | undefined;
  const subsRows = (subsPayload?.table.data ?? []).map((r, idx) => ({
    idx: idx + 1,
    subscription_type: (r.type || '—')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (m) => m.toUpperCase()),
    start_date: r.start_date ? dayjs(r.start_date).format('D/M/YYYY') : '—',
    end_date: r.end_date ? dayjs(r.end_date).format('D/M/YYYY') : '—',
    amount_paid: fmtNGN(r.payment_amount),
    status: r.end_date
      ? dayjs(r.end_date).isAfter(dayjs())
        ? 'Active'
        : 'Expired'
      : '—',
  }));
  const subTotal = subsPayload?.table.metadata.total_count ?? 0;
  const subHasMore = subsRows.length < subTotal;

  // ===== licenses (client search only)
  const { data: licData, isLoading: licLoading } = useTeamLicenseHistory({
    page: 1,
    page_size: 50,
  });

  const licPayload = licData as LicensesPayload | undefined;
  const licRows = (licPayload?.data ?? []).map((r, idx) => ({
    idx: idx + 1,
    license_name: r.team?.license_number || '—',
    start_date: r.start_date ? dayjs(r.start_date).format('D/M/YYYY') : '—',
    end_date: r.end_date ? dayjs(r.end_date).format('D/M/YYYY') : '—',
    amount_paid: fmtNGN(r.payment_amount),
    status: r.end_date
      ? dayjs(r.end_date).isAfter(dayjs())
        ? 'Active'
        : 'Expired'
      : '—',
  }));

  // ===== team ranking
  const { data: rankData, isLoading: rankLoading } = useRankedTeams({
    page: 1,
    page_size: 10,
  });

  const rankPayload = rankData as RankedTeamsPayload | undefined;
  const ranking = (rankPayload?.data ?? []).map((t) => ({
    team_id: t.team_id,
    team_name: t.team_name,
    lc: t.license_number,
    sponsors: t.sponsors ?? 0,
    position: ordinal(t.rank),
    contributors: t.sponsorships ?? 0,
  }));

  return (
    <Box sx={{ px: 2, py: 2 }}>
      {/* Header with date drawer */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Typography sx={{ color: '#A2A2A2', fontWeight: 700, fontSize: 12 }}>
          TEAM DASHBOARD
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: '#FFFCF4', fontSize: 12, opacity: 0.85 }}>
            {formatRangeLabel(range.from ?? undefined, range.to ?? undefined)}
          </Typography>
          <MetricsDateFilterDrawer
            range={range}
            title='Filter metrics'
            onApply={(r) => {
              if (!r?.from || !r?.to) return;
              setRange({ from: r.from, to: r.to });
              // reset server lists window
              setSpPageSize(10);
              setSubPageSize(10);
            }}
          />
        </Box>
      </Box>
      {/* Sliding metric cards */}
      <MobileTeamMetricCards loading={statsLoading} metrics={metricCards} />
      {/* My catalogue */}
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ color: '#fff', fontWeight: 900, mb: 1 }}>
          My catalogue
        </Typography>
        <MobileMyCatalogue rows={catalogue} loading={postsLoading} />
      </Box>
      {/* My sponsorships — server search + load more */}
      <Box sx={{ mt: 3 }}>
        <MobileMySponsorships
          rows={sponsorshipRows}
          loading={votesLoading}
          serverSearch
          onSearchChange={applySpSearch}
          hasMore={spHasMore}
          onLoadMore={() => setSpPageSize((s) => s + 10)}
        />
      </Box>
      {/* My subscriptions — server search + load more */}
      <Box sx={{ mt: 3 }}>
        <MobileMySubscriptions
          rows={subsRows}
          loading={subsLoading}
          serverSearch
          onSearchChange={applySubSearch}
          hasMore={subHasMore}
          onLoadMore={() => setSubPageSize((s) => s + 10)}
        />
      </Box>
      {/* My licenses — client search */}
      <Box sx={{ mt: 3 }}>
        <MobileMyLicenses rows={licRows} loading={licLoading} />
      </Box>
      {/* Team Ranking */}
      <Box sx={{ mt: 3, mb: 6 }}>
        <Typography sx={{ color: '#fff', fontWeight: 900, mb: 1 }}>
          Team Ranking
        </Typography>
        <MobileTeamsByRanking rows={ranking} loading={rankLoading} />
      </Box>
      <Box sx={{ height: 16 }} />
    </Box>
  );
}
