import { Box } from '@mui/material';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'react-toastify';

import DateFilterIcon from '../../../../assets/filterTimeFrameIcon.svg?react';
import DateRangeFilter from '../../../../components/filters/DateRangeFilter.tsx';
import AdminSection from '../../components/AdminSection.tsx';

import { useUserDashboardStats } from '../hooks/useUserDashboardStats.ts';
import { useUserDashboardTable } from '../hooks/useUserDashboardTable.ts';
import { userTableColumns } from '../ui/columns.ts';
import UsersSection from './UsersSection.tsx';
import type { UserTableRow } from '../api/users.types.ts';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../../routes/routePath.ts';
// import { useNavigate } from 'react-router-dom'; // if you’ll route to user details

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

export default function DesktopUserDashboard() {
  const navigate = useNavigate();

  // ---- date range for USERS dashboard cards + table ----
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const dayPickerRange: DateRange | undefined = {
    from: range[0].toDate(),
    to: range[1].toDate(),
  };
  const [start, end] = range;

  // ---- stats ----
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useUserDashboardStats({
    start_date: fmt(start),
    end_date: fmt(end),
  });

  useEffect(() => {
    if (statsError) toast.error('Failed to fetch users dashboard stats.');
  }, [statsError]);

  const cards = useMemo(() => {
    const s = stats;
    return [
      {
        title: 'All Users',
        total: s?.total_sponsors_created ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'Sponsoring Users',
        total: s?.total_unique_sponsors ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
      {
        title: 'Sponsorship Value',
        total: s?.total_sponsorships ?? 0,
        deltaPct: 0,
        trendingUp: true,
      },
    ];
  }, [stats]);

  // ---- server table ----
  const [page, setPage] = useState(0); // 0-based UI
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const debouncedApplySearch = useMemo(
    () => debounce((q: string) => setSearch(q), 400),
    []
  );
  useEffect(() => () => debouncedApplySearch.cancel(), [debouncedApplySearch]);

  const {
    data: tableResp,
    isLoading: tableLoading,
    isError: tableError,
  } = useUserDashboardTable({
    start_date: fmt(start),
    end_date: fmt(end),
    search,
    page: page + 1, // API is 1-based
    page_size: pageSize,
  });

  useEffect(() => {
    if (tableError) toast.error('Failed to fetch users table.');
  }, [tableError]);

  const rows: UserTableRow[] = useMemo(() => {
    const apiRows = tableResp?.data.data ?? [];
    return apiRows.map((r) => ({
      sponsor_id: r.sponsor_id,
      user_name: r.name,
      phone_number: r.phone_number,
      email: r.email,
      sponsorships: r.total_amount_given,
      sponsor_units: r.sponsorship_balance,
    }));
  }, [tableResp]);

  const handleView = (row: UserTableRow) => {
    navigate(ROUTES.USERS_DETAILS.replace(':sponsor_id', String(row.sponsor_id)));
  };

  return (
    <>
      <AdminSection
        title='USERS DASHBOARD'
        toolbar={
          <DateRangeFilter
            range={dayPickerRange}
            onChange={(r?: DateRange) => {
              if (!r?.from || !r.to) return;
              setRange([dayjs(r.from), dayjs(r.to)]);
              // page reset optional:
              setPage(0);
            }}
            icon={<DateFilterIcon />}
          />
        }
        cards={statsLoading ? undefined : cards}
        loading={statsLoading}
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
        <UsersSection
          rows={rows}
          columns={userTableColumns}
          title='USERS TABLE'
          mode='server'
          loading={tableLoading}
          totalCount={tableResp?.data.metadata.total_count ?? 0}
          pageIndex={page}
          rowsPerPage={pageSize}
          onPageChange={setPage}
          onRowsPerPageChange={setPageSize}
          searchValue={searchInput}
          onSearchChange={(val) => {
            setSearchInput(val);
            debouncedApplySearch(val);
          }}
          onView={handleView}
        />
      </Box>
    </>
  );
}
