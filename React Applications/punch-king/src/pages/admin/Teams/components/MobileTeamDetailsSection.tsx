import { Box, Button, Skeleton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { punchKingLogo } from '../../../../assets';
import FormikDatePicker from '../../../../components/form/FormikDatePicker';
import FormikSelect from '../../../../components/form/FormikSelect';
import FormikTextField from '../../../../components/form/FormikWhiteTextField';
import MobileImagePickerDialog from '../../../../components/modal/MobileImagePickerDialog';
import NoticeModal from '../../../../components/modal/NoticeModal';
import PKImageDialog from '../../../../components/modal/PkImageDialog';
import { useDisclosure } from '../../../../hooks/useDisclosure';
import { useUploadTeamImage } from '../../../../hooks/useUploadTeamImage';
import { useTeamProfile } from '../hooks/useTeamProfile';
import { useUpdateTeamProfile } from '../hooks/useUpdateTeamProfile';

const schema = Yup.object({
  team_name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email'),
  phone_number: Yup.string(),
  address: Yup.string(),
  country: Yup.string(),
  state: Yup.string(),
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
  coach_1: Yup.string(),
  coach_2: Yup.string(),
  license_number: Yup.string(),
  bio: Yup.string(),
});

type Props = { teamId: number };

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

function MobileTeamDetailsSection({ teamId }: Props) {
  const { data, isLoading, isError } = useTeamProfile(teamId);
  const updateTeam = useUpdateTeamProfile(teamId);
  const uploadMutation = useUploadTeamImage();

  const uploadDialog = useDisclosure(false);
  const certDialog = useDisclosure(false);


  // confirm/success modals (2-step flow)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<
    typeof initialValues | null
  >(null);

  useEffect(() => {
    if (isError) toast.error('Failed to fetch team profile.');
  }, [isError]);

  // after creating hooks:
  useEffect(() => {
    if (updateTeam.isError) toast.error('Failed to update team profile.');
  }, [updateTeam.isError]);

  useEffect(() => {
    if (uploadMutation.isError) toast.error('Failed to upload image.');
  }, [uploadMutation.isError]);

  // ✅ react-query drives the modal transitions — no dangling state
  useEffect(() => {
    if (updateTeam.isSuccess) {
      setConfirmOpen(false);
      setSuccessOpen(true);
    }
  }, [updateTeam.isSuccess]);

  // === Skeleton state while loading ===
  if (isLoading) {
    return (
      <Box sx={{ px: 2, pb: 4 }}>
        <Typography variant='h6' sx={{ fontWeight: 900, color: '#fff', mb: 2 }}>
          TEAM DETAILS
        </Typography>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Skeleton
            variant='rectangular'
            width='100%'
            height={190}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton variant='text' width='60%' />
          <Skeleton
            variant='rectangular'
            height={48}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant='rectangular'
            height={48}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant='rectangular'
            height={48}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant='rectangular'
            height={100}
            sx={{ borderRadius: 1 }}
          />
        </Box>
      </Box>
    );
  }

  const initialValues = {
    team_name: data?.team_name ?? '',
    email: data?.email ?? '',
    phone_number: data?.phone_number ?? '',
    address: data?.address ?? '',
    country: data?.country ?? '',
    state: data?.state ?? '',
    dob: data?.date_of_establishment
      ? dayjs(data.date_of_establishment).format('YYYY-MM-DD')
      : '',
    coach_1: data?.coach_1 ?? '',
    coach_2: data?.coach_2 ?? '',
    license_number: data?.license_number ?? '',
    bio: data?.bio ?? '',
    profile_picture: data?.profile_picture ?? '',
    profile_picture_file: null as File | null,
  };

  return (
    <Box sx={{ px: 2, pb: 4 }}>
      <Typography variant='h6' sx={{ fontWeight: 900, color: '#fff', mb: 1 }}>
        TEAM DETAILS
      </Typography>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, validateForm, setTouched }) => {
          const stateOptions =
            values.country && STATE_OPTIONS[values.country]
              ? STATE_OPTIONS[values.country]
              : [];

          // ⬇️ helper: open Confirm after validating
          const handleOpenConfirm = async () => {
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
            setPendingValues(values);
            setConfirmOpen(true);
          };

          return (
            <Form>
              {/* Avatar & update */}
              <Box sx={{ display: 'grid', gap: 1.25, mb: 2 }}>
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 340,
                    height: 190,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid #3B3B3B',
                    background: '#111',
                    mx: 'auto',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {values.profile_picture ? (
                    <img
                      src={values.profile_picture}
                      alt='team'
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Typography sx={{ color: '#888' }}>No image</Typography>
                  )}
                </Box>

                <Box sx={{ maxWidth: 340, mx: 'auto', textAlign: 'right' }}>
                  <Button
                    variant='text'
                    onClick={uploadDialog.onOpen}
                    sx={{
                      color: '#EFAF00',
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 0,
                    }}
                  >
                    Update
                  </Button>
                </Box>
              </Box>

              {/* Fields – single column for mobile */}
              <Box sx={{ display: 'grid', gap: 1 }}>
                <FormikTextField
                  name='team_name'
                  placeholder='Team name'
                  label='Team name'
                />
                <FormikTextField
                  name='email'
                  placeholder='Email'
                  type='email'
                />
                <FormikTextField
                  name='phone_number'
                  placeholder='Phone number'
                  label='Phone number'
                />
                <Box>
                  <FormikTextField
                    name='license_number'
                    placeholder='License number (when available)'
                    label='License number (when available)'
                  />
                  <Button
                    variant='text'
                    onClick={certDialog.onOpen}
                    sx={{
                      color: '#EFAF00',
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 0,
                      mt: -1,
                    }}
                  >
                    View license certificate
                  </Button>
                </Box>
                <FormikDatePicker
                  name='dob'
                  label='since (year created)'
                  maxDate={dayjs()}
                />
                <FormikTextField
                  name='address'
                  placeholder='Address'
                  label='Address'
                />

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
                  name='coach_1'
                  placeholder='Coach 1'
                  label='Coach 1'
                />
                <FormikTextField
                  name='coach_2'
                  placeholder='Coach 2'
                  label='Coach 2'
                />
                <FormikTextField
                  name='bio'
                  placeholder='Bio'
                  multiline
                  rows={4}
                />
              </Box>

              <Button
                type='button'
                variant='text'
                sx={{
                  color: '#EFAF00',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 0,
                  mt: 1.5,
                }}
                disabled={updateTeam.isPending}
                onClick={handleOpenConfirm}
              >
                Update
              </Button>

              {/* Upload dialog */}
              {/* <PKDialog
                open={uploadDialog.open}
                onClose={uploadDialog.onClose}
                title=''
                actions={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant='contained'
                      disabled={uploadMutation.isPending}
                      sx={{
                        py: 1.1,
                        width: '75%',
                        backgroundColor: '#F6C10A',
                        color: '#000',
                        fontWeight: 700,
                      }}
                    >
                      {uploadMutation.isPending
                        ? 'Uploading…'
                        : 'Upload picture'}
                    </Button>
                  </Box>
                }
                disableCloseWhenBusy={uploadMutation.isPending}
              >
                <Box sx={{ display: 'grid', placeItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 420,
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
                        alt='team'
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: '#666' }}>No image</Typography>
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
                        setFieldValue('profile_picture_file', null);
                        uploadDialog.onClose();
                      } finally {
                        if (fileInputRef.current)
                          fileInputRef.current.value = '';
                      }
                    }}
                  />
                </Box>
              </PKDialog> */}
              <MobileImagePickerDialog
                open={uploadDialog.open}
                onClose={uploadDialog.onClose}
                src={values.profile_picture}
                picking={uploadMutation.isPending}
                onPick={async (file) => {
                  try {
                    const url = await uploadMutation.mutateAsync(file);
                    setFieldValue('profile_picture', url);
                    setFieldValue('profile_picture_file', null);
                    uploadDialog.onClose();
                  } catch {
                    /* toast is already handled via useEffect(uploadMutation.isError) */
                  }
                }}
              />

              {/* Certificate preview (placeholder) */}
              <PKImageDialog
                open={certDialog.open}
                onClose={certDialog.onClose}
                title='View certificate'
                src={punchKingLogo ?? ''}
                frame={false}
                mobileCertificate
              />

              {/* Confirm update */}
              <NoticeModal
                open={confirmOpen}
                onClose={() =>
                  updateTeam.isPending ? null : setConfirmOpen(false)
                }
                onContinue={() => {
                  if (!pendingValues || updateTeam.isPending) return;
                  updateTeam.mutate({
                    ...pendingValues,
                    dob: pendingValues.dob
                      ? dayjs(pendingValues.dob).startOf('day').toISOString()
                      : undefined,
                  });
                }}
                title='NOTICE!!!'
                message={`Are you sure you want to update\n[${
                  values.team_name || 'Team'
                }] profile`}
                continueLabel='Update'
                loading={updateTeam.isPending}
                showCloseText
              />

              {/* Success message */}
              <NoticeModal
                open={successOpen}
                onClose={() => setSuccessOpen(false)}
                onContinue={() => setSuccessOpen(false)}
                title='NOTICE!!!'
                message={`You have successfully updated\n[${
                  values.team_name || 'Team'
                }] profile`}
                continueLabel='Finish'
              />
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}

export default MobileTeamDetailsSection;
