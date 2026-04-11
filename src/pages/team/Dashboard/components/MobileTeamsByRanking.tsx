import {
    Box,
    Skeleton,
    Stack,
    Typography
} from '@mui/material';
import { rankingSmallbox1, rankingSmallbox2, rankingSmallbox3 } from '../../../../assets';

const gold = '#EFAF00';

type Row = {
  team_id: number;
  team_name: string;
  lc?: string;
  sponsors: number;
  position: string;
  contributors: number;
};
type Props = {
  rows: Row[];
  loading?: boolean;
  onView?: (teamId: number) => void;
};

export default function MobileTeamsByRanking({ rows, loading}: Props) {


  if (loading) {
    return (
      <Stack spacing={1.25}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Box
            key={`sk-${i}`}
            sx={{
              background: '#1A1A1A',
              border: '1px solid #3B3B3B',
              boxShadow: '2px 2px 10px 2px #2B2B2BB0',
              borderRadius: '12px',
              p: 1.5,
            }}
          >
            <Skeleton variant='text' width='60%' sx={{ bgcolor: '#2a2a2a' }} />
            <Skeleton variant='text' width='40%' sx={{ bgcolor: '#2a2a2a' }} />
            <Skeleton
              variant='rectangular'
              height={28}
              sx={{ bgcolor: '#2a2a2a', borderRadius: 1, mt: 1 }}
            />
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <Stack spacing={1.25}>
      {rows.map((t) => (
        <Box
          key={t.team_id}
          sx={{
            background: '#1A1A1A',
            border: '1px solid #3B3B3B',
            boxShadow: '2px 2px 10px 2px #2B2B2BB0',
            borderRadius: '12px',
            p: 1.5,
          }}
        >
          <Typography sx={{ color: '#EFAF00', fontWeight: 700, fontSize: 12 }}>
            Team name:{' '}
            <span style={{ color: '#FFF', fontWeight: 700 }}>
              {t.team_name}
            </span>
          </Typography>
          <Typography
            sx={{ color: gold, fontWeight: 700, fontSize: 12, mt: 0.25 }}
          >
            LC No:
            <span style={{ color: '#FFF' }}>{t.lc || '—'}</span>
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
            <Metric
              label='Sponsors'
              value={t.contributors}
              image={rankingSmallbox1}
            />
            <Metric
              label='Position'
              value={t.position.toUpperCase()}
              image={rankingSmallbox2}
            />
            <Metric
              label='Contributors'
              value={t.sponsors ?? 0}
              image={rankingSmallbox3}
            />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}


function Metric({ label, value, image }: { label: string; value: string | number, image:string }) {
  return (
    <Box
      sx={{
        // border: '2px solid red',
        display: 'grid',
        gridTemplateRows: '24px auto',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 24,
          borderRadius: 1,
          bgcolor: '#f0c040',
          mb: 1,
        }}
        src={image}
        component={'img'}
      />
      <Typography sx={{ fontWeight: 900, fontSize: 18, lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 12, color: '#A2A2A2', mt: 0.5 }}>
        {label}
      </Typography>
    </Box>
  );
}