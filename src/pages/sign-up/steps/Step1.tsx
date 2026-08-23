import { Box, CircularProgress } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import { punchKingLogoSignIn } from '../../../assets';
import FormikTextField from '../../../components/form/FormikTextField.tsx';
import NoticeModal from '../../../components/modal/NoticeModal.tsx';
import { useAppDispatch } from '../../../hooks.ts';
import { mergeDraft } from '../../../store/registration.slice.ts';
import { openInbox } from '../../../utils/helpers.ts';
import { verifyUser } from '../api/registration.ts';

import type { } from 'axios';
import { toast } from 'react-toastify';
import CustomAuthButton from '../../../components/buttons/CustomAuthButton.tsx';
import { withErrorToast } from '../../../utils/error/onError.ts';

function Step1() {
  const dispatch = useAppDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false); // ⬅️ State for the team welcome notice
  const [lastEmail, setLastEmail] = useState<string>('');
  const [sp] = useSearchParams();

  const raw = sp.get('flow') ?? '';
  const token = raw.split(/[?&]/)[0].toLowerCase();
  const flow: 'sponsor' | 'team' = token === 'team' ? 'team' : 'sponsor';

  // ⬅️ Automatically trigger the NoticeModal for teams on page load
  useEffect(() => {
    if (flow === 'team') {
      setWelcomeModalOpen(true);
    }
  }, [flow]);

  const initialValues = {
    email: '',
    username: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    username: Yup.string().required('Required'),
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log('Login values:', values);
    dispatch(mergeDraft({ step1: values }));

    setLastEmail(values.email);

    mutation.mutate({
      email: values.email,
      name: values.username,
      role: flow,
    });
  };

  const handleContinueFromModal = () => {
    openInbox(lastEmail);
  };

  const mutation = useMutation({
    mutationFn: verifyUser,
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        console.log('Verification email sent successfully');
        setModalOpen(true);
      }
    },
    onError: withErrorToast((err) => {
      toast.error(
        'Failed to send verification email: ' + (err as Error).message
      );
    }),
  });

  return (
    <>
      {/* Team Welcome Notice Modal */}
      <NoticeModal
        open={welcomeModalOpen}
        onClose={() => setWelcomeModalOpen(false)}
        onContinue={() => setWelcomeModalOpen(false)}
        title='IMPORTANT NOTICE'
        message='Welcome to Punch King! To complete your team registration and get verified, you must update your profile information and upload your boxer/fighter sparring contents.'
        continueLabel='Got It, Let’s Go!'
      />

      {/* Email Verification Notice Modal */}
      <NoticeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onContinue={handleContinueFromModal}
        title='NOTICE!!!'
        message='An email has been sent to you. Use it to complete your signup.'
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
          enableReinitialize
        >
          {(formik) => {
            const autoSave = useMemo(
              () =>
                debounce((vals) => dispatch(mergeDraft({ step1: vals })), 400),
              [dispatch]
            );
            useEffect(() => {
              autoSave(formik.values);
            }, [formik.values, autoSave]);
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
                  placeholder='Email'
                  type='email'
                  showSuccessStyle
                />
                <FormikTextField
                  name='username'
                  placeholder='Username'
                  showSuccessStyle
                  type='text'
                  sx={{
                    mb: -1,
                  }}
                />

                <Box sx={{}}>
                  <CustomAuthButton
                    fullWidth
                    type='submit'
                    variant='contained'
                    disabled={
                      !(formik.isValid && formik.dirty) || mutation.isPending
                    }
                  >
                    {mutation.isPending ? (
                      <CircularProgress size={18} sx={{ color: '#000' }} />
                    ) : (
                      'Sign up'
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

export default Step1;