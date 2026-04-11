// src/pages/user/FeedView/FeedViewPage.tsx
import { Box, useMediaQuery } from '@mui/material';
import DesktopFeedViewPage from './DesktopFeedViewPage.tsx';
import MobileFeedViewPage from './MobileFeedViewPage.tsx';


export default function FeedViewPage() {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box
        sx={{
          display: isTabletUp ? 'block' : 'none' /* TODO: add mobile later */,
        }}
      >
        <DesktopFeedViewPage />
      </Box>
      <Box
        sx={{
          display: isTabletUp ? 'none' : 'block' /* TODO: add mobile later */,
        }}
      >
        <MobileFeedViewPage />
      </Box>
    </>
  );
}