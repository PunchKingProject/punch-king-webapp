import { Box, Button, Typography } from '@mui/material';
import { punchKingLogoSignIn } from '../../assets';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import FormikTextField from '../../components/form/FormikTextField';
import Footer from '../landing/components/Footer';
import CustomButton from '../../components/buttons/CustomButton';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes/routePath';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log('Login values:', values);
  };
  return (
    <Box
      sx={{
        // border: '2px solid red',
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
        //   border: '2px solid green',
          minWidth: '350px',
          width: '50vw',
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
            return (
              <Form
                style={{
                  width: '100%',
                  maxWidth: 400,
                  padding: '0px 40px',
                }}
              >
                <FormikTextField
                  name='email'
                  placeholder='Username'
                  type='email'
                  showSuccessStyle
                  sx={
                    {
                      mb: 0,
                    }
                  }
                />

                <Typography
                  sx={{
                    textAlign: 'right',
                    fontSize: '0.875rem',
                    color: '#FFC107',
                    cursor: 'pointer',
                    mb: 2,
                    fontWeight: 600,
                    mt: -1,
                  }}
                  onClick={() => navigate(ROUTES.SIGN_IN)}
                >
                  Login?
                </Typography>

                <Box
                  sx={{
                    // border: '2px solid red',
                  }}
                >
                  <Button
                    fullWidth
                    type='submit'
                    variant='contained'
                    disabled={!(formik.isValid && formik.dirty)}
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
                    Login
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>

      <Box
        sx={{
        //   border: '2px solid red',
          width: '100%',
          marginTop: 'auto',
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
};
export default ForgotPasswordPage;
