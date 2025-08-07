import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { punchKingLogoSignIn } from '../../assets';
import CustomButton from '../../components/buttons/CustomButton';
import FormikTextField from '../../components/form/FormikTextField';
import Footer from '../landing/components/Footer';

const AdminPasswordChangePage = () => {
  const initialValues = {
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  };
  const passwordRules =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

  const validationSchema = Yup.object({
    password: Yup.string()
      .matches(
        passwordRules,
        'your password does not fulfill the password criteria'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Your passwords do not match')
      .required('Confirm your password'),
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log('Login values:', values);
  };
  return (
    <Box
      sx={{
        // border: '2px solid yellow',
        display: 'flex',
        position: 'relative',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        maxWidth: '2000px',
        margin: '0 auto',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 6,
          // border: '2px solid green',
          minWidth: '350px',
          width: '100%',
          maxWidth: '500px',
          '@media (max-width:300px)': {
            width: '100%',
            // border: '2px solid pink',
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 24,
            right: 24,
          }}
        >
          <CustomButton color='primary' variant='text'>
            Register
          </CustomButton>
        </Box>
        <Box
          sx={{
            width: '209px',
            maxWidth: '209px',
            // border: '2px solid red',
            margin: '0px auto',
            marginBottom: '-50px',
          }}
        >
          <Box
            component='img'
            src={punchKingLogoSignIn}
            alt='A Boxer with fist clenched'
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => {
            const { values, touched, errors, isValid, dirty } = formik;

            const passwordValid = touched.password && !errors.password;
            const confirmPasswordValid =
              touched.confirmPassword && !errors.confirmPassword;
            const showCheckbox = passwordValid && confirmPasswordValid;
            const showHint = !(dirty && isValid);
            return (
              <Form
                style={{
                  width: '100%',
                  maxWidth: 400,
                  padding: '0px 40px',
                }}
              >
                <FormikTextField
                  name='password'
                  placeholder='Pick a password'
                  type='password'
                  sx={{ mb: 0.7 }}
                  showSuccessStyle
                  successMessage='Good password'
                />
                <FormikTextField
                  name='confirmPassword'
                  placeholder='Confirm password'
                  type='password'
                  showSuccessStyle
                  sx={{
                    mb: -0.5,
                    // border: '2px solid red',
                    padding: 0,
                  }}
                />

                {showHint && (
                  <Typography variant='body2' sx={{ mb: 2 }}>
                    Password must be at least 7 characters, must have letters, a
                    special character and digits
                  </Typography>
                )}

                {showCheckbox && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.agreedToTerms}
                        onChange={formik.handleChange}
                        name='agreedToTerms'
                      />
                    }
                    label={
                      <Typography
                        variant='body2'
                        sx={{
                          my: 1,
                        }}
                      >
                        By checking this box you agree to the{' '}
                        <Link href='#' color='#FFC107'>
                          terms of use
                        </Link>{' '}
                        of this platform
                      </Typography>
                    }
                  />
                )}

                <Box
                  sx={{
                    // border: '2px solid red',
                  }}
                >
                  <Button
                    fullWidth
                    type='submit'
                    variant='contained'
                    disabled={
                      !(formik.isValid && formik.dirty && values.agreedToTerms)
                    }
                    sx={{
                      backgroundColor: '#FFC107',
                      color: '#000',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      width: '90%',
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      '&:disabled': {
                        backgroundColor: '#888',
                        color: '#3B3B3B',
                      },
                    }}
                  >
                    Continue
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>

      <Box
        sx={{
          border: '2px solid red',
          width: '100%',
          marginTop: 'auto',
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
};
export default AdminPasswordChangePage;
