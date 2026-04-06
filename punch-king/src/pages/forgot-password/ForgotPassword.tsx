import { Box, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { punchKingLogoSignIn } from '../../assets';
import CustomAuthButton from '../../components/buttons/CustomAuthButton.tsx';
import CustomButton from '../../components/buttons/CustomButton.tsx';
import FormikTextField from '../../components/form/FormikTextField.tsx';
import ROUTES from '../../routes/routePath.ts';
import Footer from '../landing/components/Footer.tsx';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from './api/forgotpassword.api.ts';
import { toast } from 'react-toastify';
import { showError } from '../../utils/error/toastError.ts';

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
    mutation.mutate({
      email: values.email
    })
  };

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        toast.success('Email successfully sent please check');
      }
    },
    onError: showError
  });
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
          // border: '2px solid green',
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
          <CustomButton color='primary' variant='text' onClick={() => navigate(ROUTES.SIGN_UP)}>
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
                  sx={{
                    mb: 0,
                  }}
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
                  Sign In?
                </Typography>

                <Box
                  sx={
                    {
                      // border: '2px solid red',
                    }
                  }
                >
                  <CustomAuthButton
                    fullWidth={false}
                    type='submit'
                    variant='contained'
                    disabled={!(formik.isValid && formik.dirty)}
                    loading={mutation.isPending}
                    loadingLabel='Sending…'
                    sx={{
                      backgroundColor: '#FFC107',

                      width: '100%',
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  >
                    Login
                  </CustomAuthButton>
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
