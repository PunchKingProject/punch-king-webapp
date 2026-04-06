import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom"
import DesktopUsersDetailsStats from "./components/DesktopUsersDetailsStats.tsx";
import DesktopUserDetailsSection from "./components/DesktopUserDetailsSection.tsx";
import type { FetchUserPurchaseHistoryParams } from "./api/users.types.ts";
import { useUserPurchaseHistory } from "./hooks/useUserPurchaseHistory.ts";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import type { UserPurchaseRow } from "./components/DesktopUserPurchaseHistorySection.tsx";
import DesktopUserPurchaseHistorySection from "./components/DesktopUserPurchaseHistorySection.tsx";
import { userPurchaseColumns, userSponsorColumns } from "./ui/columns.ts";
import { Box } from "@mui/material";
import { useSponsorVoteHistory } from "./hooks/useSponsorVoteHistory.ts";
import type { UserSponsorRow } from "./components/DesktopUserSponsorHistorySection.tsx";
import DesktopUserSponsorHistorySection from "./components/DesktopUserSponsorHistorySection.tsx";

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

function DesktopUsersDetailsPage() {
  const p = useParams<{ sponsor_id?: string }>();
  const sponsor_id = p.sponsor_id ? Number(p.sponsor_id) : 0;

  // ---- shared date range (ALL children depend on this) ----
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;

  // These start/end strings get passed to *every* child section
  const start_date = useMemo(() => fmt(start), [start]);
  const end_date = useMemo(() => fmt(end), [end]);

  // ---------- PURCHASE HISTORY (server table like Teams/Users) ----------
  const [phPage, setPhPage] = useState(0); // 0-based UI
  const [phPageSize, setPhPageSize] = useState(10);

  const [phSearch, setPhSearch] = useState(''); // debounced param
  const [phSearchInput, setPhSearchInput] = useState(''); // immediate input
  const applyPhSearch = useMemo(
    () => debounce((val: string) => setPhSearch(val), 400),
    []
  );
  useEffect(() => () => applyPhSearch.cancel(), [applyPhSearch]);

  // Reset to first page when date range changes
  useEffect(() => {
    setPhPage(0);
  }, [start_date, end_date]);

  const params: FetchUserPurchaseHistoryParams = {
    sponsor_id,
    page: phPage + 1, // API 1-based
    page_size: phPageSize,
    start_date,
    end_date,
    search: phSearch || undefined,
  };

  const {
    data: phData,
    isLoading: phLoading,
    isError: phError,
  } = useUserPurchaseHistory(params);

  useEffect(() => {
    if (phError) toast.error('Failed to fetch purchase history.');
  }, [phError]);

  // Map API -> table rows
  const phRows: UserPurchaseRow[] = useMemo(() => {
    const list = phData?.data ?? []; // your API returns { data: [...], metadata: {...} }
    return list.map((it) => {
      // prefer payment_from as "Source", else payment_into, else '—'
      const src =
        it.payment_from?.bank_name ||
        it.payment_from?.account_name ||
        it.payment_from?.account_number ||
        it.payment_into?.bank_name ||
        it.payment_into?.account_name ||
        it.payment_into?.account_number ||
        '—';

      const d = dayjs(it.payment_date);
      return {
        id: it.id,
        value: it.payment_amount,
        volume: it.sponsorship_points,
        date: d.format('YYYY-MM-DD'),
        time: d.format('hh:mma'),
        source: src,
      };
    });
  }, [phData]);

  const phTotal = phData?.metadata?.total_count ?? 0;

  // ---------- SPONSORSHIP HISTORY (server table like others) ----------
  const [shPage, setShPage] = useState(0); // 0-based UI
  const [shPageSize, setShPageSize] = useState(10);
  const [shSearch, setShSearch] = useState('');
  const [shSearchInput, setShSearchInput] = useState('');

  const applyShSearch = useMemo(
    () => debounce((val: string) => setShSearch(val), 400),
    []
  );
  useEffect(() => () => applyShSearch.cancel(), [applyShSearch]);

  // Reset to first page when date range changes
  useEffect(() => {
    setShPage(0);
  }, [start_date, end_date]);

  const {
    data: shData,
    isLoading: shLoading,
    isError: shError,
  } = useSponsorVoteHistory({
    sponsor_id,
    page: shPage + 1, // API 1-based
    page_size: shPageSize,
    start_date,
    end_date,
    search: shSearch || undefined,
  });

  useEffect(() => {
    if (shError) toast.error('Failed to fetch sponsorship history.');
  }, [shError]);

  const shRows: UserSponsorRow[] = useMemo(() => {
    const list = shData?.data ?? [];
    return list.map((it) => {
      const d = dayjs(it.created_at);
      return {
        id: it.id,
        team_name: it.team_name,
        value: it.equivalent_amount,
        volume: it.units,
        date: d.format('YYYY-MM-DD'),
        time: d.format('hh:mma'),
      };
    });
  }, [shData]);

  const shTotal = shData?.metadata?.total_count ?? 0;


  return (
    <>
      {/* Header + cards; its date control updates `range` here */}
      <DesktopUsersDetailsStats
        sponsor_id={sponsor_id}
        range={range}
        onRangeChange={setRange}
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
        <DesktopUserDetailsSection sponsor_id={sponsor_id} />

        {/* NEW: Sponsorship Purchase History (server table) */}
        <DesktopUserPurchaseHistorySection
          columns={userPurchaseColumns}
          mode='server'
          loading={phLoading}
          rows={phRows}
          totalCount={phTotal}
          pageIndex={phPage}
          rowsPerPage={phPageSize}
          onPageChange={setPhPage}
          onRowsPerPageChange={setPhPageSize}
          searchValue={phSearchInput}
          onSearchChange={(val) => {
            setPhSearchInput(val);
            applyPhSearch(val);
          }}
        />

        <DesktopUserSponsorHistorySection
          columns={userSponsorColumns}
          mode='server'
          loading={shLoading}
          rows={shRows}
          totalCount={shTotal}
          pageIndex={shPage}
          rowsPerPage={shPageSize}
          onPageChange={setShPage}
          onRowsPerPageChange={setShPageSize}
          searchValue={shSearchInput}
          onSearchChange={(val) => {
            setShSearchInput(val);
            applyShSearch(val);
          }}
        />
      </Box>
    </>
  );
}

export default DesktopUsersDetailsPage