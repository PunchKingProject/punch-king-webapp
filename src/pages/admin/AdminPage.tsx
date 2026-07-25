import { useState } from 'react';
import { Button, Box } from '@mui/material';
import AdminCard from './components/AdminCard.tsx';
import Navbar from './components/Navbar.tsx';
import AdminChangePassword from './Settings/AdminChangePassword.tsx'; 

const AdminPage = () => {
  // 1. Add state to control whether the form is visible
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
    <>
      <Navbar />
      <AdminCard />
      Admin
      
      {/* 2. Container for the button and form */}
      <Box sx={{ p: 3 }}>
        <Button 
          variant="contained" 
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          sx={{ 
            bgcolor: '#EFAF00', 
            color: '#000', 
            fontWeight: 800, 
            mb: 3,
            '&:hover': { bgcolor: '#d49b00' } 
          }}
        >
          {showPasswordForm ? 'Cancel / Close' : 'Change Admin Password'}
        </Button>

        {/* 3. The form will only render if showPasswordForm is true */}
        {showPasswordForm && <AdminChangePassword />}
      </Box>
    </>
  );
};
export default AdminPage;