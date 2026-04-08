import dayjs, { Dayjs } from "dayjs";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLicenses } from "./hooks/useLicenses";
import { toast } from "react-toastify";
import type { MetricCard } from "../components/CardGrid";
import type { LicenseRow } from "./components/DesktopLicensesSection";
import ROUTES from "../../../routes/routePath";
import type { DateRange } from "react-day-picker";
import AdminSection from "../components/AdminSection";
import DateRangeFilter from "../../../components/filters/DateRangeFilter";
import { Box } from "@mui/material";
import DesktopLicensesSection from "./components/DesktopLicensesSection";
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');


export default function DesktopLicensingDashboard() {
  const navigate = useNavigate();

  // ---- date range (cards + table) ----
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;
  const start_date = useMemo(() => fmt(start), [start]);
  const end_date = useMemo(() => fmt(end), [end]);

  // ---- table server pagination/search ----
  const [page, setPage] = useState(0); // 0-based UI
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState(''); // debounced param
  const [searchInput, setSearchInput] = useState(''); // immediate input
  const applySearch = useMemo(
    () => debounce((v: string) => setSearch(v), 400),
    []
  );
  useEffect(() => () => applySearch.cancel(), [applySearch]);

  // reset to first page when range changes
  useEffect(() => {
    setPage(0);
  }, [start_date, end_date]);

  const { data, isLoading, isError } = useLicenses({
    start_date,
    end_date,
    page: page + 1, // API 1-based
    page_size: pageSize,
    search: search || undefined,
  });

  useEffect(() => {
    if (isError) toast.error('Failed to fetch licenses.');
  }, [isError]);

  // ---- cards (AdminSection) ----
  const cards: MetricCard[] = useMemo(() => {
    const c = data?.cards;
    return [
      {
        title: 'ALL LICENSED TEAMS',
        total: c?.teams_with_active_licenses ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'TEAMS WITHOUT LICENSE',
        total: c?.teams_without_active_licenses ?? 0,
        deltaPct: 0,
        trendingUp: false,
      },
      {
        title: 'LICENSE REQUESTS',
        total: c?.total_licenses ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'PROCESSED LICENSE',
        total: c?.active_licenses ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'LICENSE IN PROCESSING',
        total: c?.unconfirmed_non_active_licenses ?? 0,
        deltaPct: 0,
        trendingUp: false,
      },
      {
        title: 'LICENSING VALUE',
        total: c?.total_license_value ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
    ];
  }, [data]);

  // ---- rows mapping ----
  const rows: LicenseRow[] = useMemo(() => {
    const apiRows = data?.table.data ?? [];
    return apiRows.map((r) => ({
      id: r.id,
      team_id: r.team.id,
      team_name: r.team.team_name,
      phone_number: r.team.phone_number,
      payment_confirmation_status: r.payment_status ?? '—',
      licensing_status: r.license_status ?? '—',
    }));
  }, [data]);

  const total = data?.table.metadata.total_count ?? 0;

  // ---- navigate handler (optional view action) ----
  const handleView = (row: LicenseRow) => {
    // e.g., go to Teams Details for that team
    navigate(ROUTES.LICENSING_DETAILS.replace(':team_id', String(row.team_id)));
  };

  // ---- react-day-picker adapter ----
  const dayPickerRange: DateRange | undefined = {
    from: range[0].toDate(),
    to: range[1].toDate(),
  };

  return (
    <>
      <AdminSection
        title='LICENSING'
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
        cards={isLoading ? undefined : cards}
        loading={isLoading}
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
        <DesktopLicensesSection
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
          onView={handleView}
        />
      </Box>
    </>
  );
}