import { Box, useMediaQuery } from "@mui/material";
import DesktopSponsorshipsDetailsPage from "./DesktopSponsorshipsDetailsPage";
import MobileSponsorshipsDetailsPage from "./MobileSponsorshipsDetailsPage";

const SponsorshipDetailsPage = () => {

      const isDesktop = useMediaQuery('(min-width:910px)');

  return (
    <>
      <Box
        sx={{
          display: isDesktop ? 'block' : 'none',
        }}
      >
        <DesktopSponsorshipsDetailsPage />
      </Box>
      <Box
        sx={{
          display: isDesktop ? 'none' : 'block',
        }}
      >
        <MobileSponsorshipsDetailsPage />
      </Box>
    </>
  );
}
export default SponsorshipDetailsPage