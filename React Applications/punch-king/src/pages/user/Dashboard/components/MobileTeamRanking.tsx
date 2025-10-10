import Diversity3Icon from '@mui/icons-material/Diversity3';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Chip,
    IconButton,
    InputBase,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useRankedTeams } from '../hooks/useRankedTeams';

const gold = '#EFAF00';

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`.toUpperCase();
}

export default function MobileTeamRanking() {
  const [page] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchUI, setSearchUI] = useState('');
  const apply = useMemo(() => debounce((v: string) => setSearch(v), 300), []);
  useEffect(() => () => apply.cancel(), [apply]);

  const { data, isLoading } = useRankedTeams({
    page,
    page_size: pageSize,
    search: search || undefined,
  });
  const rows = data?.data ?? [];

  return (
    <Box>
      {/* Search */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          border: '1px solid #3B3B3B',
          borderRadius: 2,
          px: 1.25,
          py: 0.5,
          bgcolor: '#1a1a1a',
          mb: 1.5,
        }}
      >
        <InputBase
          placeholder="Search"
          value={searchUI}
          onChange={(e) => {
            setSearchUI(e.target.value);
            apply(e.target.value);
          }}
          sx={{ color: '#EDEDED', flex: 1, fontSize: 14 }}
        />
        <IconButton size="small">
          <SearchIcon fontSize="small" sx={{ color: '#EDEDED' }} />
        </IconButton>
      </Box>

      {/* List */}
      <Stack spacing={1.25}>
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
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
              <Skeleton variant="text" animation="wave" width="70%" sx={{ bgcolor: '#2a2a2a' }} />
              <Skeleton variant="text" animation="wave" width="40%" sx={{ bgcolor: '#2a2a2a' }} />
              <Skeleton variant="rectangular" animation="wave" height={32} sx={{ bgcolor: '#2a2a2a', mt: 1, borderRadius: 1 }} />
            </Box>
          ))}

        {!isLoading &&
          rows.map((t) => (
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
              <Typography sx={{ color: '#C9C9C9', fontWeight: 700, fontSize: 12 }}>
                Team name:{' '}
                <span style={{ color: '#FFF', fontWeight: 700 }}>{t.team_name}</span>
              </Typography>
              <Typography sx={{ color: '#C9C9C9', fontWeight: 700, fontSize: 12, mt: 0.25 }}>
                LC No:{' '}
                <span style={{ color: '#FFF' }}>{t.license_number || '—'}</span>
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <Chip
                  icon={<GroupsIcon sx={{ color: gold }} />}
                  label={
                    <span style={{ display: 'flex', gap: 6 }}>
                      <b style={{ color: '#fff' }}>{t.sponsorships ?? 0}</b>
                      <span style={{ color: '#C9C9C9' }}>Sponsors</span>
                    </span>
                  }
                  sx={{ bgcolor: 'transparent', border: '1px solid #3B3B3B', color: '#fff' }}
                />
                <Chip
                  icon={<EmojiEventsIcon sx={{ color: gold }} />}
                  label={
                    <span>
                      <b style={{ color: '#fff' }}>{ordinal(t.rank)}</b>{' '}
                      <span style={{ color: '#C9C9C9' }}>Position</span>
                    </span>
                  }
                  sx={{ bgcolor: 'transparent', border: '1px solid #3B3B3B', color: '#fff' }}
                />
                <Chip
                  icon={<Diversity3Icon sx={{ color: gold }} />}
                  label={
                    <span style={{ display: 'flex', gap: 6 }}>
                      <b style={{ color: '#fff' }}>{t.contributors ?? 0}</b>
                      <span style={{ color: '#C9C9C9' }}>Contributors</span>
                    </span>
                  }
                  sx={{ bgcolor: 'transparent', border: '1px solid #3B3B3B', color: '#fff' }}
                />
              </Stack>
            </Box>
          ))}
      </Stack>
    </Box>
  );
}
