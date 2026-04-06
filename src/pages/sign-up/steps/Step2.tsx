import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Typography
} from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { useMutation } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import { punchKingLogoSignIn } from '../../../assets';
import CustomAuthButton from '../../../components/buttons/CustomAuthButton.tsx';
import FormikTextField from '../../../components/form/FormikTextField.tsx';
import NoticeModal from '../../../components/modal/NoticeModal.tsx';
import { useAppDispatch } from '../../../hooks.ts';
import { mergeDraft, setRid } from '../../../store/registration.slice.ts';
import { createUser } from '../api/registration.ts';
import { Link as MLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ROUTES from '../../../routes/routePath.ts';

// --- Validation (UNCHANGED)
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
      return !matches || value === true;
    }
  ),
});

type Values = { password: string; confirmPassword: string; agree: boolean };

// display-only (does NOT affect validation)
const DISPLAY_SYMBOLS = '!#$%^&*+,-./:;<=>?@^_~';

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

  const initialValues: Values = { password: '', confirmPassword: '', agree: false };

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        dispatch(setRid({ token: res.data, flow }));
        setModalOpen(true);
      }
    },
  });

  const handleSubmit = (values: Values) => {
    dispatch(mergeDraft({ step2: { passwordSet: true } }));
    mutation.mutate({ token: token || '', password: values.password });
  };

  const handleContinueFromModal = () => {
    dispatch(mergeDraft({ step2: { passwordSet: true } }));
    navigate(`/sign-up/step3?${params.toString()}`);
  };

  return (
    <>
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
        <Box sx={{ width: '209px', margin: '0 auto', mb: '-50px' }}>
          <Box
            component='img'
            src={punchKingLogoSignIn}
            alt='A Boxer with fist clenched'
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {(formik) => {
            const passwordsMatch =
              !!formik.values.password &&
              formik.values.confirmPassword &&
              formik.values.password === formik.values.confirmPassword;

            // hide rules once the current password value satisfies the regex
            const passwordPassesRules = passwordRules.test(formik.values.password);

            return (
              <Form style={{ width: '100%', maxWidth: 400, padding: '0 40px' }}>
                <FormikTextField
                  name='password'
                  placeholder='Pick a password'
                  showSuccessStyle
                  type='password'
                  sx={{ mb: 0.5 }}
                />

                {/* Rules panel (display-only) */}
                <Collapse in={!passwordPassesRules} unmountOnExit>
                  <Box
                    role='note'
                    aria-live='polite'
                    sx={{
                      mt: 1,
                      mb: 2,
                      px: 1.5,
                      py: 1,
                      bgcolor: '#111',
                      border: '1px solid #3B3B3B',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant='caption' sx={{ color: '#C9C9C9', fontWeight: 700 }}>
                      Password must include:
                    </Typography>
                    <ul style={{ margin: '6px 0 0 16px', padding: 0, color: '#C9C9C9' }}>
                      <li>Minimum 8 characters</li>
                      <li>At least one uppercase character</li>
                      <li>At least one lowercase character</li>
                      <li>At least one number</li>
                      <li>
                        At least one symbol from the following{' '}
                        <code style={{ fontFamily: 'monospace' }}>{DISPLAY_SYMBOLS}</code>
                      </li>
                    </ul>
                  </Box>
                </Collapse>

                <FormikTextField
                  name='confirmPassword'
                  placeholder='Confirm password'
                  type='password'
                  showSuccessStyle
                />

                <Box sx={{ width: '110%', ml: '-5%', mr: '-5%' }}>
                  {passwordsMatch && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formik.values.agree}
                          onChange={(e) => formik.setFieldValue('agree', e.target.checked)}
                          sx={{
                            color: '#FFC107',
                            '&.Mui-checked': { color: '#FFC107' },
                          }}
                        />
                      }
                      label={
                        <Typography variant='caption' sx={{ color: '#C9C9C9' }}>
                          By checking this box I accept the{' '}
                          <span style={{ color: '#EFAF00' }}>
                            <MLink
                              component={RouterLink}
                              to={ROUTES.TERMS}
                              target='_blank'
                              rel='noopener'
                              underline='hover'
                              sx={{ color: '#EFAF00', fontWeight: 700 }}
                            >
                              Terms of Use
                            </MLink>
                          </span>{' '}
                          of this platform
                        </Typography>
                      }
                      sx={{ mt: 1, mb: 2 }}
                    />
                  )}
                </Box>

                <CustomAuthButton
                  fullWidth
                  type='submit'
                  variant='contained'
                  disabled={
                    !(
                      formik.values.password &&
                      formik.values.confirmPassword &&
                      formik.values.password === formik.values.confirmPassword &&
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
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
}

export default Step2;
