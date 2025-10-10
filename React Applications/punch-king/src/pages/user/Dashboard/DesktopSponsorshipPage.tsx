// src/pages/user/Sponsorship/desktop/DesktopSponsorshipPage.tsx
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useMemo, useState } from 'react';
import {
  useParams,
  useNavigate,
  Link as RouterLink,
  useLocation,
} from 'react-router-dom';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { DateRange } from 'react-day-picker';

import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
import { useUserStats } from './hooks/useUserStats';
import DashboardSection from '../../../components/dashboards/DashboardSection';
import DateRangeFilter from '../../../components/filters/DateRangeFilter';
import DesktopSponsorshipStatsCards from './components/DesktopSponsorshipStatsCards';
import DesktopSponsorshipForm from './components/DesktopSponsorshipForm';
import ROUTES from '../../../routes/routePath';

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

type NavState = {
  postId?: number;
  teamName?: string;
  teamPosition?: string;
  mediaUrl?: string | null;
  sponsors?: number;
  contributors?: number;
};

export default function DesktopSponsorshipPage() {
  const { postId } = useParams();
  const id = useMemo(() => Number(postId), [postId]);
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: NavState };

  const resolvedPostId = state?.postId ?? id;
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

  return (
    <>
      <DashboardSection
        noSidebar
        contentSx={{
          // ← page padding (like the design)
          px: { xs: '1.56em', md: '6.98em' },
          pb: 3,
        }}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Breadcrumbs (USER DASHBOARD / FEEDS / SPONSORSHIP) */}
            <Typography
              sx={{
                color: '#A2A2A2',
                fontWeight: 600,
                fontSize: 16,
                position: 'relative',
                zIndex: 20,
              }}
              component={RouterLink}
              to={'/user/'}
            >
              USER DASHBOARD
            </Typography>
            <Typography sx={{ color: '#A2A2A2' }}>/</Typography>
            <Typography
              sx={{
                color: '#A2A2A2',
                fontWeight: 600,
                fontSize: 16,
                position: 'relative',
                zIndex: 20,
              }}
              component={RouterLink}
              to={`/user/feeds/${id}`} // Link back to the feed view page
            >
              FEEDS
            </Typography>
            <Typography sx={{ color: '#A2A2A2' }}>/</Typography>
            <Typography
              sx={{ color: '#FFFCF4', fontWeight: 700, fontSize: 16 }}
            >
              SPONSORSHIP
            </Typography>
          </Box>
        }
        toolbar={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DateRangeFilter
              range={picker}
              onChange={(r) => {
                if (!r?.from || !r.to) return;
                setRange([dayjs(r.from), dayjs(r.to)]);
              }}
              icon={<DateFilterIcon />}
              label='Filter by time frame'
            />

            <Button
              variant='outlined'
              onClick={() => navigate(-1)}
              size='small'
              sx={{
                borderColor: '#EFAF00',
                color: '#EFAF00',
                textTransform: 'none',
                ml: 1,
              }}
              startIcon={<ArrowBackIosNewIcon fontSize='small' />}
            >
              Back
            </Button>
          </Box>
        }
      >
        <DesktopSponsorshipStatsCards
          loading={isLoading}
          myUnits={myUnits}
          spentUnits={spentUnits}
          onBuy={() => {
            // TODO: open buy flow
            // postId is available as `id` if you need context
                    navigate(ROUTES.USER_BUY_SPONSORS);
          }}
        />
      </DashboardSection>

      {/* Body padding to match the rest of user pages */}
      <Box sx={{ p: '1.56em 6.98em' }}>
        {/* Sponsorship form (ignore sponsorship history and cost per your note) */}
        <Box sx={{ mt: 3 }}>
          <DesktopSponsorshipForm
            postId={resolvedPostId}
            teamName={state?.teamName ?? '—'}
            teamPosition={state?.teamPosition}
            mediaUrl={state?.mediaUrl}
            sponsors={state?.sponsors}
            contributors={state?.contributors}
          />
        </Box>
      </Box>
    </>
  );
}
