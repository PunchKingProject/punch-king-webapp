import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import { Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import { useEffect, useRef } from 'react';
import * as Yup from 'yup';

import { toast } from 'react-toastify';
import CustomAuthButton from '../../../../components/buttons/CustomAuthButton';
import FormikDatePicker from '../../../../components/form/FormikDatePicker';
import FormikSelect from '../../../../components/form/FormikSelect';
import FormikTextField from '../../../../components/form/FormikWhiteTextField';
import NoticeModal from '../../../../components/modal/NoticeModal';
import PKDialog from '../../../../components/modal/PkDialog';
import { useDisclosure } from '../../../../hooks/useDisclosure';
import { colors } from '../../../../theme/colors';

import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUpdateUserProfile } from '../hooks/useUpdateUserProfile';
import { useUploadUserImage } from '../hooks/useUploadUserImage';
dayjs.extend(isSameOrBefore);

type Props = { sponsor_id: number };
/* -------------------------------- schema -------------------------------- */
const schema = Yup.object({
  username: Yup.string().required('Required'),
  dob: Yup.string()
    .test(
      'valid-date',
      'Invalid date',
      (v) => !v || dayjs(v, 'YYYY-MM-DD', true).isValid()
    )
    .test(
      'not-future',
      'Date cannot be in the future',
      (v) => !v || dayjs(v).isSameOrBefore(dayjs(), 'day')
    ),
  address: Yup.string(),
  country: Yup.string(),
  state: Yup.string(),
  gender: Yup.string().oneOf(['Male', 'Female', 'Other']).nullable(),
  bio: Yup.string(),
});

/* --------------------------- select option data --------------------------- */
const COUNTRY_OPTIONS = [
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'United States', label: 'United States' },
];

const STATE_OPTIONS: Record<string, { value: string; label: string }[]> = {
  Nigeria: [
    'Abia',
    'Adamawa',
    'Akwa Ibom',
    'Anambra',
    'Bauchi',
    'Bayelsa',
    'Benue',
    'Borno',
    'Cross River',
    'Delta',
    'Ebonyi',
    'Edo',
    'Ekiti',
    'Enugu',
    'FCT',
    'Gombe',
    'Imo',
    'Jigawa',
    'Kaduna',
    'Kano',
    'Katsina',
    'Kebbi',
    'Kogi',
    'Kwara',
    'Lagos',
    'Nasarawa',
    'Niger',
    'Ogun',
    'Ondo',
    'Osun',
    'Oyo',
    'Plateau',
    'Rivers',
    'Sokoto',
    'Taraba',
    'Yobe',
    'Zamfara',
  ].map((s) => ({ value: s, label: s })),
  Ghana: [
    'Ashanti',
    'Brong-Ahafo',
    'Central',
    'Eastern',
    'Greater Accra',
    'Northern',
    'Upper East',
    'Upper West',
    'Volta',
    'Western',
  ].map((s) => ({ value: s, label: s })),
  Kenya: [
    'Baringo',
    'Bomet',
    'Bungoma',
    'Busia',
    'Elgeyo-Marakwet',
    'Embu',
    'Garissa',
    'Homa Bay',
    'Isiolo',
    'Kajiado',
    'Kakamega',
    'Kericho',
    'Kiambu',
    'Kilifi',
    'Kirinyaga',
    'Kisii',
    'Kisumu',
    'Kitui',
    'Kwale',
    'Laikipia',
    'Lamu',
    'Machakos',
    'Makueni',
    'Mandera',
    'Marsabit',
    'Meru',
    'Migori',
    'Mombasa',
    'Murang’a',
    'Nairobi',
    'Nakuru',
    'Nandi',
    'Narok',
    'Nyamira',
    'Nyandarua',
    'Nyeri',
    'Samburu',
    'Siaya',
    'Taita-Taveta',
    'Tana River',
    'Tharaka-Nithi',
    'Trans Nzoia',
    'Turkana',
    'Uasin Gishu',
    'Vihiga',
    'Wajir',
    'West Pokot',
  ].map((s) => ({ value: s, label: s })),
  'South Africa': [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'North West',
    'Northern Cape',
    'Western Cape',
  ].map((s) => ({ value: s, label: s })),
  'United States': [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ].map((s) => ({ value: s, label: s })),
};

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];


export default function DesktopUserDetailsSection({ sponsor_id }: Props) {
 

  const { data, isLoading, isError } = useUserProfile(sponsor_id);
  const updateUser = useUpdateUserProfile(sponsor_id);
  const uploadMutation = useUploadUserImage();

  const uploadDialog = useDisclosure(false);
  const confirmDlg = useDisclosure(false);
  const successDlg = useDisclosure(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isError) toast.error('Failed to fetch user profile.');
  }, [isError]);

  useEffect(() => {
    if (updateUser.isError) toast.error('Failed to update user profile.');
  }, [updateUser.isError]);

  useEffect(() => {
    if (uploadMutation.isError) toast.error('Failed to upload image.');
  }, [uploadMutation.isError]);

  if (isLoading) {
    return (<Typography sx={{ px: '6.98em', py: 2, color: '#fff' }}>Loading user...</Typography>);
  }
  if (!data) {
    return (<Typography sx={{ px: '6.98em', py: 2, color: '#fff' }}>User not found</Typography>);
  }

  const initialValues = {
    username: data.username ?? '',
    dob: data.dob ? dayjs(data.dob).format('YYYY-MM-DD') : '',
    address: data.address ?? '',
    country: data.country ?? '',
    state: data.state ?? '',
    gender: (data.gender as 'Male' | 'Female' | 'Other' | '') ?? '',
    bio: data.bio ?? '',
    profile_picture: data.profile_picture ?? '',
  };



  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values, helpers) => {
        updateUser.mutate(
          {
            phone_number: data.phone_number ?? '',
            address: values.address || undefined,
            country: values.country || undefined,
            state: values.state || undefined,
            dob: values.dob
              ? dayjs(values.dob).startOf('day').toISOString()
              : undefined,
            gender: values.gender || undefined,
            bio: values.bio || undefined,
            profile_picture: values.profile_picture || undefined,
          },
          {
            onSuccess: () => {
              confirmDlg.onClose();
              successDlg.onOpen();
            },
            onSettled: () => helpers.setSubmitting(false),
          }
        );
      }}
    >
      {({
        values,
        setFieldValue,
        isSubmitting,
        validateForm,
        setTouched,
        submitForm,
      }) => {
        const stateOptions =
          values.country && STATE_OPTIONS[values.country]
            ? STATE_OPTIONS[values.country]
            : [];

        return (
          <Form>
            <Box
              sx={{
                px: '6.98em',
                pb: 6,
                '@media (min-width:910px) and (max-width:1000px)': {
                  px: '2em',
                },
                '@media (min-width:1000px) and (max-width:1100px)': {
                  px: '1em',
                },
              }}
            >
              <Typography
                variant='h5'
                sx={{ fontWeight: 900, color: '#fff', mb: 2 }}
              >User Details</Typography>

              {/* Avatar + Update link */}
              <Box>
                <Box
                  sx={{
                    width: 320,
                    height: 200,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid #3B3B3B',
                    background: '#111',
                    mb: 1.5,
                    display: 'grid',
                    placeItems: 'center',
                    ml: 'auto',
                    mr: 'auto',
                  }}
                >
                  {values.profile_picture ? (
                    <img
                      src={values.profile_picture}
                      alt='user'
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        border: `15px solid ${colors.Freeze}`,
                      }}
                    />
                  ) : (
                    <Typography sx={{ color: '#aaa' }}>No image available</Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    width: 320,
                    ml: 'auto',
                    mr: 'auto',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'baseline',
                    mt: -2,
                  }}
                >
                  <Button
                    variant='text'
                    onClick={uploadDialog.onOpen}
                    sx={{
                      color: '#EFAF00',
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 0,
                    }}
                  >Update</Button>
                </Box>
              </Box>

              {/* Form fields grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px 30px',
                  maxWidth: '800px',
                  mx: 'auto',
                }}
              >
                <FormikTextField
                  name='username'
                  label='User name'
                  placeholder='User name'
                />
                <FormikDatePicker name='dob' label='DOB' maxDate={dayjs()} />

                <FormikSelect
                  name='country'
                  label='Country'
                  placeholder='Select country'
                  options={COUNTRY_OPTIONS}
                  onChangeOverride={(v) => {
                    setFieldValue('country', v);
                    setFieldValue('state', '');
                  }}
                />
                <FormikSelect
                  name='state'
                  label='State'
                  placeholder={
                    values.country
                      ? 'Select state/region'
                      : 'Select country first'
                  }
                  options={stateOptions}
                  disabled={!values.country}
                />

                <FormikTextField
                  name='address'
                  label='Address'
                  placeholder='Address'
                />
                <FormikSelect
                  name='gender'
                  label='Gender'
                  placeholder='Select gender'
                  options={GENDER_OPTIONS}
                />
              </Box>

              <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                <FormikTextField
                  name='bio'
                  placeholder='Bio'
                  label='Bio'
                  multiline
                  rows={4}
                />
                <Button
                  sx={{ display: 'block', ml: 'auto' }}
                  type='button'
                  variant='contained'
                  onClick={async () => {
                    const errors = await validateForm();
                    if (Object.keys(errors).length) {
                      setTouched(
                        Object.keys(errors).reduce(
                          (acc, k) => ({ ...acc, [k]: true }),
                          {}
                        ),
                        false
                      );
                      return;
                    }
                    confirmDlg.onOpen();
                  }}
                >Update</Button>
              </Box>

              {/* Upload image dialog */}
              <PKDialog
                open={uploadDialog.open}
                onClose={uploadDialog.onClose}
                title=''
                actions={
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <CustomAuthButton
                      onClick={() => fileInputRef.current?.click()}
                      variant='contained'
                      fullWidth={false}
                      disabled={uploadMutation.isPending}
                      sx={{ py: 1.25, width: '69%' }}
                    >
                      {uploadMutation.isPending
                        ? 'Uploading…'
                        : 'Upload picture'}
                    </CustomAuthButton>
                  </Box>
                }
                disableCloseWhenBusy={uploadMutation.isPending}
              >
                <Box sx={{ display: 'grid', placeItems: 'center' }}>
                  <Box
                    sx={{
                      width: 520,
                      maxWidth: '100%',
                      height: 160,
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid #BDBDBD',
                      background: '#111',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {values.profile_picture ? (
                      <img
                        src={values.profile_picture}
                        alt='user'
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          border: `15px solid ${colors.Freeze}`,
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: '#666' }}>No image available</Typography>
                    )}
                  </Box>

                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.currentTarget.files?.[0];
                      if (!file) return;
                      try {
                        const url = await uploadMutation.mutateAsync(file);
                        setFieldValue('profile_picture', url);
                        uploadDialog.onClose();
                      } finally {
                        if (fileInputRef.current)
                          fileInputRef.current.value = '';
                      }
                    }}
                  />
                </Box>
              </PKDialog>
            </Box>
            {/* confirm + success modals (same behavior as teams) */}
            <NoticeModal
              open={confirmDlg.open}
              onClose={confirmDlg.onClose}
              onSecondary={confirmDlg.onClose}
              secondaryLabel='Cancel'
              onContinue={submitForm}
              continueLabel='Update'
              title='NOTICE!!!'
              loading={isSubmitting || updateUser.isPending}
              message={`Are you sure you want to update ${
                values.username || '[User]'
              } profile`}
            />
            <NoticeModal
              open={successDlg.open}
              onClose={successDlg.onClose}
              onContinue={successDlg.onClose}
              continueLabel='Finish'
              title='NOTICE!!!'
              message={`You have successfully updated ${
                values.username || '[User]'
              } profile`}
              icon={<CheckCircleRounded sx={{ color: '#63db6c' }} />}
            />
          </Form>
        );
      }}
    </Formik>
  );
}