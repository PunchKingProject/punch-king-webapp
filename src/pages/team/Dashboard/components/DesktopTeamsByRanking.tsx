 import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { rankingSmallbox1, rankingSmallbox2, rankingSmallbox3 } from '../../../../assets';

export type RankedTeamCard = {
  team_id: number;
  team_name: string;
  license_number: string;
  sponsors: number;
  position: string; // "1st", "2nd", ...
  contributors?: number; // optional, defaults to 0 if not provided
};

type Props = {
  title?: string;
  rows: RankedTeamCard[];
  loading?: boolean;
  totalCount?: number;
  pageIndex: number; // 0-based
  rowsPerPage: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (s: number) => void;
  searchValue?: string;
  onSearchChange?: (q: string) => void;
};

export default function DesktopTeamsByRanking({
  title = 'TEAMS BY RANKING',
  rows,
  loading,
  // totalCount, pagination handlers left in case you add pager later
  searchValue,
  onSearchChange,
}: Props) {
  return (
    <Box sx={{ mt: 6 }}>
      {/* header + search */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography component='h5' variant='h5' sx={{ fontWeight: 900 }}>
          {title}
        </Typography>

        <TextField
          value={searchValue ?? ''}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder='Search'
          size='small'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <SearchIcon fontSize='small' sx={{ color: '#EDEDED' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 300,
            input: { color: '#fff' },
            '& .MuiOutlinedInput-root': { borderRadius: '8px' },

            gap: 1,
            border: '1px solid #3B3B3B',
            borderRadius: 2,

            bgcolor: '#1a1a1a',
          }}
        />
      </Box>

      {/* cards grid */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.12)',
                  bgcolor: 'rgba(255,255,255,0.03)',
                }}
              >
                <Skeleton height={24} width='80%' />
                <Skeleton height={18} width='50%' />
                <Skeleton variant='rectangular' height={60} sx={{ mt: 2 }} />
              </Box>
            ))
          : rows.map((r) => (
              <Box
                key={r.team_id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.12)',
                  bgcolor: 'rgba(255,255,255,0.03)',
                  // border: '2px solid green'
                }}
              >
                <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                  Team name:{' '}
                  <Typography component='span' sx={{ fontWeight: 600 }}>
                    {r.team_name}
                  </Typography>
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 14, mt: 0.5 }}>
                  LC No:{' '}
                  <Typography component='span' sx={{ fontWeight: 600 }}>
                    {r.license_number || '—'}
                  </Typography>
                </Typography>

                <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
                  <Metric label='Sponsors' value={r.sponsors}  image={rankingSmallbox1} />
                  <Metric label='Position' value={r.position.toUpperCase()} image={rankingSmallbox2}  />
                  <Metric label='Contributors' value={r.contributors ?? 0} image={rankingSmallbox3}/>
                </Box>
              </Box>
            ))}
      </Box>
    </Box>
  );
}

function Metric({ label, value, image }: { label: string; value: string | number, image: string }) {
  return (
    <Box
      sx={{
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
