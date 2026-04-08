import { Box, useMediaQuery } from '@mui/material';
import DesktopCataloguePage from './DesktopCataloguePage';
import MobileCataloguePage from './MobileCataloguePage';

export default function CataloguePage() {
  const isTabletUp = useMediaQuery('(min-width:910px)');

  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopCataloguePage />
      </Box>
      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileCataloguePage/>
      </Box>
    </>
  );
}
