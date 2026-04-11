import { Box } from '@mui/material';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ROUTES from '../../../routes/routePath';

import MobileLicenseHistory from './components/MobileLicenseHistory';
import MobileLicensePaymentHistory from './components/MobileLicensePaymentHistory';
import MobileLicensingStatsCards from './components/MobileLicensingStatsCards';

import { useLicenseActiveInactive } from './hooks/useLicenseActiveInactive';
import { useLicensePaymentHistory } from './hooks/useLicensePaymentHistory';
import { useTeamLicenseStats } from './hooks/useTeamLicenseStats';

import TeamMobileBreadcrumbs from '../../../components/breadcrumbs/TeamMobileBreadcrumbs';
import type {
  LicenseHistoryListRow as ApiLicenseHistoryListRow, // active/inactive list envelope
  LicenseHistoryRow as ApiLicenseHistoryRow, // payment history envelope
  LicenseHistoryList,
  TeamLicenseHistory, // payment history envelope
} from './api/mylicensing.types';
import type { LicenseHistoryRow, LicensePaymentRow } from './ui/fields';

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

export default function MobileMyLicensingPage() {
  const navigate = useNavigate();

  // ===== metrics range (last 30 days like desktop) =====
  const end = dayjs();
  const start = dayjs().subtract(30, 'day');

  // Stats API expects DD-MM-YYYY
  const statsStart = start.format('DD-MM-YYYY');
  const statsEnd = end.format('DD-MM-YYYY');

  // History API expects YYYY-MM-DD
  const histStartISO = start.format('YYYY-MM-DD');
  const histEndISO = end.format('YYYY-MM-DD');

  // ----- Stats -----
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsErr,
  } = useTeamLicenseStats({ start_date: statsStart, end_date: statsEnd });

  useEffect(() => {
    if (statsErr) toast.error('Failed to fetch licensing stats.');
  }, [statsErr]);

  // ----- License payment history (no server search in API) -----
  const [payPage, setPayPage] = useState(1);
  const [payRows, setPayRows] = useState<LicensePaymentRow[]>([]);

  const {
    data: payResp,
    isFetching: payFetching,
    isError: payErr,
  } = useLicensePaymentHistory({
    page: payPage,
    page_size: 10,
    start_date: histStartISO,
    end_date: histEndISO,
  });

  useEffect(() => {
    if (payErr) toast.error('Failed to fetch license payments.');
  }, [payErr]);

  useEffect(() => {
    const res: TeamLicenseHistory | undefined = payResp;

    // ⬇️ Coerce null/undefined to []
    const src = Array.isArray(res?.data) ? res!.data : [];

    const list: LicensePaymentRow[] =
      src.map((r: ApiLicenseHistoryRow) => {
        const statusRaw = (r.payment_status ?? '').toLowerCase();
        const status =
          statusRaw === 'confirmed' ||
          statusRaw === 'processed' ||
          statusRaw === 'success'
            ? 'Processed'
            : statusRaw === 'failed'
            ? 'Failed'
            : 'Processing';

        // Your API row doesn’t have license_name, so we show license_type
        // falling back to the team’s license_number.
        const name =
          (r.license_type && r.license_type.trim()) ||
          r.team?.license_number ||
          '—';

        return {
          id: r.id,
          license_name: name,
          amount_paid: fmtNGN(r.payment_amount),
          payment_date: r.payment_date
            ? dayjs(r.payment_date).format('M/D/YYYY')
            : '—',
          status,
          payment_slip: r.payment_slip ?? null,
        };
      }) ?? [];

    if (payPage === 1) setPayRows(list);
    else if (list.length) setPayRows((prev) => [...prev, ...list]);
  }, [payResp, payPage]);

  const payTotal = payResp?.metadata.total_count ?? payRows.length;
  const payHasMore = payRows.length < payTotal;

  // ----- License history (server search supported) -----
  const [histPage, setHistPage] = useState(1);
  const [histRows, setHistRows] = useState<LicenseHistoryRow[]>([]);
  const [histQuery, setHistQuery] = useState('');

  const {
    data: histResp,
    isFetching: histFetching,
    isError: histErr,
  } = useLicenseActiveInactive({
    page: histPage,
    page_size: 10,
    search: histQuery || undefined,
  });

  useEffect(() => {
    if (histErr) toast.error('Failed to fetch license history.');
  }, [histErr]);

  useEffect(() => {
    const res: LicenseHistoryList | undefined = histResp;

    // ⬇️ Coerce null/undefined to []
    const src = Array.isArray(res?.data) ? res!.data : [];

    const list: LicenseHistoryRow[] =
      src.map((r: ApiLicenseHistoryListRow) => {
        const isActive = (r.status ?? '').toLowerCase() === 'active';
        return {
          id: r.id,
          license_number: r.license_number ?? '—',
          start_date: r.start_date
            ? dayjs(r.start_date).format('M/D/YYYY')
            : '—',
          end_date: r.end_date ? dayjs(r.end_date).format('M/D/YYYY') : '—',
          amount_paid: fmtNGN(r.amount_paid),
          status: isActive ? 'Active' : 'Expired',
        };
      }) ?? [];

    if (histPage === 1) setHistRows(list);
    else if (list.length) setHistRows((prev) => [...prev, ...list]);
  }, [histResp, histPage]);

  const histTotal = histResp?.metadata.total_count ?? histRows.length;
  const histHasMore = histRows.length < histTotal;

  const debHist = useMemo(
    () =>
      debounce((q: string) => {
        setHistQuery(q);
        setHistPage(1);
        setHistRows([]);
      }, 400),
    []
  );
  useEffect(() => () => debHist.cancel(), [debHist]);

  return (
    <Box sx={{ px: 2, py: 2 }}>
      <TeamMobileBreadcrumbs
        items={[
          { label: 'TEAM DASHBOARD', to: ROUTES.TEAM },
          { label: 'LICENSING' }, // current
        ]}
      />
      {/* Sliding metric cards */}
      <MobileLicensingStatsCards
        loading={statsLoading}
        active={
          stats?.active_sub
            ? {
                type: stats.active_sub.status,
                end_date: stats.active_sub.end_date,
              }
            : null
        }
        totalLicenses={stats?.total_licenses ?? 0}
        onGetLicense={() => navigate(ROUTES.USER_LICENSE_PAYMENT)}
      />

      {/* License payment history */}
      <Box sx={{ mt: 2 }}>
        <MobileLicensePaymentHistory
          rows={payRows}
          loading={payFetching && payRows.length === 0}
          hasMore={payHasMore}
          onLoadMore={() => setPayPage((p) => p + 1)}
          // No server search for payment history (API doesn’t support it)
          onSearchChange={undefined}
          onViewSlip={(url) =>
            window.open(url, '_blank', 'noopener,noreferrer')
          }
        />
      </Box>

      {/* License history (active/inactive) */}
      <Box sx={{ mt: 1, mb: 6 }}>
        <MobileLicenseHistory
          rows={histRows}
          loading={histFetching && histRows.length === 0}
          hasMore={histHasMore}
          onLoadMore={() => setHistPage((p) => p + 1)}
          onSearchChange={(q) => debHist(q)}
        />
      </Box>
    </Box>
  );
}
