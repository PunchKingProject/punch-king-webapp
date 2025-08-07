import { Box, useMediaQuery } from '@mui/material';

const AdminCard = () => {
  const isTabletUp = useMediaQuery('(min-width:910px)');
  return (
    <>
      <Box
        sx={{
          display: isTabletUp ? 'block' : 'none',
        }}
      >
        <AdminCardDesktop />
      </Box>
      <Box
        sx={{
          display: isTabletUp ? 'none' : 'block',
        }}
      >
        <AdminCardMobile />
      </Box>
    </>
  );
};
export default AdminCard;

const AdminCardDesktop = () => {
  return <>Admin Card Desktop</>;
};

const AdminCardMobile = () => {
  return <>Admin Card Mobile</>;
};
