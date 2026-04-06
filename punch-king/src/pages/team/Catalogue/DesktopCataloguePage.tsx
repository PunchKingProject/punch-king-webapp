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


export default function DesktopCataloguePage() {
  const { data, isLoading } = usePostStats();
    const navigate = useNavigate();
  // fetch posts
  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = useTeamPosts();

  if (postsError) toast.error('Failed to fetch team posts.');

  return (
    <>
      <DashboardSection
        title={
          <TeamBreadcrumbs
            rootLabel='TEAM DASHBOARD'
            rootTo={ROUTES.TEAM}
            currentLabel='CATALOGUE'
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

      {/* My catalogue list */}
      <Box sx={contentPaddingSx}>
        <DesktopMyCatalogueList
          posts={posts ?? []}
          loading={postsLoading}
          onUpload={() => {
            // TODO: open upload modal or navigate to upload page
            navigate(ROUTES.CATALOGUE_UPLOAD);
          }}
          // onUpdate={(p) => {
          //   // TODO: open edit modal for `p`
          // }}
          // onDelete={(p) => {
          //   // TODO: confirm + delete call for `p`
          // }}
          // onViewSponsors={(p) => {
          //   // TODO: open sponsor list modal for `p`
          // }}
        />
      </Box>
    </>
  );
}
