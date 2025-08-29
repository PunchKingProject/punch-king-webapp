// pages/sign-up/Preview.tsx
import { Box, CircularProgress, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomAuthButton from '../../../components/buttons/CustomAuthButton';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { resetRegistration } from '../../../store/registration.slice';
import { showError } from '../../../utils/error/toastError';
import { updateUser, type UpdateUserPayload } from '../api/registration';

export default function Preview() {
  const draft = useAppSelector((s) => s.registration.draft);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const rid = sp.get('rid') || localStorage.getItem('pk_rid') || '';
  const flow = (sp.get('flow') || 'user') as 'user' | 'team';

  const params = new URLSearchParams();
  if (rid) params.set('rid', rid);
  params.set('flow', flow);

  // Build the exact payload the API wants from your step3 draft
  const payload: UpdateUserPayload = useMemo(
    () => ({
      phone_number: draft.step3?.phone || '',
      address: draft.step3?.address || '',
      country: draft.step3?.country || '',
      state: draft.step3?.state || '',
      dob: draft.step3?.dob || '', // keep the format your API expects
      gender: draft.step3?.gender || '',
      bio: draft.step3?.bio || '',
      profile_picture: draft.step4?.profile_picture || '',
    }),
    [draft.step3]
  );

  // Simple guard: disable if any required field is missing
  const canFinish =
    payload.phone_number &&
    payload.address &&
    payload.country &&
    payload.state &&
    payload.dob &&
    payload.gender;

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      // go wherever your flow ends (dashboard / success screen)
      // or stay and show a toast—your call.
      localStorage.removeItem('pk_registration_draft'); // 👈 clear draft
      dispatch(resetRegistration())
      navigate(`/welcome?${params.toString()}`, { replace: true });
    },
    onError: showError,
  });

  const onFinish = () => {
    if (!canFinish || mutation.isPending) return;
    mutation.mutate(payload);
  };

  const rows = [
    { label: 'Phone number', value: draft.step3?.phone },
    { label: 'Address', value: draft.step3?.address },
    { label: 'Country', value: draft.step3?.country },
    { label: 'State', value: draft.step3?.state },
    { label: 'DOB', value: draft.step3?.dob },
    { label: 'Gender', value: draft.step3?.gender },
    { label: 'Bio', value: draft.step3?.bio },
  ];
  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: 'auto',
        px: {
          xs: 2,
          md: 4,
        },
        pt: 3,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          mb: 3,
        }}
      >
        <Box
          component='img'
          src={draft.step4?.profile_picture}
          alt='Profile pic'
          sx={{
            width: 240,
            height: 160,
            mx: 'auto',
            borderRadius: 2,
            objectFit: 'cover',
            mb: 2,
          }}
        />

        <Typography textAlign='center' fontWeight={700} mb={2}>
          User name
          <br />
          <span
            style={{
              color: '#A2A2A2',
            }}
          >
            {draft.step1?.username}
          </span>
          <br />
          <span
            style={{
              color: '#A2A2A2',
            }}
          >
            {' '}
            Email: {draft.step1?.email}
          </span>
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr',
          },
          alignItems: 'start',
          mb: {
            xs: 2,
            md: 1
          },
        }}
      >
        {rows.map((row) => (
          <Box
            key={row.label}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'max-content 1fr',
              columnGap: 1.5,
            }}
          >
            <Typography key={row.label} mb={1}>
              <strong>{row.label}:</strong>{' '}
              <br />
              <span
                style={{
                  color: '#A2A2A2',
                }}
              >
                {row.value || 'complete your profile'}
              </span>
            </Typography>
          </Box>
        ))}
      </Box>

      <Box mt={3} display='flex' flexDirection='column' gap={1.5} sx={{
        width: {
          md: '80%'
        },
        mx: {
          md: 'auto'
        },
        mb: 3
      }}>
        <CustomAuthButton
          fullWidth
          variant='contained'
          onClick={onFinish}

          sx={{
            // backgroundColor: '#F6C10A',
            // color: '#000',
            // fontWeight: 700,
            // textTransform: 'none',
            py: 0.8,
          }}
        >
          {mutation.isPending ? (
            <CircularProgress size={18} sx={{ color: '#000' }} />
          ) : (
            'Finish'
          )}
        </CustomAuthButton>

        <CustomAuthButton
          fullWidth
          variant='outlined'
          onClick={() => navigate('/sign-up/step4')}
          //   sx={{
          //     borderColor: '#F6C10A',
          //     color: '#F6C10A',
          //     fontWeight: 700,
          //     textTransform: 'none',
          //   }}
        >
          Edit
        </CustomAuthButton>
      </Box>
    </Box>
  );
}
