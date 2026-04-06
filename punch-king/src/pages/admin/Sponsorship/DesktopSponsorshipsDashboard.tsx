import type { Dayjs } from 'dayjs';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useSponsorships } from './hooks/useSponsorships.ts';
import { toast } from 'react-toastify';
import type { MetricCard } from '../components/CardGrid.tsx';
import type { SponsorshipRow } from './components/DesktopSponsorshipsSection.tsx';
import type { DateRange } from 'react-day-picker';
import AdminSection from '../components/AdminSection.tsx';
import DateRangeFilter from '../../../components/filters/DateRangeFilter.tsx';
import dayjs from 'dayjs';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
import { Box } from '@mui/material';
import DesktopSponsorshipsSection from './components/DesktopSponsorshipsSection.tsx';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../routes/routePath.ts';

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

function DesktopSponsorshipsDashboard() {
  const navigate = useNavigate();

  // date range (cards + table)
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;
  const start_date = useMemo(() => fmt(start), [start]);
  const end_date = useMemo(() => fmt(end), [end]);

  // server pagination + debounced search
  const [page, setPage] = useState(0); // UI 0-based
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const applySearch = useMemo(
    () => debounce((v: string) => setSearch(v), 400),
    []
  );
  useEffect(() => () => applySearch.cancel(), [applySearch]);

  // reset page when date range changes
  useEffect(() => {
    setPage(0);
  }, [start_date, end_date]);

  const { data, isLoading, isError } = useSponsorships({
    start_date,
    end_date,
    page: page + 1, // API is 1-based
    page_size: pageSize,
    search: search || undefined,
  });

  useEffect(() => {
    if (isError) toast.error('Failed to fetch sponsorships.');
  }, [isError]);

  // cards
  const cards: MetricCard[] = useMemo(() => {
    const c = data?.cards;
    return [
      {
        title: 'ALL SPONSORSHIPS',
        total: c?.total_requests ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'SPONSORSHIP VALUE',
        total: c?.total_amount ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'VOLUME',
        total: c?.total_points ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'PROCESSED SPONSORSHIP',
        total: c?.processed_requests ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'PENDING SPONSORSHIPS',
        total: c?.pending_requests ?? 0,
        deltaPct: 0,
        trendingUp: false,
      },
    ];
  }, [data]);

  const apiRows = data?.table.data ?? [];

  // rows (map API → table shape)
  const rows: SponsorshipRow[] = useMemo(() => {
    const apiRows = data?.table.data ?? [];
    return apiRows.map((r) => ({
      id: r.id,
      team_id: r.team?.id ?? 0,
      sponsor_name: r.team?.username || r.team?.team_name || '—',
      phone_number: r.team?.phone_number || '—',
      payment_confirmation_status: r.payment_status ?? '—',
      sponsorship_status: r.purchase_status ?? '—',
    }));
  }, [data]);

  const total = data?.table.metadata.total_count ?? 0;

  const dayPickerRange: DateRange | undefined = {
    from: range[0].toDate(),
    to: range[1].toDate(),
  };

  // navigate to a sponsorship details page (purchase-level)
  const handleView = (row: SponsorshipRow) => {
    const src = apiRows.find((r) => r.id === row.id);
    console.log(src);

    // Adjust to your route signature. Example assumes: /sponsorship/:purchase_id
    navigate(
      ROUTES.SPONSORSHIP_DETAILS.replace(':purchase_id', String(row.id)),
      {
        state: src
          ? {
              // keep this shape narrow and typed
              teamSnapshot: {
                team_name: src.team?.team_name ?? src.team?.username ?? null,
                email: src.team?.email ?? null,
                phone_number: src.team?.phone_number ?? null,
                address: src.team?.address ?? null,
                country: src.team?.country ?? null,
                state: src.team?.state ?? null,
              },
              sponsorId: src.team?.id ?? null,
            }
          : undefined,
      }
    );
  };

  return (
    <>
      <AdminSection
        title='SPONSORSHIPS'
        cards={isLoading ? undefined : cards}
        loading={isLoading}
        toolbar={
          <DateRangeFilter
            range={dayPickerRange}
            onChange={(r?: DateRange) => {
              if (!r?.from || !r.to) return;
              setRange([dayjs(r.from), dayjs(r.to)]);
            }}
            icon={<DateFilterIcon />}
          />
        }
      />

      <Box
        sx={{
          padding: '1.56em 6.98em',
          '@media (min-width:910px) and (max-width:1000px)': {
            padding: '1.56em 2em',
            pl: '3em',
          },
          '@media (min-width:1000px) and (max-width:1100px)': {
            paddingX: '1em',
            pl: '2rem',
          },
        }}
      >
        <DesktopSponsorshipsSection
          rows={rows}
          mode='server'
          loading={isLoading}
          totalCount={total}
          pageIndex={page}
          rowsPerPage={pageSize}
          onPageChange={setPage}
          onRowsPerPageChange={setPageSize}
          searchValue={searchInput}
          onSearchChange={(val) => {
            setSearchInput(val);
            applySearch(val);
          }}
          onView={handleView} // <-- this enables the View column
        />
      </Box>
    </>
  );
}

export default DesktopSponsorshipsDashboard;
