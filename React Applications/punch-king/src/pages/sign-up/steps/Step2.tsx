import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Typography
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import { punchKingLogoSignIn } from '../../../assets';
import CustomAuthButton from '../../../components/buttons/CustomAuthButton';
import FormikTextField from '../../../components/form/FormikTextField';
import NoticeModal from '../../../components/modal/NoticeModal';
import { useAppDispatch } from '../../../hooks';
import { mergeDraft, setRid } from '../../../store/registration.slice';
import { createUser } from '../api/registration';

// --- Validation: >=7 chars, includes letter, digit, special ---
const passwordRules =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

const validationSchema = Yup.object({
  password: Yup.string()
    .matches(
      passwordRules,
      'Password must be at least 7 characters and include letters, a number and a special character.'
    )
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Required'),
  agree: Yup.boolean().test(
    'agree-if-match',
    'Please accept the Terms to continue.',
    function (value) {
      const { password, confirmPassword } = this.parent as {
        password?: string;
        confirmPassword?: string;
      };
      const matches =
        !!password && !!confirmPassword && password === confirmPassword;
      // Only require the checkbox if the passwords match
      return !matches || value === true;
    }
  ),
});

type Values = { password: string; confirmPassword: string; agree: boolean };

function Step2() {
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [sp] = useSearchParams();
  const token = sp.get('token') || '';
  const flow = sp.get('flow') as 'sponsor' | 'team';

  const params = new URLSearchParams();
  if (token) params.set('token', token);
  params.set('flow', flow);

  const initialValues: Values = {
    password: '',
    confirmPassword: '',
    agree: false,
  };

  const handleSubmit = async (values: Values) => {
    // TODO: call your API to set password, e.g.:
    // await api.post('/auth/register/set-password', { password: values.password });
    dispatch(mergeDraft({ step2: { passwordSet: true } }));

    // call backend to create user and queue verification email
    mutation.mutate({
      token: token || '',
      password: values.password,
    });
  };

  const handleContinueFromModal = () => {
    // Try to open their inbox

    // Optional: also navigate to step2 right away OR leave them on step1
    // If your flow requires email verification link to continue, don't navigate.
    // If you want to let them proceed and guard with SignupGuard on reload, do:
    // navigate(`/sign-up/step2?${params.toString()}`);
    dispatch(mergeDraft({ step2: { passwordSet: true } }));
    navigate(`/sign-up/step3?${params.toString()}`);
  };

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        console.log('Verification email sent successfully');
        dispatch(setRid({ token: res.data, flow })); // persist rid in redux + storage
        setModalOpen(true);
      }
    },
    // optional: show a toast / set form error on failure
  });
  return (
    <>
      {/* Modal */}
      <NoticeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onContinue={handleContinueFromModal}
        title='NOTICE!!!'
        message=' You have successfully created your password you will be logged in for your next steps'
        continueLabel='Continue'
      />

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 6,
          mt: '-30px',
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
            const passwordsMatch =
              !!formik.values.password &&
              formik.values.confirmPassword &&
              formik.values.password === formik.values.confirmPassword;

            // const passwordValid =
            //   formik.touched.password &&
            //   !formik.errors.password &&
            //   !!formik.values.password;
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
                  showSuccessStyle
                  type='password'
                  sx={{
                    mb: -1,
                  }}
                />

                <FormikTextField
                  name='confirmPassword'
                  placeholder='Confirm password'
                  type='password'
                  showSuccessStyle
                />
                <Box
                  sx={{
                    // border: '2px solid red',
                    width: '110%',
                    // pull 5% on each side so it stays centered visually
                    ml: '-5%',
                    mr: '-5%',
                  }}
                >
                  {passwordsMatch && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formik.values.agree}
                          onChange={(e) =>
                            formik.setFieldValue('agree', e.target.checked)
                          }
                          sx={{
                            color: '#FFC107',
                            '&.Mui-checked': {
                              color: '#FFC107',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography variant='caption' sx={{ color: '#C9C9C9' }}>
                          By checking this box I accept the{' '}
                          <span
                            style={{
                              color: '#EFAF00',
                            }}
                          >
                            {' '}
                            terms of use
                          </span>{' '}
                          of this platform
                        </Typography>
                      }
                      sx={{ mt: 1, mb: 2 }}
                    />
                  )}
                </Box>

                <Box
                  sx={
                    {
                      // border: '2px solid red',
                    }
                  }
                >
                  <CustomAuthButton
                    fullWidth
                    type='submit'
                    variant='contained'
                    disabled={
                      !(
                        formik.values.password &&
                        formik.values.confirmPassword &&
                        formik.values.password ===
                          formik.values.confirmPassword &&
                        formik.values.agree
                      ) || mutation.isPending
                    }
                  >
                    {mutation.isPending ? (
                      <CircularProgress size={18} sx={{ color: '#000' }} />
                    ) : (
                      'Continue'
                    )}
                  </CustomAuthButton>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
}

export default Step2;
