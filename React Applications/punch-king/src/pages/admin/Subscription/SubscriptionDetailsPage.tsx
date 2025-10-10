import { Box, useMediaQuery } from "@mui/material";
import DesktopSubscriptionDetailsPage from "./DesktopSubscriptionDetailsPage";

const SubscriptionDetailsPage = () => {

    const isDesktop = useMediaQuery('(min-width:910px)');
  


  return (
    <>
      <Box
        sx={{
          display: isDesktop ? 'block' : 'none',
        }}
      >
        <DesktopSubscriptionDetailsPage />
      </Box>
      <Box
        sx={{
          display: isDesktop ? 'none' : 'block',
        }}
      >
        <MobileSubscriptionDetailsPage />
      </Box>
    </>
  );
}
export default SubscriptionDetailsPage


function MobileSubscriptionDetailsPage() {
  return <>Mobile Licensing Details Page</>;
}