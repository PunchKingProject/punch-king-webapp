import { Box } from '@mui/material';
import { Form, Formik } from 'formik';
import debounce from 'lodash.debounce';
import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import CustomAuthButton from '../../../components/buttons/CustomAuthButton';
import { GoldSelect, GoldTextField } from '../../../components/form/GoldInput';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { mergeDraft } from '../../../store/registration.slice';

// Demo data — replace Owith your loaders
const COUNTRIES = [
  { label: 'Nigeria', value: 'nigeria' },
  { label: 'Ghana', value: 'ghana' },
];
const NG_STATES = [
  { label: 'Lagos', value: 'lagos' },
  { label: 'Abuja (FCT)', value: 'abuja' },
  { label: 'Rivers', value: 'rivers' },
];
const GENDERS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const Schema = Yup.object({
  phone: Yup.string().min(7, 'Too short').required('Required'),
  address: Yup.string().min(3, 'Too short').required('Required'),
  country: Yup.string().required('Required'),
  state: Yup.string().required('Required'),
  gender: Yup.string().required('Required'),
  dob: Yup.string().required('Required'),
  bio: Yup.string().max(280).optional(),
});

type Values = {
  phone: string;
  address: string;
  country: string;
  state: string;
  gender: string;
  dob: string; // YYYY-MM-DD
  bio?: string;
};

function Step3() {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.registration.draft);

  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const rid = sp.get('rid') || '';
  const flow = (sp.get('flow') || 'user') as 'user' | 'team';

  const params = new URLSearchParams();
  if (rid) params.set('rid', rid);
  params.set('flow', flow);

  const initialValues: Values = {
    phone: draft.step3?.phone || '',
    address: draft.step3?.address || '',
    country: draft.step3?.country || '',
    state: draft.step3?.state || '',
    gender: draft.step3?.gender || '',
    dob: draft.step3?.dob || '',
    bio: draft.step3?.bio || '',
  };

  const onSubmit = async (values: Values) => {
    // TODO: autosave/patch draft -> advance to step 4
    // await api.patch('/registration/draft', { step: 3, data: values });
    // await api.post('/registration/advance', { step: 3 });
    dispatch(mergeDraft({ step3: values }));
    navigate(`/sign-up/step4?${params.toString()}`);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={onSubmit}
      // enableReinitialize // 👈 respect hydrated values after back/refresh
      // validateOnMount // 👈 compute isValid immediately
    >
      {(formik) => {
        console.log(formik);
        // OPTIONAL: autosave while typing
        const autoSave = useMemo(
          () =>
            debounce(
              (vals: Values) => dispatch(mergeDraft({ step3: vals })),
              400
            ),
          [dispatch]
        );
        useEffect(() => {
          autoSave(formik.values);

          return () => autoSave.cancel()
        }, [formik.values, autoSave]);

        return (
          <Form
            style={{
              width: '100%',
              maxWidth: 880,
              padding: '0 20px',
              margin: '16px auto',
              // border: '2px solid red',
            }}
          >
            {/* GRID CONTAINER */}
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                },
                alignItems: 'start',
              }}
            >
              {/* Row 1 */}
              <GoldTextField name='phone' placeholder='Phone number' />
              <GoldTextField name='address' placeholder='user address' />

              {/* Row 2 */}
              <GoldSelect
                name='country'
                placeholder='Country'
                options={COUNTRIES}
              />
              <GoldSelect
                name='state'
                placeholder='State'
                options={formik.values.country === 'nigeria' ? NG_STATES : []}
              />

              <GoldSelect
                name='gender'
                placeholder='gender'
                options={GENDERS}
              />

              {/* Row 3 */}
              {/* DOB as native date input but styled like text */}
              <GoldTextField
                name='dob'
                label='Date of Birth'
                placeholder='DOB'
                type='date'
                sx={{
                  '& input': {
                    colorScheme: 'dark',
                  },
                }}
              />

              <GoldTextField
                name='bio'
                placeholder='Bio'
                multiline
                rows={4}
                sx={{
                  gridColumn: { xs: '1 / -1', md: ' 1 / span 2' },
                  width: {
                    md: '400px',
                  },
                  mx: {
                    md: 'auto',
                  },
                }}
              />

              <Box
                display='flex'
                gap={2}
                justifyContent={'center'}
                sx={{
                  // border: '2px solid green',
                  gridColumn: { xs: '1 / -1', md: ' 1 / span 2' },

                  
                }}
              >
                <CustomAuthButton
                  type='submit'
                  variant='contained'
                  disabled={!formik.isValid}
                  sx={
                    {
                      width: {
                        md: '300px',
                      },
                    }
                  }
                >
                  Next
                </CustomAuthButton>

                {/* <CustomAuthButton
                  variant='outlined'
                  onClick={() => navigate('/sign-in')}
                >
                  Cancel
                </CustomAuthButton> */}
              </Box>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
}

export default Step3;
