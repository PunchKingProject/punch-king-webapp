import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../routes/routePath';
import MobileTeamFeeds from './components/MobileTeamFeeds';
import MobileTeamRanking from './components/MobileTeamRanking';
import MobileUserStatsCards from './components/MobileUserStatsCards';
import { useUserStats } from './hooks/useUserStats';



export default function MobileDashboardPage() {

  const today = new Date();
const end = today.toISOString().slice(0,10);
const startDate = new Date(today); startDate.setDate(startDate.getDate() - 30);
const start = startDate.toISOString().slice(0,10)

  const navigate = useNavigate();
  const { data, isLoading } = useUserStats({
    start_date: start,
    end_date: end,
  }); // { sponsorship_balance, total_amount_spent, cost_of_units, distinct_teams_sponsored }

  return (
    <Box sx={{ px: 2, py: 2 }}>
      {/* Page heading */}
      <Typography sx={{ color: '#A2A2A2', fontWeight: 700, fontSize: 12 }}>
        USER DASHBOARD
      </Typography>

      {/* Stats Cards */}
      <Box sx={{ mt: 1.5 }}>
        <MobileUserStatsCards
          loading={isLoading}
          myUnits={data?.sponsorship_balance ?? 0}
          spentUnits={data?.total_amount_spent ?? 0}
          costOfUnits={data?.equivalent_amount_spent ?? 0}
          sponsoredTeams={data?.distinct_teams_sponsored ?? 0}
          ctaLabel='Buy'
          ctaVariant='button'
          onCta={() => navigate(ROUTES.USER_BUY_SPONSORS)}
          onViewSponsored={() => navigate(ROUTES.USER_MY_SPONSORSHIPS)}
        />
      </Box>

      {/* Feeds */}
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ color: '#fff', fontWeight: 900, mb: 1 }}>
          TEAMS feeds
        </Typography>
        <MobileTeamFeeds
          onSponsor={(postId) =>
            navigate(`/user/feeds/${postId}/sponsorship`, { state: { postId } })
          }
          onViewPost={(postId) => navigate(`/user/feeds/${postId}`)}
        />
      </Box>

      {/* Ranking */}
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography sx={{ color: '#fff', fontWeight: 900, mb: 1 }}>
          Team Ranking
        </Typography>
        <MobileTeamRanking />
      </Box>

      {/* Footer spacer for any sticky bars */}
      <Box sx={{ height: 16 }} />
    </Box>
  );
}
