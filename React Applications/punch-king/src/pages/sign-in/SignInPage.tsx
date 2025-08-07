import { Box, Button, Typography } from '@mui/material';
import { punchKingLogoSignIn } from '../../assets';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import FormikTextField from '../../components/form/FormikTextField';
import Footer from '../landing/components/Footer';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes/routePath';

const SignInPage = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too short').required('Required'),
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
        }}
      >
        <Box
          sx={{
            width: '209px',
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
                />
                <FormikTextField
                  name='password'
                  placeholder='Password'
                  type='password'
                  sx={{
                    mb: -1,
                  }}
                />

                <Typography
                  sx={{
                    textAlign: 'right',
                    fontSize: '0.875rem',
                    color: '#FFC107',
                    cursor: 'pointer',
                    mb: 3,
                    fontWeight: 600,
                  }}
                  onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                >
                  forgot password?
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
          // border: '2px solid red',
          width: '100%',
          marginTop: 'auto',
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
};
export default SignInPage;
