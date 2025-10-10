import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { jwtDecode } from 'jwt-decode';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { punchKingLogoSignIn } from '../../assets';
import FormikTextField from '../../components/form/FormikTextField';
import { useAppDispatch } from '../../hooks';
import ROUTES from '../../routes/routePath';
import { setRid } from '../../store/registration.slice';
import { showError } from '../../utils/error/toastError';
import Footer from '../landing/components/Footer';
import { loginUser } from '../sign-up/api/registration';

type Decoded = {
  email?: string;
  exp: number;
  iat?: number;
  name: string;
  role: 'admin' | 'sponsor' | 'team';
};

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const initialValues = {
    name: '',
    password: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    password: Yup.string().min(4, 'Too short').required('Required'),
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      if (res?.meta?.code !== 200 || !res?.data) return;

      const token = res.data; // JWT string
      // persist
      // if you want redux too (keeps the rest of your flow consistent)

      // decode and route
      let decoded: Decoded | null = null;
      try {
        decoded = jwtDecode<Decoded>(token);
        dispatch(setRid({ token: token, flow: decoded?.role })); // flow here isn’t used for admin routing
      } catch {
        // fallback if decode fails
      }

      if (decoded?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (decoded?.role === 'team') {
        // go to your user landing/home/dashboard
        navigate('/team', { replace: true });
      } else {
        // default to user
        navigate('/user', { replace: true });
      }
    },
    onError: showError,
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log('Login values:', values);
    mutation.mutate(values);
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
          component={RouterLink}
          to='/'
          aria-label='Go to landing page'
          sx={{
            width: '209px',
            display: 'block',
            mx: 'auto',
            mb: '-50px',
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
              display: 'block',
            }}
          />
        </Box>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => {
            console.log(formik);
            return (
              <Form
                style={{
                  width: '100%',
                  maxWidth: 400,
                  padding: '0px 40px',
                }}
              >
                <FormikTextField
                  name='name'
                  placeholder='Username'
                  type='text'
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
                  sx={
                    {
                      // border: '2px solid red',
                    }
                  }
                >
                  <Button
                    fullWidth
                    type='submit'
                    variant='contained'
                    disabled={
                      !(formik.isValid && formik.dirty) || mutation.isPending
                    }
                    sx={{
                      backgroundColor: '#FFC107',
                      color: '#000',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      width: '100%',
                      display: 'block',
                      height: '50px',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      '&:disabled': {
                        backgroundColor: '#888',
                        color: '#3B3B3B',
                      },
                    }}
                  >
                    {mutation.isPending ? (
                      <CircularProgress size={18} sx={{ color: '#000' }} />
                    ) : (
                      'Login'
                    )}
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
