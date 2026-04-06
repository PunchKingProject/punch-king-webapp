// src/pages/user/Inbox/InboxPage.tsx
import { Box, useMediaQuery } from '@mui/material';
import DesktopInboxPage from './DesktopInboxPage.tsx';
import MobileInboxPage from './MobileInboxPage.tsx';

export default function InboxPage() {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopInboxPage />
      </Box>
      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileInboxPage />
      </Box>
    </>
  );
}
