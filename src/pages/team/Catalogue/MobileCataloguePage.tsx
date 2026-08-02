import { Box, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import ROUTES from '../../../routes/routePath.ts';
import { usePostStats } from './hooks/usePostStats.ts';
import { useTeamPosts } from './hooks/useTeamPosts.ts';
import MobileCatalogueStatsCards from './components/MobileCatalogueStatsCards.tsx';
import MobileMyCatalogueList from './components/MobileMyCatalogueList.tsx';
import TeamBreadcrumbs from '../../../components/breadcrumbs/TeamBreadcrumbs.tsx';
import FreeTrialBanner from "./components/FreeTrialBanner.tsx";
import ConfirmDialog from "./components/ConfirmDialog.tsx";
import {useState} from "react";
import {useDeletePost} from "./hooks/useDeletePost.ts";
import PostDetailsModal from '../../admin/Teams/components/PostDetailsModal.tsx';


const gold = '#f0c040';

// MobileCataloguePage.tsx
export default function MobileCataloguePage() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = usePostStats();
  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = useTeamPosts();

  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  // Confirm dialog state
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  
  // Modal state
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  if (postsError) toast.error('Failed to fetch posts.');

  return (
    <Box sx={{ px: 2, py: 2 }}>
      <FreeTrialBanner />

      <TeamBreadcrumbs
        rootLabel='Team Dashboard'
        rootTo={ROUTES.TEAM}
        currentLabel='Catalogue'
      />

      <Box sx={{ mt: 1.5 }}>
        <MobileCatalogueStatsCards
          loading={statsLoading}
          posts={stats?.total_posts ?? 0}
          comments={stats?.total_comments ?? 0}
          uniqueSponsors={stats?.total_unique_sponsors ?? 0}
        />
      </Box>

      <Box sx={{ mt: 2, display: 'grid', gap: 1 }}>
        <Typography sx={{ color: '#fff', fontWeight: 900 }}>
          My Catalogue
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
          Upload Media
        </Button>
      </Box>

      <Box sx={{ mt: 2, mb: 6 }}>
        <MobileMyCatalogueList
          posts={(posts ?? []).map((p) => ({
            id: p.id,
            title: p.title,
            team: p.team,
            file_url: p.file_url,
            caption: p.caption ?? '—',
            created_at: dayjs(p.created_at).format('M/D/YYYY'),
            comments_count: p.comments_count ?? p.comments?.length ?? 0,
            comments: p.comments ?? [],
            sponsors: p.sponsors ?? 0,
            sponsorships: p.sponsorships ?? 0,
            originalPost: p, // Passed into mapping for the modal
          }))}
          loading={postsLoading}
          onUpdate={(p) => navigate(`${ROUTES.CATALOGUE_UPLOAD}?edit=${p.id}`, {
            state: {
              id: p.id,
              title: p.title,
              caption: p.caption,
              file_url: p.file_url,
            },
          })}
          onDelete={(postId) => setPendingDeleteId(postId)}
          onViewPost={(p) => setSelectedPost(p.originalPost)} // Re-wired view link
        />
      </Box>

      <Box sx={{ height: 16 }} />
      
      {/* Media Details Modal */}
      {selectedPost && (
        <PostDetailsModal
          post={selectedPost}
          open={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          onSuccess={() => setSelectedPost(null)}
        />
      )}

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={pendingDeleteId !== null}
        title='Delete Post'
        description='This action cannot be undone. The post and its media will be permanently removed.'
        confirmLabel='Delete Post'
        cancelLabel='Cancel'
        loading={isDeleting}
        onConfirm={() => {
          if (pendingDeleteId !== null) {
            deletePost(
              { id: pendingDeleteId },
              { onSettled: () => setPendingDeleteId(null) }
            );
          }
        }}
        onCancel={() => setPendingDeleteId(null)}
      />
    </Box>
  );
}