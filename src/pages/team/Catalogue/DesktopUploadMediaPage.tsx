import { useNavigate } from 'react-router-dom';
import DashboardSection from '../../../components/dashboards/DashboardSection.tsx';
import TeamBreadcrumbs from '../../../components/breadcrumbs/TeamBreadcrumbs.tsx';
import ROUTES from '../../../routes/routePath.ts';
import { TEAM_SIDENAV_ITEMS } from '../../../utils/sidebarPresets.ts';
import {Box, Button, CircularProgress} from '@mui/material';
import UploadMediaForm from './components/UploadMediaForm.tsx';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {useEditPostState} from "./hooks/useEditPostState.ts";

const gold = '#f0c040';

function DesktopUploadMediaPage() {
  const navigate = useNavigate();
  const { isEditMode, editPost, isLoading } = useEditPostState();

  return (
    <DashboardSection
      title={
        <TeamBreadcrumbs
          rootLabel='Team Dashboard'
          rootTo={ROUTES.TEAM}
          currentLabel={`Catalogue / ${isEditMode ? 'Edit Post' : 'Upload Media'}`}
        />
      }
      sidebarItems={TEAM_SIDENAV_ITEMS}
      toolbar={
        <Button
          onClick={() => navigate(-1)}
          variant='outlined'
          startIcon={<ArrowBackIosNewIcon fontSize='small' />}
          sx={{
            color: gold,
            borderColor: gold,
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '8px',
            mb: 2,
            '&:hover': { borderColor: '#ffd465', color: '#ffd465' },
          }}
        >
          Back
        </Button>
      }
    >
      <Box>
        {isLoading ? (
          <CircularProgress sx={{ color: gold }} />
        ) : (
          <UploadMediaForm editPost={editPost} />
        )}
      </Box>
    </DashboardSection>
  );
}

export default DesktopUploadMediaPage;
