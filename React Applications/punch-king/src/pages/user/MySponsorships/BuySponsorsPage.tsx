import { Box, useMediaQuery } from "@mui/material";
import DesktopBuySponsorsPage from "./DesktopBuySponsorsPage";
import MobileBuySponsorsPage from "./MobileBuySponsorsPage";



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