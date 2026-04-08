import { Box } from '@mui/material';
import { Form, Formik, useFormikContext } from 'formik';
import debounce from 'lodash.debounce';
import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import CustomAuthButton from '../../../components/buttons/CustomAuthButton';
import { GoldSelect, GoldTextField } from '../../../components/form/GoldInput';
import GoldPhoneField from '../../../components/form/GoldPhoneField';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { mergeDraft } from '../../../store/registration.slice';
import { getCountryOptions, getStateOptions } from '../../../utils/geo';
import { isValidPhone } from '../../../utils/helpers';

type Values = {
  // common
  phone: string;
  address: string;
  country: string;
  state: string;
  bio?: string;

  // sponsor-only
  gender?: string;
  dob?: string; // YYYY-MM-DD

  // team-only
  coach_1?: string;
  coach_2?: string;
  license_number?: string;
};

type Option = { label: string; value: string };

const AFRICA_ISO2 = new Set<string>([
  'DZ',
  'AO',
  'BJ',
  'BW',
  'BF',
  'BI',
  'CM',
  'CV',
  'CF',
  'TD',
  'KM',
  'CG',
  'CD',
  'CI',
  'DJ',
  'EG',
  'GQ',
  'ER',
  'SZ',
  'ET',
  'GA',
  'GM',
  'GH',
  'GN',
  'GW',
  'KE',
  'LS',
  'LR',
  'LY',
  'MG',
  'MW',
  'ML',
  'MR',
  'MU',
  'YT',
  'MA',
  'MZ',
  'NA',
  'NE',
  'NG',
  'RE',
  'RW',
  'SH',
  'ST',
  'SN',
  'SC',
  'SL',
  'SO',
  'ZA',
  'SS',
  'SD',
  'TZ',
  'TG',
  'TN',
  'UG',
  'EH',
  'ZM',
  'ZW',
]);

// (safety net in case getCountryOptions().value isn't ISO-2)
const AFRICA_NAMES = new Set<string>(
  [
    'Algeria',
    'Angola',
    'Benin',
    'Botswana',
    'Burkina Faso',
    'Burundi',
    'Cameroon',
    'Cape Verde',
    'Central African Republic',
    'Chad',
    'Comoros',
    'Congo',
    'Congo (DRC)',
    'Côte d’Ivoire',
    'Ivory Coast',
    'Djibouti',
    'Egypt',
    'Equatorial Guinea',
    'Eritrea',
    'Eswatini',
    'Ethiopia',
    'Gabon',
    'Gambia',
    'Ghana',
    'Guinea',
    'Guinea-Bissau',
    'Kenya',
    'Lesotho',
    'Liberia',
    'Libya',
    'Madagascar',
    'Malawi',
    'Mali',
    'Mauritania',
    'Mauritius',
    'Mayotte',
    'Morocco',
    'Mozambique',
    'Namibia',
    'Niger',
    'Nigeria',
    'Réunion',
    'Rwanda',
    'Saint Helena',
    'São Tomé and Príncipe',
    'Senegal',
    'Seychelles',
    'Sierra Leone',
    'Somalia',
    'South Africa',
    'South Sudan',
    'Sudan',
    'Tanzania',
    'Togo',
    'Tunisia',
    'Uganda',
    'Western Sahara',
    'Zambia',
    'Zimbabwe',
  ].map((n) => n.toLowerCase()),
);

// ----- Two schemas: sponsor vs team -----
const baseCommon = {
  phone: Yup.string()
    .test('is-valid-phone', 'Invalid phone number', (v) =>
      isValidPhone(v ?? ''),
    )
    .required('Required'),
  address: Yup.string().min(3, 'Too short').required('Required'),
  country: Yup.string().required('Required'),
  state: Yup.string().when('country', {
    is: (c: unknown) => !!c && getStateOptions(String(c)).length > 0,
    then: (s) => s.required('Required'),
    otherwise: (s) => s.optional(),
  }),
  bio: Yup.string().max(280).optional(),
};

const sponsorSchema = Yup.object({
  ...baseCommon,
  gender: Yup.string().required('Required'),
  dob: Yup.string().required('Required'),
});

const teamSchema = Yup.object({
  ...baseCommon,
  // override "country" for teams:
  country: Yup.string()
    .test('is-african', 'Teams must select an African country', (v) => {
      if (!v) return false;
      return AFRICA_ISO2.has(v) || AFRICA_NAMES.has(v.toLowerCase());
    })
    .required('Required'),
  coach_1: Yup.string().optional(),
  coach_2: Yup.string().optional(),
  license_number: Yup.string().optional(),
});

function Step3() {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.registration.draft);
  const reduxFlow = useAppSelector((s) => s.registration.flow);
  const storedFlow =
    (localStorage.getItem('flow') as 'sponsor' | 'team' | 'admin' | null) ??
    null;
  const flow: 'sponsor' | 'team' =
    (reduxFlow as 'sponsor' | 'team') ||
    (storedFlow as 'sponsor' | 'team') ||
    'sponsor';
  const isTeam = flow === 'team';

  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const rid = sp.get('rid') || '';
  const params = new URLSearchParams();
  if (rid) params.set('rid', rid);
  params.set('flow', flow);

  const initialValues: Values = {
    phone: draft.step3?.phone || '',
    address: draft.step3?.address || '',
    country: draft.step3?.country || '',
    state: draft.step3?.state || '',
    bio: draft.step3?.bio || '',

    // sponsor-only
    gender: draft.step3?.gender || '',
    dob: draft.step3?.dob || '',

    // team-only
    coach_1: draft.step3?.coach_1 || '',
    coach_2: draft.step3?.coach_2 || '',
    license_number: draft.step3?.license_number || '',
  };

  const validationSchema = useMemo(
    () => (isTeam ? teamSchema : sponsorSchema),
    [isTeam],
  );

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
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      // enableReinitialize // 👈 respect hydrated values after back/refresh
      // validateOnMount // 👈 compute isValid immediately
    >
      <Step3Body isTeam={isTeam} />
    </Formik>
  );
}

export default Step3;

// ----------------------
// Child body (hooks OK here)
// ----------------------
function Step3Body({ isTeam }: { isTeam: boolean }) {
  const dispatch = useAppDispatch();
  const formik = useFormikContext<Values>();

  // autosave (debounced) – now legal (top-level in a component)
  const autosave = useMemo(
    () =>
      debounce((vals: Values) => dispatch(mergeDraft({ step3: vals })), 400),
    [dispatch],
  );
  useEffect(() => {
    autosave(formik.values);
    return () => autosave.cancel();
  }, [formik.values, autosave]);

  const countryOptions = useMemo<Option[]>(() => {
    const all = getCountryOptions() as Option[];

    if (!isTeam) return all;

    // Only African countries for teams
    return all.filter(
      (o) =>
        AFRICA_ISO2.has(o.value) || AFRICA_NAMES.has(o.label.toLowerCase()),
    );
  }, [isTeam]);
  const stateOptions = useMemo(
    () => getStateOptions(formik.values.country),
    [formik.values.country],
  );

  // if current state value doesn't exist for selected country, clear it
  useEffect(() => {
    if (
      formik.values.state &&
      !stateOptions.find((o) => o.value === formik.values.state)
    ) {
      formik.setFieldValue('state', '');
    }
  }, [stateOptions, formik.values.state, formik.setFieldValue]);

  return (
    <Form
      style={{
        width: '100%',
        maxWidth: 880,
        padding: '0 20px',
        margin: '16px auto',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          alignItems: 'start',
        }}
      >
        {/* PHONE: independent of country/state */}
        <GoldPhoneField
          name='phone'
          placeholder='Phone number'
          defaultCountry='NG'
        />
        <GoldTextField
          name='address'
          placeholder={isTeam ? 'Team address' : 'Address'}
        />
        {/* COUNTRY → STATE (dependent) */}
        <GoldSelect
          name='country'
          placeholder='Country'
          options={countryOptions}
          searchable
        />
        <GoldSelect
          name='state'
          placeholder='State / Region'
          options={stateOptions}
          searchable
        />

        {isTeam ? (
          <>
            <GoldTextField name='coach_1' placeholder='Coach 1' />
            <GoldTextField name='coach_2' placeholder='Coach 2' />
            <GoldTextField name='license_number' placeholder='License number' />
          </>
        ) : (
          <>
            <GoldSelect
              name='gender'
              placeholder='gender'
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ]}
            />
            <GoldTextField
              name='dob'
              label='Date of Birth'
              placeholder='DOB'
              type='date'
              sx={{ '& input': { colorScheme: 'dark' } }}
            />
          </>
        )}

        <GoldTextField
          name='bio'
          placeholder='Bio'
          multiline
          rows={4}
          sx={{
            gridColumn: { xs: '1 / -1', md: '1 / span 2' },
            width: { md: '400px' },
            mx: { md: 'auto' },
          }}
        />

        <Box
          display='flex'
          gap={2}
          justifyContent='center'
          sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 2' } }}
        >
          <CustomAuthButton
            type='submit'
            variant='contained'
            disabled={!formik.isValid}
            sx={{ width: { md: '300px' } }}
          >
            Next
          </CustomAuthButton>
        </Box>
      </Box>
    </Form>
  );
}
