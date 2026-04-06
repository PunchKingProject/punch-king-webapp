import type { Dayjs } from "dayjs";
import { useSingleUserStats } from "../hooks/useSingleUserStats.ts";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import ROUTES from "../../../../routes/routePath.ts";
import AdminSection from "../../components/AdminSection.tsx";
import AdminBreadCrumbs from "../../components/AdminBreadcrumbs.tsx";
import DateRangeFilter from "../../../../components/filters/DateRangeFilter.tsx";
import dayjs from "dayjs";
import type { MetricCard } from "../../components/CardGrid.tsx";
import DateFilterIcon from '../../../../assets/filterTimeFrameIcon.svg?react';


const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

type Props = {
  sponsor_id: number;
  /** shared date range owned by the page */
  range: [Dayjs, Dayjs];
  /** lets the page update the shared range (so all children react) */
  onRangeChange: (next: [Dayjs, Dayjs]) => void;
  /** optional: name to show in breadcrumbs (if you already fetched the profile) */
  user_name?: string;
};


export default function DesktopUsersDetailsStats({
  sponsor_id,
  range,
  onRangeChange,
  user_name,
}: Props) {
     const [start, end] = range;

     const {
       data: stats,
       isLoading,
       isError,
     } = useSingleUserStats({
       sponsor_id,
       start_date: fmt(start),
       end_date: fmt(end),
     });

     useEffect(() => {
       if (isError) toast.error('Failed to fetch user details stats.');
     }, [isError]);

     const cards: MetricCard[] = useMemo(() => {
       return [
         {
           title: 'Sponsorship Balance',
           total: stats?.sponsorship_balance ?? 0,
           trendingUp: true,
           deltaPct: 0,
         },
         {
           title: 'Total Amount Spent',
           total: stats?.total_amount_spent ?? 0,
           trendingUp: false,
           deltaPct: 0,
         },
         {
           title: 'Distinct Teams Sponsored',
           total: stats?.distinct_teams_sponsored ?? 0,
           trendingUp: true,
           deltaPct: 0,
         },
       ];
     }, [stats]);




    return (
      <AdminSection
        title={
          <AdminBreadCrumbs
            rootLabel='USERS DASHBOARD'
            rootTo={ROUTES.USERS}
            currentLabel={user_name ? `USER: ${user_name}` : 'USER DETAILS'}
          />
        }
        toolbar={
          <DateRangeFilter
            range={{ from: start.toDate(), to: end.toDate() }}
            onChange={(r) => {
              if (!r?.from || !r.to) return;
              onRangeChange([dayjs(r.from), dayjs(r.to)]);
            }}
            icon={<DateFilterIcon />}
          />
        }
        cards={isLoading ? undefined : cards}
        loading={isLoading}
      />
    );
}