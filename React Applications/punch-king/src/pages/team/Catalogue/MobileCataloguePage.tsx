import { Box, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import ROUTES from '../../../routes/routePath';
import { usePostStats } from './hooks/usePostStats';
import { useTeamPosts } from './hooks/useTeamPosts';
import MobileCatalogueStatsCards from './components/MobileCatalogueStatsCards';
import MobileMyCatalogueList from './components/MobileMyCatalogueList';
import TeamBreadcrumbs from '../../../components/breadcrumbs/TeamBreadcrumbs';


const gold = '#f0c040';

export default function MobileCataloguePage() {
  const navigate = useNavigate();

  // metrics
  const { data: stats, isLoading: statsLoading } = usePostStats();

  // posts
  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = useTeamPosts();

  if (postsError) toast.error('Failed to fetch team posts.');

  return (
    <Box sx={{ px: 2, py: 2 }}>
      {/* 👇 clickable breadcrumb, same API as desktop */}
      <TeamBreadcrumbs
        rootLabel='TEAM DASHBOARD'
        rootTo={ROUTES.TEAM}
        currentLabel='CATALOGUE'
      />
      {/* {/* breadcrumb-ish header */}
      {/* <Typography sx={{ color: '#A2A2A2', fontWeight: 700, fontSize: 12 }}>
        TEAM DASHBOARD / CATALOGUE
      </Typography>  */}

      {/* sliding stats cards (TOTAL POSTS / TOTAL COMMENTS / UNIQUE SPONSORS) */}
      <Box sx={{ mt: 1.5 }}>
        <MobileCatalogueStatsCards
          loading={statsLoading}
          posts={stats?.total_posts ?? 0}
          comments={stats?.total_comments ?? 0}
          uniqueSponsors={stats?.total_unique_sponsors ?? 0}
        />
      </Box>

      {/* section title + upload CTA */}
      <Box sx={{ mt: 2, display: 'grid', gap: 1 }}>
        <Typography sx={{ color: '#fff', fontWeight: 900 }}>
          My catalogue
        </Typography>

        <Button
          onClick={() => navigate(ROUTES.CATALOGUE_UPLOAD)}
          variant='contained'
          fullWidth
          sx={{
            bgcolor: gold,
            color: '#000',
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '8px',
            height: 34,
            '&:hover': { bgcolor: '#ffd465' },
          }}
        >
          upload media
        </Button>
      </Box>

      {/* list of posts */}
      <Box sx={{ mt: 2, mb: 6 }}>
        <MobileMyCatalogueList
          posts={(posts ?? []).map((p) => ({
            id: p.id,
            file_url: p.file_url,
            caption: p.caption ?? '—',
            created_at: dayjs(p.created_at).format('M/D/YYYY'),
            comments_count: p.comments_count ?? p.comments?.length ?? 0,
            comments: p.comments ?? [],
            sponsors: p.sponsors ?? 0,
          }))}
          loading={postsLoading}
          onUpdate={(postId) =>
            navigate(ROUTES.CATALOGUE_UPLOAD + `?edit=${postId}`)
          }
          onDelete={(postId) => {
            // hook up your real delete modal/call here
            toast.info(`Delete post #${postId} (wire backend call)`);
          }}
          onViewSponsors={(postId) => {
            // optional modal/page
            toast.info(`View sponsors for post #${postId}`);
          }}
        />
      </Box>

      <Box sx={{ height: 16 }} />
    </Box>
  );
}
