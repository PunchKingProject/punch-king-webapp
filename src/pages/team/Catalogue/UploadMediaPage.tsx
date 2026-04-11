import { Box, useMediaQuery } from '@mui/material';
import DesktopUploadMediaPage from './DesktopUploadMediaPage.tsx';
import MobileUploadMediaPage from './MobileUploadMediaPage.tsx';

export default function UploadMediaPage() {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopUploadMediaPage />
      </Box>
      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileUploadMediaPage />
      </Box>
    </>
  );
}
