import { Box, Button, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useMemo } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
  Link as RouterLink,
} from 'react-router-dom';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import ROUTES from '../../../routes/routePath';
import MobileSponsorshipForm from './components/MobileSponsorshipForm';
import { useUserStats } from './hooks/useUserStats';
import MobileSponsorshipTwoCards from './MobileSponsorshipTwoCards';

type NavState = {
  postId?: number;
  teamName?: string;
  teamPosition?: string;
  mediaUrl?: string | null;
  sponsors?: number;
  contributors?: number;
};

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

export default function MobileSponsorshipPage() {
  const { postId } = useParams();
  const id = useMemo(() => Number(postId), [postId]);
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: NavState };

  const resolvedPostId = state?.postId ?? id;

  // Last 30 days like our other mobile pages
  const end = dayjs();
  const start = dayjs().subtract(30, 'day');
  const start_date = fmt(start);
  const end_date = fmt(end);

  const { data, isLoading } = useUserStats({ start_date, end_date });

  return (
    <Box sx={{ px: 2, py: 2 }}>
      {/* Header / breadcrumbs style + back */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography
          sx={{ color: '#A2A2A2', fontWeight: 700, fontSize: 12 }}
          component={RouterLink}
          to={'/user/'}
        >
          USER DASHBOARD
        </Typography>
        <Typography sx={{ color: '#A2A2A2' }}>/</Typography>
        <Typography sx={{ color: '#FFFCF4', fontWeight: 700, fontSize: 12 }}>
          SPONSORSHIP
        </Typography>

        <Button
          onClick={() => navigate(-1)}
          variant='outlined'
          size='small'
          sx={{
            ml: 'auto',
            borderColor: '#EFAF00',
            color: '#EFAF00',
            textTransform: 'none',
            height: 28,
            borderRadius: '8px',
          }}
          startIcon={<ArrowBackIosNewIcon fontSize='small' />}
        >
          Back
        </Button>
      </Box>

      {/* Two metric cards (same visual style, trimmed to two KPIs) */}
      <MobileSponsorshipTwoCards
        loading={isLoading}
        myUnits={data?.sponsorship_balance ?? 0}
        spentUnits={data?.total_amount_spent ?? 0}
        onBuy={() => navigate(ROUTES.USER_BUY_SPONSORS)}
        sx={{ mt: 1.5 }}
      />

      {/* Sponsorship form */}
      <Box sx={{ mt: 3 }}>
        <MobileSponsorshipForm
          postId={resolvedPostId}
          teamName={state?.teamName ?? '—'}
          teamPosition={state?.teamPosition}
          mediaUrl={state?.mediaUrl}
          sponsors={state?.sponsors}
          contributors={state?.contributors}
          onBuy={() => navigate(ROUTES.USER_BUY_SPONSORS)}
        />
      </Box>
    </Box>
  );
}
