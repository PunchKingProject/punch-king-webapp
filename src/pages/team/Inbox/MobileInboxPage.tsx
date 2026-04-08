import { Box, Typography } from '@mui/material';

export default function MobileInboxPage() {
  return (
    <Box sx={{ p: 2 }}>
      {/* simple mobile placeholder; build out later */}
      <Typography variant='h6' sx={{ fontWeight: 800 }}>
        Inbox
      </Typography>
      <Typography sx={{ color: '#A2A2A2', mt: 1 }}>
        Your messages & notifications will appear here.
      </Typography>
    </Box>
  );
}
