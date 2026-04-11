import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {Box, Button, CircularProgress, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TeamMobileBreadcrumbs from '../../../components/breadcrumbs/TeamMobileBreadcrumbs.tsx';
import ROUTES from '../../../routes/routePath.ts';
import UploadMediaForm from './components/UploadMediaForm.tsx';
import {useEditPostState} from "./hooks/useEditPostState.ts";

const gold = '#f0c040';

export default function MobileUploadMediaPage() {
  const navigate = useNavigate();
  const { isEditMode, editPost, isLoading } = useEditPostState();

  return (
    <Box sx={{ px: 2, py: 2 }}>
      <Button
        onClick={() => navigate(-1)}
        size='small'
        startIcon={<ArrowBackIosNewIcon fontSize='small' />}
        sx={{
          color: gold,
          textTransform: 'none',
          fontWeight: 700,
          px: 0,
          '&:hover': { background: 'transparent' },
          mb: 1,
        }}
      >
        Back
      </Button>

      <TeamMobileBreadcrumbs
        items={[
          { label: 'Team Dashboard', to: ROUTES.TEAM },
          { label: 'Catalogue', to: ROUTES.CATALOGUE },
          { label: isEditMode ? 'Edit Post' : 'Upload Media' },
        ]}
      />

      <Typography sx={{ mt: 3, color: '#FFF', fontWeight: 800, fontSize: 16 }}>
        {isEditMode ? 'Edit post' : 'Upload post'}
      </Typography>

      <Box sx={{ mt: 2 }}>
        {isLoading ? (
          <CircularProgress sx={{ color: gold }} />
        ) : (
          <UploadMediaForm editPost={editPost} />
        )}
      </Box>
    </Box>
  );
}


// export default function MobileUploadMediaPage() {
//   const navigate = useNavigate();
//   const gold = '#EFAF00';
//
//   return (
//     <Box sx={{ px: 2, py: 2 }}>
//       {/* Back link */}
//       <Button
//         onClick={() => navigate(-1)}
//         size='small'
//         startIcon={<ArrowBackIosNewIcon fontSize='small' />}
//         sx={{
//           color: gold,
//           textTransform: 'none',
//           fontWeight: 700,
//           px: 0,
//           '&:hover': { background: 'transparent' },
//           mb: 1,
//         }}
//       >
//         Back
//       </Button>
//
//       {/* (Optional) user name line in your header area is handled by the layout/toolbars */}
//
//       {/* Breadcrumbs */}
//       <TeamMobileBreadcrumbs
//         items={[
//           { label: 'TEAM DASHBOARD', to: ROUTES.TEAM },
//           { label: 'CATALOGUE', to: ROUTES.CATALOGUE },
//           { label: 'UPLOAD  MEDIA' }, // current page
//         ]}
//       />
//
//       {/* Page title */}
//       <Typography
//         sx={{
//           mt: 3,
//           color: '#FFF',
//           fontWeight: 800,
//           fontSize: 16,
//         }}
//       >
//         Upload post
//       </Typography>
//
//       {/* Form */}
//       <Box sx={{ mt: 2 }}>
//         <UploadMediaForm />
//       </Box>
//     </Box>
//   );
// }
