// pages/sign-up/Preview.tsx
import { Box, CircularProgress, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomAuthButton from '../../../components/buttons/CustomAuthButton';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { clearRegistrationDraft } from '../../../store/registration.slice';
import { showError } from '../../../utils/error/toastError';
import { updateUser, type UpdateUserPayload } from '../api/registration';

export default function Preview() {
  const draft = useAppSelector((s) => s.registration.draft);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [sp] = useSearchParams();
 const rid = sp.get('rid') || localStorage.getItem('pk_rid') || '';
 // Resolve flow from qs → redux → localStorage (fallback 'sponsor')
 const reduxFlow = useAppSelector((s) => s.registration.flow) as 'sponsor' | 'team' | 'admin';
 const storedFlow = (localStorage.getItem('flow') as 'sponsor' | 'team' | 'admin' | null) ?? null;
 const flow = ((sp.get('flow') as 'sponsor' | 'team' | null)
   || (reduxFlow as 'sponsor' | 'team' | null)
   || (storedFlow as 'sponsor' | 'team' | null)
   || 'sponsor') as 'sponsor' | 'team';
 const isTeam = flow === 'team';

  const params = new URLSearchParams();
  if (rid) params.set('rid', rid);
  params.set('flow', flow);


   // helper to avoid sending empty strings
 const defined = (v?: string | null) => (v && v.trim().length ? v : undefined);


  // Build the exact payload the API wants from your step3 draft
  const payload: UpdateUserPayload = useMemo(
   () => {
     const s3 = draft.step3 ?? {};
     const base: UpdateUserPayload = {
       phone_number: defined(s3.phone),
       address: defined(s3.address),
       country: defined(s3.country),
       state: defined(s3.state),
       bio: defined(s3.bio),
       profile_picture: defined(draft.step4?.profile_picture),
     };
     return isTeam
       ? {
           ...base,
           coach_1: defined(s3.coach_1),
           coach_2: defined(s3.coach_2),
           license_number: defined(s3.license_number),
         }
       : {
           ...base,
           dob: defined(s3.dob),
           gender: defined(s3.gender),
         };
   },
   [draft.step3, draft.step4, isTeam]
  );

  // Required set depends on flow
 const canFinish = useMemo(() => {
   const baseOk =
     !!payload.phone_number && !!payload.address && !!payload.country && !!payload.state;
   if (!baseOk) return false;
   return isTeam ? true : !!payload.dob && !!payload.gender;
 }, [payload, isTeam]);

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      // go wherever your flow ends (dashboard / success screen)
      // or stay and show a toast—your call.
      localStorage.removeItem('pk_registration_draft'); // 👈 clear draft
 
    /** ✅ Clear ONLY the registration draft (keep token & flow) */
        dispatch(clearRegistrationDraft()); 

      navigate(`/welcome?${params.toString()}`, { replace: true });
    },
    onError: showError,
  });

  const onFinish = () => {
    if (!canFinish || mutation.isPending) return;
    mutation.mutate(payload);
  };

 const rows = useMemo(() => {
   const base = [
     { label: 'Phone number', value: draft.step3?.phone },
     { label: 'Address', value: draft.step3?.address },
     { label: 'Country', value: draft.step3?.country },
     { label: 'State', value: draft.step3?.state },
     { label: 'Bio', value: draft.step3?.bio },
   ];
   return isTeam
     ? [
         ...base,
         { label: 'Coach 1', value: draft.step3?.coach_1 },
         { label: 'Coach 2', value: draft.step3?.coach_2 },
         { label: 'License number', value: draft.step3?.license_number },
       ]
     : [
         ...base,
         { label: 'DOB', value: draft.step3?.dob },
         { label: 'Gender', value: draft.step3?.gender },
       ];
 }, [draft.step3, isTeam]);
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
 disabled={!canFinish || mutation.isPending}

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
