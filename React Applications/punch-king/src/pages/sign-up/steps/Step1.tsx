import { Box, CircularProgress } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import { punchKingLogoSignIn } from '../../../assets';
import FormikTextField from '../../../components/form/FormikTextField';
import NoticeModal from '../../../components/modal/NoticeModal';
import { useAppDispatch } from '../../../hooks';
import { mergeDraft } from '../../../store/registration.slice';
import { openInbox } from '../../../utils/helpers';
import { verifyUser } from '../api/registration';

import type { } from 'axios';
import { toast } from 'react-toastify';
import CustomAuthButton from '../../../components/buttons/CustomAuthButton';
import { withErrorToast } from '../../../utils/error/onError';

function Step1() {
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [lastEmail, setLastEmail] = useState<string>('');
  const [sp] = useSearchParams();

  const flow = (sp.get('flow') || 'sponsor') as 'sponsor' | 'team';

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
    // navigate(`/sign-up/step2?`);

    setLastEmail(values.email);

    // call backend to queue verification email
    mutation.mutate({
      email: values.email,
      name: values.username,
      role: flow, // 'sponsor' | 'team'
    });
  };

  const handleContinueFromModal = () => {
    // Try to open their inbox
    openInbox(lastEmail);

    // Optional: also navigate to step2 right away OR leave them on step1
    // If your flow requires email verification link to continue, don't navigate.
    // If you want to let them proceed and guard with SignupGuard on reload, do:
    // navigate(`/sign-up/step2?${params.toString()}`);
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
          enableReinitialize
        >
          {(formik) => {
            // OPTIONAL: autosave to Redux/localStorage as they type (debounced)
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
                  // border: '2px solid red',
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
