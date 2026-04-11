import { Box } from '@mui/material';
import DashboardSection from '../../../components/dashboards/DashboardSection.tsx';
import { TEAM_SIDENAV_ITEMS } from '../../../utils/sidebarPresets.ts';
import { usePostStats } from './hooks/usePostStats.ts';
import DesktopCatalogueStatsCards from './components/DesktopCatalogueStatsCards.tsx';
import ROUTES from '../../../routes/routePath.ts';
import TeamBreadcrumbs from '../../../components/breadcrumbs/TeamBreadcrumbs.tsx';
import { useTeamPosts } from './hooks/useTeamPosts.ts';
import { toast } from 'react-toastify';
import DesktopMyCatalogueList from './components/DesktopMyCatalogueList.tsx';
import { useNavigate } from 'react-router-dom';
import FreeTrialBanner from "./components/FreeTrialBanner.tsx";
import {useDeletePost} from "./hooks/useDeletePost.ts";
import {useState} from "react";
import ConfirmDialog from "./components/ConfirmDialog.tsx";

const contentPaddingSx = {
  padding: '1.56em 6.98em',
  '@media (min-width:910px) and (max-width:1000px)': {
    padding: '1.56em 2em',
    pl: '3em',
  },
  '@media (min-width:1000px) and (max-width:1100px)': {
    paddingX: '1em',
    pl: '2rem',
  },
};

// DesktopCataloguePage.tsx
export default function DesktopCataloguePage() {
  const navigate = useNavigate();
  const { data, isLoading } = usePostStats();
  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = useTeamPosts();

  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  // Confirm dialog state
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  if (postsError) toast.error('Failed to fetch posts.');

  return (
    <>
      <FreeTrialBanner />
      <DashboardSection
        title={
          <TeamBreadcrumbs
            rootLabel='Team Dashboard'
            rootTo={ROUTES.TEAM}
            currentLabel='Catalogue'
          />
        }
        sidebarItems={TEAM_SIDENAV_ITEMS}
      >
        <Box>
          <DesktopCatalogueStatsCards
            loading={isLoading}
            posts={data?.total_posts ?? 0}
            comments={data?.total_comments ?? 0}
            uniqueSponsors={data?.total_unique_sponsors ?? 0}
          />
        </Box>
      </DashboardSection>

      <Box sx={contentPaddingSx}>
        <DesktopMyCatalogueList
          posts={posts ?? []}
          loading={postsLoading}
          onUpload={() => navigate(ROUTES.CATALOGUE_UPLOAD)}
          onUpdate={(p) => navigate(`${ROUTES.CATALOGUE_UPLOAD}?edit=${p.id}`, {
            state: {
              id: p.id,
              title: p.title,
              caption: p.caption,
              file_url: p.file_url,
            },
          })}
          onDelete={(p) => setPendingDeleteId(p.id)}
          onViewSponsors={() => {
            // TODO: open sponsor list modal for `p`
          }}
        />
      </Box>

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
    </>
  );
}

// export default function DesktopCataloguePage() {
//   const { data, isLoading } = usePostStats();
//     const navigate = useNavigate();
//   // fetch posts
//   const {
//     data: posts,
//     isLoading: postsLoading,
//     isError: postsError,
//   } = useTeamPosts();
//
//   if (postsError) toast.error('Failed to fetch team posts.');
//
//   return (
//     <>
//       <FreeTrialBanner />
//       <DashboardSection
//         title={
//           <TeamBreadcrumbs
//             rootLabel='TEAM DASHBOARD'
//             rootTo={ROUTES.TEAM}
//             currentLabel='CATALOGUE'
//           />
//         }
//         sidebarItems={TEAM_SIDENAV_ITEMS}
//       >
//         <Box>
//           <DesktopCatalogueStatsCards
//             loading={isLoading}
//             posts={data?.total_posts ?? 0}
//             comments={data?.total_comments ?? 0}
//             uniqueSponsors={data?.total_unique_sponsors ?? 0}
//           />
//         </Box>
//       </DashboardSection>
//
//       {/* My catalogue list */}
//       <Box sx={contentPaddingSx}>
//
//         <DesktopMyCatalogueList
//           posts={posts ?? []}
//           loading={postsLoading}
//           onUpload={() => {
//             // TODO: open upload modal or navigate to upload page
//             navigate(ROUTES.CATALOGUE_UPLOAD);
//           }}
//           // onUpdate={(p) => {
//           //   // TODO: open edit modal for `p`
//           // }}
//           // onDelete={(p) => {
//           //   // TODO: confirm + delete call for `p`
//           // }}
//           // onViewSponsors={(p) => {
//           //   // TODO: open sponsor list modal for `p`
//           // }}
//         />
//       </Box>
//     </>
//   );
// }
