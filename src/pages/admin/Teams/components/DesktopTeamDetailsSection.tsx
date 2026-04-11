// pages/admin/Teams/components/TeamDetailsSection.tsx
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import { Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Form, Formik } from 'formik';
import { useRef } from 'react';
import * as Yup from 'yup';
import { punchKingLogo } from '../../../../assets';
import QuestionModalIcon from '../../../../assets/modalQuestionIcon.svg?react';
import CustomAuthButton from '../../../../components/buttons/CustomAuthButton.tsx';
import FormikDatePicker from '../../../../components/form/FormikDatePicker.tsx';
import FormikSelect from '../../../../components/form/FormikSelect.tsx';
import FormikTextField from '../../../../components/form/FormikWhiteTextField.tsx';
import NoticeModal from '../../../../components/modal/NoticeModal.tsx';
import PKDialog from '../../../../components/modal/PkDialog.tsx';
import PKImageDialog from '../../../../components/modal/PkImageDialog.tsx';
import { useDisclosure } from '../../../../hooks/useDisclosure.ts';
import { useUploadTeamImage } from '../../../../hooks/useUploadTeamImage.ts';
import { colors } from '../../../../theme/colors.ts';
import { useTeamProfile } from '../hooks/useTeamProfile.ts';
import { useUpdateTeamProfile } from '../hooks/useUpdateTeamProfile.tsx';
dayjs.extend(isSameOrBefore);

// adjust path to where you cplaced these:

type Props = { teamId: number };

const schema = Yup.object({
  team_name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email'),
  phone_number: Yup.string(),
  address: Yup.string(),
  country: Yup.string(),
  state: Yup.string(),
  dob: Yup.string()
    // optional: enforce valid date & not in the future
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

export default function TeamDetailsSection({ teamId }: Props) {
  const { data, isLoading, isError } = useTeamProfile(teamId);

  const uploadMutation = useUploadTeamImage();

  const uploadDialog = useDisclosure(false);
  const certDialog = useDisclosure(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateTeam = useUpdateTeamProfile(teamId);

  const confirmDlg = useDisclosure(false);
  const successDlg = useDisclosure(false);

  // Prepare initial values when data arrives
  const initialValues = {
    team_name: data?.team_name ?? '',
    email: data?.email ?? '',
    phone_number: data?.phone_number ?? '',
    address: data?.address ?? '',
    country: data?.country ?? '',
    state: data?.state ?? '',
    // ensure yyyy-MM-dd for <input type="date">
    dob: data?.date_of_establishment
      ? dayjs(data.date_of_establishment).format('YYYY-MM-DD')
      : '',
    coach_1: data?.coach_1 ?? '',
    coach_2: data?.coach_2 ?? '',
    license_number: data?.license_number ?? '',
    bio: data?.bio ?? '',
    profile_picture: data?.profile_picture ?? '',
    // local-only field for uploads
    profile_picture_file: null as File | null,
  };

  if (isLoading)
    return <Typography sx={{ px: 3, py: 2 }}>Loading team…</Typography>;
  if (isError)
    return <Typography sx={{ px: 3, py: 2 }}>Failed to load team.</Typography>;

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values, helpers) => {
          updateTeam.mutate(
            {
              ...values,
              dob: values.dob
                ? dayjs(values.dob).startOf('day').toISOString()
                : undefined,
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
          setFieldValue,
          values,
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
                  sx={{ fontWeight: 900, color: '#fff' }}
                >
                  TEAM DETAILS
                </Typography>
                {/* LEFT: Avatar / Preview + upload */}
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
                        alt='team'
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          border: '15px solid grey',
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: '#aaa' }}>No image</Typography>
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
                      mt: -2 
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
                    >
                      Update
                    </Button>
                  </Box>
                </Box>

                {/* RIGHT: Form fields */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px 30px',

                    maxWidth: '800px',
                    mx: 'auto',
                  }}
                >
                  {/* Top row */}

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
                      placeholder='License number'
                      label='License number (when activated)'
                    />

                    <Button
                      variant='text'
                      onClick={() => {
                        // open certificate viewer when available
                        // e.g., navigate(`/admin/licensing/certificate/${teamId}`)
                        certDialog.onOpen();
                      }}
                      sx={{
                        color: '#EFAF00',
                        fontWeight: 700,
                        display: 'block',
                        textTransform: 'none',
                        px: 0,
                        mt: -2,
                        ml: 'auto',
                      }}
                    >
                      View Licence certificate
                    </Button>
                  </Box>

                  <FormikTextField
                    name='address'
                    placeholder='Address'
                    label='Address'
                  />
                  {/* DOB (DatePicker) */}
                  <FormikDatePicker
                    name='dob'
                    label='Date of Birth'
                    maxDate={dayjs()}
                  />
                  {/* Country / State dependent selects */}
                  <FormikSelect
                    name='country'
                    label='Country'
                    placeholder='Select country'
                    options={COUNTRY_OPTIONS}
                    onChangeOverride={(v) => {
                      setFieldValue('country', v);
                      setFieldValue('state', ''); // reset state when country changes
                    }}
                  />
                  <FormikSelect
                    name='state'
                    label='State / Region'
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
                </Box>

                <Box
                  sx={{
                    maxWidth: '800px',
                    mx: 'auto',
                  }}
                >
                  <FormikTextField
                    name='bio'
                    placeholder='Bio'
                    multiline
                    rows={4}
                    sx={{ mt: 1 }}
                  />
                  <Button
                    sx={{
                      display: 'block',
                      marginLeft: 'auto',
                    }}
                    type='button'
                    variant='contained'
                    onClick={async () => {
                      // validate first; only show confirm if valid
                      const errors = await validateForm();

                      if (Object.keys(errors).length) {
                        // mark all touched so errors show
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
                  >
                    Update
                  </Button>
                </Box>

                {/* Upload picture (uses PKDialog) */}
                <PKDialog
                  open={uploadDialog.open}
                  onClose={uploadDialog.onClose}
                  title=''
                  actions={
                    <Box
                      sx={{
                        display: 'flex',
                        width: '100%',
                        border: '2px solid red',
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
                          alt='team'
                          style={{
                            width: '100%',

                            height: '100%',
                            objectFit: 'cover',
                            border: `15px solid ${colors.Freeze}`,
                          }}
                        />
                      ) : (
                        <Typography sx={{ color: '#666' }}>No image</Typography>
                      )}
                    </Box>

                    {/* Hidden chooser */}
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
                </PKDialog>

                {/* View certificate (uses the reusable image dialog) */}
                <PKImageDialog
                  open={certDialog.open}
                  onClose={certDialog.onClose}
                  title='View certificate'
                  src={punchKingLogo ?? ''}
                  frame
                />
              </Box>

              {/* Confirm dialog */}
              <NoticeModal
                open={confirmDlg.open}
                onClose={confirmDlg.onClose}
                onSecondary={confirmDlg.onClose}
                secondaryLabel='Cancel'
                onContinue={submitForm}
                continueLabel='Update'
                title='NOTICE!!!'
                loading={isSubmitting || updateTeam.isPending}
                message={`Are you sure you want to update ${
                  values.team_name || '[Team name]'
                } profile`}
                icon={<QuestionModalIcon />}
              />

              <NoticeModal
                open={successDlg.open}
                onClose={successDlg.onClose}
                onContinue={successDlg.onClose}
                continueLabel='Finish'
                title='NOTICE!!!'
                message={`You have successfully updated ${
                  values.team_name || '[Team name]'
                } profile`}
                icon={<CheckCircleRounded sx={{ color: '#63db6c' }} />}
              />
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
