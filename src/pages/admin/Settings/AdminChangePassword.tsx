import { Box, Button, TextField, Typography, CircularProgress, Modal } from '@mui/material';
import { Form, Formik } from 'formik';

// FIXED: Added one more '../' to reach the 'src' root folder
import { showError } from '../../../utils/error/toastError.ts'; 
import { customFetch } from '../../../Axios.ts';

const gold = '#EFAF00';

type FormValues = {
  currentPassword: '';
  newPassword: '';
  confirmPassword: '';
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AdminChangePasswordModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="change-password-title">
      <Box 
        sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '100%',
          maxWidth: 600, 
          bgcolor: '#1A1A1A', 
          p: 4, 
          borderRadius: 2, 
          border: '1px solid #333',
          boxShadow: 24,
          outline: 'none'
        }}
      >
        <Typography id="change-password-title" variant='h6' sx={{ color: gold, fontWeight: 900, mb: 3, textTransform: 'uppercase' }}>
          Change Administrator Password
        </Typography>

        <Formik<FormValues>
          initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
          validate={(vals) => {
            const errs: Partial<Record<keyof FormValues, string>> = {};
            if (!vals.currentPassword) errs.currentPassword = 'Current password is required';
            if (!vals.newPassword) errs.newPassword = 'New password is required';
            if (vals.newPassword && vals.newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters';
            if (vals.newPassword !== vals.confirmPassword) {
              errs.confirmPassword = 'Passwords must match';
            }
            return errs;
          }}
          onSubmit={async (vals, { resetForm }) => {
            try {
              await customFetch.put('/user/admin/change-password', {
                current_password: vals.currentPassword,
                new_password: vals.newPassword,
                confirm_password: vals.confirmPassword
              });
              // ✅ WITH THIS:
               alert('Password updated successfully!');
              resetForm();
              onClose(); // Automatically close the modal on success
            } catch (err) {
              showError(err);
            }
          }}
        >
          {({ values, handleChange, handleBlur, touched, errors, isSubmitting, handleSubmit }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                
                <TextField
                  type='password'
                  fullWidth
                  name='currentPassword'
                  label='Current Password'
                  value={values.currentPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.currentPassword && errors.currentPassword)}
                  helperText={touched.currentPassword && errors.currentPassword}
                  sx={{ '& .MuiInputBase-root': { bgcolor: '#101010', color: '#eee' } }}
                />

                <TextField
                  type='password'
                  fullWidth
                  name='newPassword'
                  label='New Password'
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.newPassword && errors.newPassword)}
                  helperText={touched.newPassword && errors.newPassword}
                  sx={{ '& .MuiInputBase-root': { bgcolor: '#101010', color: '#eee' } }}
                />

                <TextField
                  type='password'
                  fullWidth
                  name='confirmPassword'
                  label='Confirm New Password'
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  sx={{ '& .MuiInputBase-root': { bgcolor: '#101010', color: '#eee' } }}
                />

                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Button
                    onClick={onClose}
                    variant='outlined'
                    sx={{
                      flex: 1,
                      color: '#eee',
                      borderColor: '#555',
                      fontWeight: 800,
                      height: 50,
                      borderRadius: '10px',
                      '&:hover': { borderColor: '#888', bgcolor: '#222' }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    disabled={isSubmitting || !values.currentPassword || !values.newPassword || !values.confirmPassword}
                    sx={{
                      flex: 1,
                      bgcolor: gold,
                      color: '#000',
                      fontWeight: 800,
                      height: 50,
                      borderRadius: '10px',
                      '&:hover': { bgcolor: '#d49b00' },
                      '&.Mui-disabled': { bgcolor: '#555', color: '#888' }
                    }}
                  >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Update'}
                  </Button>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}