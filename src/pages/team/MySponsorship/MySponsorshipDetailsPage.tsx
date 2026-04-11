import { Box, useMediaQuery } from "@mui/material"
import DesktopMySponsorshipDetailsPage from "./DesktopMySponsorshipDetailsPage.tsx";
import MobileMySponsorshipDetailsPage from "./MobileMySponsorshipDetailsPage.tsx";

function MySponsorshipDetailsPage() {
      const isTabletUp = useMediaQuery('(min-width:910px)');
    
  return (
 <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopMySponsorshipDetailsPage/>
      </Box>
      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileMySponsorshipDetailsPage />
      </Box>
    </>
  )
}

export default MySponsorshipDetailsPage