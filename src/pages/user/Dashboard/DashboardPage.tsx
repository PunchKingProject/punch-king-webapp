// src/pages/user/Dashboard/index.tsx
import { Box, useMediaQuery } from '@mui/material';
import DesktopDashboardPage from './DesktopDashboardPage.tsx';
import MobileDashboardPage from './MobileDashboardPage.tsx';
import {useSearchParams} from "react-router-dom";
import {useEffect, useRef} from "react";
import {toast} from "react-toastify";

export default function Dashboard() {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  const [searchParams, setSearchParams] = useSearchParams();
  const hasProcessedStatus = useRef(false);

  useEffect(() => {
    const status = searchParams.get('status');

    // Only process if status exists and we haven't handled it yet
    if (status && !hasProcessedStatus.current) {
      hasProcessedStatus.current = true;

      // Logic for different Flutterwave statuses
      if (status === 'successful') {
        toast.success('Sponsorship units purchased successfully!');
      } else if (status === 'cancelled') {
        toast.warn('Payment was cancelled.');
      } else if (status === 'failed') {
        toast.error('Payment failed. Please try again.');
      }

      // Cleanup: Remove the query parameters from the URL
      // Use { replace: true } so the user doesn't "go back" into a success state
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopDashboardPage />
      </Box>
      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileDashboardPage />
      </Box>
    </>
  );
}
