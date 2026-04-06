import { Box, useMediaQuery } from "@mui/material";
import DesktopBuySponsorsPage from "./DesktopBuySponsorsPage.tsx";
import MobileBuySponsorsPage from "./MobileBuySponsorsPage.tsx";



export default function BuySponsorsPage() {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box sx={{ display: isTabletUp ? 'block' : 'none' }}>
        <DesktopBuySponsorsPage />
      </Box>
      <Box sx={{ display: isTabletUp ? 'none' : 'block' }}>
        <MobileBuySponsorsPage />
      </Box>
    </>
  );
}