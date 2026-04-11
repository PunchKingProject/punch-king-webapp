import type { Dayjs } from 'dayjs';
import DashboardSection from '../../../components/dashboards/DashboardSection';
import { USER_SIDENAV_ITEMS } from '../../../utils/sidebarPresets';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import type { DateRange } from 'react-day-picker';
import { useUserStats } from './hooks/useUserStats';
import DateRangeFilter from '../../../components/filters/DateRangeFilter';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
import DesktopUserStatsCards from '../components/DesktopUserStatsCards';
import { Box } from '@mui/material';
import DesktopTeamFeeds from './components/DesktopTeamFeeds';
import DesktopTeamRanking from './components/DesktopTeamRanking';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../routes/routePath';

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');
function DesktopDashboardPage() {
  const navigate = useNavigate();
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);

  const picker: DateRange = {
    from: range[0].toDate(),
    to: range[1].toDate(),
  };
  const [start, end] = range;
  const start_date = useMemo(() => fmt(start), [start]);
  const end_date = useMemo(() => fmt(end), [end]);

  const { data, isLoading } = useUserStats({ start_date, end_date });

  const myUnits = data?.sponsorship_balance ?? 0;
  const spentUnits = data?.total_amount_spent ?? 0;
  const costOfUnits = data?.equivalent_amount_spent ?? 0;
  const sponsoredTeams = data?.distinct_teams_sponsored ?? 0;
  return (
    <>
      <DashboardSection
        title='USER DASHBOARD'
        toolbar={
          <DateRangeFilter
            range={picker}
            onChange={(r) => {
              if (!r?.from || !r.to) return;
              setRange([dayjs(r.from), dayjs(r.to)]);
            }}
            icon={<DateFilterIcon />}
            label='Filter by time frame'
          />
        }
        sidebarItems={USER_SIDENAV_ITEMS}
      >
        <DesktopUserStatsCards
          loading={isLoading}
          myUnits={myUnits}
          spentUnits={spentUnits}
          costOfUnits={costOfUnits}
          sponsoredTeams={sponsoredTeams}
          onBuy={() => {
            navigate(ROUTES.USER_BUY_SPONSORS);
          }}
          // onViewSponsored={() => {}}
        />
      </DashboardSection>
      <Box sx={{ p: '1.56em 6.98em' }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <DesktopTeamFeeds
            onViewPost={(id) => navigate(`/user/feeds/${id}`)}
            onSponsor={(id) => {
              console.log('sponsor', id);
            }}
          />
          <DesktopTeamRanking />
        </Box>
      </Box>
    </>
  );
}

export default DesktopDashboardPage;
