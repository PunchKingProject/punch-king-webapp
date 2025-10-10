import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, IconButton, Skeleton, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import debounce from 'lodash.debounce';
import type { DateRange } from 'react-day-picker';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';

import MetricsDateFilterDrawer from '../Dashboard/components/MetricsDateFilterDrawer';
import { ScrollableSection } from '../components/ScrollableSection';
import MobileImagePickerDialog from '../../../components/modal/MobileImagePickerDialog';
import NoticeModal from '../../../components/modal/NoticeModal';
import PKImageDialog from '../../../components/modal/PkImageDialog';
import { punchKingLogo } from '../../../assets';
import { useSingleUserStats } from './hooks/useSingleUserStats';
import { useUserProfile } from './hooks/useUserProfile';
import { useUpdateUserProfile } from './hooks/useUpdateUserProfile';
import { useUploadUserImage } from './hooks/useUploadUserImage';
import { useUserPurchaseHistory } from './hooks/useUserPurchaseHistory';
import { purchaseFieldData, sponsorFieldData, type PurchaseRow, type SponsorRow } from './ui/fields';
import { useSponsorVoteHistory } from './hooks/useSponsorVoteHistory';
import { colors } from '../../../theme/colors';
import FormikTextField from '../../../components/form/FormikWhiteTextField';
import FormikSelect from '../../../components/form/FormikSelect';
import FormikDatePicker from '../../../components/form/FormikDatePicker';
import type { UpdateUserPayload } from './api/users.types';

// under schema or near top of file
const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const COUNTRY_OPTIONS = [
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'United States', label: 'United States' },
];

const STATE_OPTIONS: Record<string, { value: string; label: string }[]> = {
  Nigeria: [ 'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara' ].map(s => ({ value: s, label: s })),
  Ghana: [ 'Ashanti','Brong-Ahafo','Central','Eastern','Greater Accra','Northern','Upper East','Upper West','Volta','Western' ].map(s => ({ value: s, label: s })),
  Kenya: [ 'Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa','Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos','Makueni','Mandera','Marsabit','Meru','Migori','Mombasa','Murang’a','Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya','Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia','Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot' ].map(s => ({ value: s, label: s })),
  'South Africa': [ 'Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','North West','Northern Cape','Western Cape' ].map(s => ({ value: s, label: s })),
  'United States': [ 'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming' ].map(s => ({ value: s, label: s })),
};

type FormValues = {
  username: string;
  email: string;
  phone_number: string; // string ('' when empty)
  address: string;
  country: string;
  state: string;
  dob: string; // 'YYYY-MM-DD' or ''
  gender: string;
  bio: string;
  profile_picture: string;
};




const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');
const formatRangeLabel = (from?: Date, to?: Date) => {
  if (!from || !to) return 'Last 30 days';
  return `${dayjs(from).format('MMM D')} – ${dayjs(to).format('MMM D, YYYY')}`;
};

const schema = Yup.object({
  username: Yup.string(),
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
  gender: Yup.string(),
  bio: Yup.string(),
});

export default function MobileUsersDetailsPage() {
  const p = useParams<{ sponsor_id?: string }>();
  const sponsor_id = p.sponsor_id ? Number(p.sponsor_id) : 0;

  // ======= Metrics + History are date-scoped here (as in your desktop page)
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;
  const start_date = fmt(start);
  const end_date = fmt(end);

  const dayPickerRange: DateRange | undefined = {
    from: start.toDate(),
    to: end.toDate(),
  };

  // ======= Top metrics (single user)
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsErr,
  } = useSingleUserStats({
    sponsor_id,
    start_date,
    end_date,
  });
  useEffect(() => {
    if (statsErr) toast.error('Failed to fetch user stats.');
  }, [statsErr]);

  const metricCards = [
    {
      title: 'SPONSOR UNITS',
      total: stats?.sponsorship_balance ?? 0,
      percentage: 0,
      status: true,
    },
    {
      title: 'CHIP VOLUME',
      total: stats?.total_amount_spent ?? 0,
      percentage: 0,
      status: true,
    },
    {
      title: 'TEAMS',
      total: stats?.distinct_teams_sponsored ?? 0,
      percentage: 0,
      status: true,
    },
  ];

  // scroll “peek” effect
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const secondCardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    secondCardRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
    });
  }, []);

  // ======= Profile
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileErr,
  } = useUserProfile(sponsor_id);
  useEffect(() => {
    if (profileErr) toast.error('Failed to fetch user profile.');
  }, [profileErr]);

  const updateUser = useUpdateUserProfile(sponsor_id);
  const uploadImage = useUploadUserImage();
  const uploadDialog = useState(false);
  const [uploadOpen, setUploadOpen] = uploadDialog;

  // confirm + success modals
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);

  useEffect(() => {
    if (updateUser.isError) toast.error('Failed to update user profile.');
  }, [updateUser.isError]);
  useEffect(() => {
    if (uploadImage.isError) toast.error('Failed to upload image.');
  }, [uploadImage.isError]);
  useEffect(() => {
    if (updateUser.isSuccess) {
      setConfirmOpen(false);
      setSuccessOpen(true);
    }
  }, [updateUser.isSuccess]);

  // ======= Purchase History (server)
  const [phPage, setPhPage] = useState(1);
  const [phQuery, setPhQuery] = useState('');
  const applyPhSearch = useMemo(
    () => debounce((q: string) => setPhQuery(q), 400),
    []
  );
  useEffect(() => () => applyPhSearch.cancel(), [applyPhSearch]);

  const {
    data: phResp,
    isFetching: phFetching,
    isError: phErr,
  } = useUserPurchaseHistory({
    sponsor_id,
    page: phPage,
    page_size: 10,
    start_date,
    end_date,
    search: phQuery || undefined,
  });
  useEffect(() => {
    if (phErr) toast.error('Failed to fetch sponsorship purchase history.');
  }, [phErr]);

  const phRows: PurchaseRow[] = useMemo(() => {
    const list = phResp?.data ?? [];
    return list.map((it) => {
      const d = dayjs(it.payment_date);
      const source =
        it.payment_from?.bank_name ||
        it.payment_from?.account_name ||
        it.payment_from?.account_number ||
        it.payment_into?.bank_name ||
        it.payment_into?.account_name ||
        it.payment_into?.account_number ||
        '—';
      return {
        value: new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: 'NGN',
          maximumFractionDigits: 2,
        }).format(it.payment_amount),
        volume: it.sponsorship_points,
        date: d.format('YYYY-MM-DD'),
        time: d.format('hh:mma'),
        source,
      };
    });
  }, [phResp]);

  const phTotal = phResp?.metadata?.total_count ?? 0;
  const phHasMore = (phResp?.data.length ?? 0) < phTotal;

  // ======= Sponsorship History (server)
  const [shPage, setShPage] = useState(1);
  const [shQuery, setShQuery] = useState('');
  const applyShSearch = useMemo(
    () => debounce((q: string) => setShQuery(q), 400),
    []
  );
  useEffect(() => () => applyShSearch.cancel(), [applyShSearch]);

  const {
    data: shResp,
    isFetching: shFetching,
    isError: shErr,
  } = useSponsorVoteHistory({
    sponsor_id,
    page: shPage,
    page_size: 10,
    start_date,
    end_date,
    search: shQuery || undefined,
  });
  useEffect(() => {
    if (shErr) toast.error('Failed to fetch sponsorship history.');
  }, [shErr]);

  const shRows: SponsorRow[] = useMemo(() => {
    const list = shResp?.data ?? [];
    return list.map((it) => {
      const d = dayjs(it.created_at);
      return {
        team_name: it.team_name,
        value: new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: 'NGN',
          maximumFractionDigits: 2,
        }).format(it.equivalent_amount),
        volume: it.units,
        date: d.format('YYYY-MM-DD'),
        time: d.format('hh:mma'),
      };
    });
  }, [shResp]);

  const shTotal = shResp?.metadata?.total_count ?? 0;
  const shHasMore = (shResp?.data.length ?? 0) < shTotal;

  const toUpdatePayload = (v: FormValues): UpdateUserPayload => ({
    phone_number: v.phone_number || undefined,
    address: v.address || undefined,
    country: v.country || undefined,
    state: v.state || undefined,
    dob: v.dob ? dayjs(v.dob).startOf('day').toISOString() : undefined,
    gender: v.gender || undefined,
    bio: v.bio || undefined,
    profile_picture: v.profile_picture || undefined,
  });


  // ======= Render
  return (
    <>
      {/* Header: title + date filter that scopes metrics + lists */}
      <Box
        sx={{
          px: 2,
          pt: 1,
          pb: 0.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='mediumHeaderBold' sx={{ color: colors.Freeze }}>
          Users Dashboard / USER DETAILS
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant='bodyTextMilkDefault'
            sx={{ color: colors.Freeze, opacity: 0.8 }}
          >
            {formatRangeLabel(dayPickerRange?.from, dayPickerRange?.to)}
          </Typography>
          <MetricsDateFilterDrawer
            range={dayPickerRange}
            title='Filter user metrics'
            onApply={(r) => {
              if (!r?.from || !r.to) return;
              setRange([dayjs(r.from), dayjs(r.to)]);
              // reset pagers on date change
              setPhPage(1);
              setShPage(1);
            }}
          />
        </Box>
      </Box>

      {/* Sliding cards */}
      <Box
        ref={scrollerRef}
        sx={{
          display: 'flex',
          overflow: 'auto',
          flexDirection: 'row',
          width: '100%',
          gap: '40px',
          px: 2,
          py: 1,
        }}
      >
        {metricCards.map((m, i) => (
          <Box
            key={m.title}
            ref={i === 1 ? secondCardRef : null}
            sx={{
              background: colors.Card,
              minWidth: '230px',
              width: '110vw',
              maxWidth: '489px',
              border: '1px solid #3B3B3B',
              height: '135px',
              borderRadius: '10px',
              boxShadow: '2px 2px 10px 2px #2B2B2BB0',
              p: '20px 10px',
              gap: '25px',
              display: 'flex',
              flexDirection: 'column',
              opacity: statsLoading ? 0.6 : 1,
            }}
          >
            <Typography
              variant='mediumHeaderBold'
              component='p'
              sx={{ textTransform: 'uppercase', color: colors.Freeze }}
            >
              {m.title}
            </Typography>
            <Typography
              variant='bodyTextMilkDefault'
              component='p'
              sx={{ fontWeight: 700, color: colors.Freeze }}
            >
              {m.total}
            </Typography>
            <Box sx={{ width: '100%', textAlign: 'right' }}>
              <Typography
                variant='bodyTextMilkDefault'
                component='p'
                sx={{
                  fontWeight: 500,
                  color: m.status ? colors.Success : colors.Caution,
                }}
              >
                {`you have ${m.percentage ?? 0}% ${
                  m.status ? 'climbed' : 'dip'
                }`}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ===== PROFILE EDIT (single column like MobileTeamDetails) ===== */}
      <Box sx={{ px: 2, pb: 4 }}>
        <Typography variant='h6' sx={{ fontWeight: 900, color: '#fff', mb: 1 }}>
          TEAM DETAILS
        </Typography>

        {profileLoading ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Skeleton
              variant='rectangular'
              width='100%'
              height={190}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton variant='text' width='60%' />
            {[...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                variant='rectangular'
                height={48}
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>
        ) : (
          <Formik
            enableReinitialize
            initialValues={{
              username: profile?.username ?? '',
              email: profile?.email ?? '',
              phone_number: profile?.phone_number ?? '',
              address: profile?.address ?? '',
              country: profile?.country ?? '',
              state: profile?.state ?? '',
              dob: profile?.dob ? dayjs(profile.dob).format('YYYY-MM-DD') : '',
              gender: profile?.gender ?? '',
              bio: profile?.bio ?? '',
              profile_picture: profile?.profile_picture ?? '',
            }}
            validationSchema={schema}
            onSubmit={() => {}}
          >
            {({ values, setFieldValue, validateForm, setTouched }) => {
              const openConfirm = async () => {
                const errors = await validateForm();
                if (Object.keys(errors).length) {
                  setTouched(
                    Object.keys(errors).reduce<Record<string, boolean>>(
                      (acc, k) => {
                        acc[k] = true;
                        return acc;
                      },
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
                  {/* Avatar */}
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
                          alt='user'
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
                        onClick={() => setUploadOpen(true)}
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

                  {/* Simple inputs – reuse your existing form components if you prefer */}
                  <Box sx={{ display: 'grid', gap: 1 }}>
                    {/* Replace these with your FormikTextField / FormikSelect if available */}
                    {/* Example quick fields: */}

                    <FormikTextField
                      name='username'
                      placeholder='User name'
                      label='User name'
                    />

                    <FormikDatePicker
                      name='dob'
                      label='DOB'
                      maxDate={dayjs()}
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
                      options={
                        values.country && STATE_OPTIONS[values.country]
                          ? STATE_OPTIONS[values.country]
                          : []
                      }
                      disabled={!values.country}
                    />

                    <FormikTextField
                      name='address'
                      placeholder='Address'
                      label='Address'
                    />

                    <FormikSelect
                      name='gender'
                      label='Gender'
                      placeholder='Select gender'
                      options={GENDER_OPTIONS}
                    />

                    <FormikTextField
                      name='bio'
                      placeholder='Bio'
                      label='Bio'
                      multiline
                      rows={4}
                    />

                    {/* Keep email/phone editable if you allow it on desktop; else show but disable */}
                    <FormikTextField
                      name='phone_number'
                      placeholder='Phone number'
                      label='Phone number'
                    />
                    <FormikTextField
                      name='email'
                      placeholder='Email'
                      type='email'
                      label='Email'
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
                    disabled={updateUser.isPending}
                    onClick={openConfirm}
                  >
                    Update
                  </Button>

                  {/* Upload image dialog */}
                  <MobileImagePickerDialog
                    open={uploadOpen}
                    onClose={() => setUploadOpen(false)}
                    src={values.profile_picture}
                    picking={uploadImage.isPending}
                    onPick={async (file) => {
                      try {
                        const url = await uploadImage.mutateAsync(file);
                        setFieldValue('profile_picture', url);
                        setUploadOpen(false);
                      } catch {
                        /* toast already handled */
                      }
                    }}
                  />

                  {/* Certificate preview – optional parity */}
                  <PKImageDialog
                    open={false}
                    onClose={() => {}}
                    title='View certificate'
                    src={punchKingLogo ?? ''}
                    frame={false}
                    mobileCertificate
                  />

                  {/* Confirm update */}
                  <NoticeModal
                    open={confirmOpen}
                    onClose={() =>
                      updateUser.isPending ? null : setConfirmOpen(false)
                    }
                    onContinue={() => {
                     if (!pendingValues || updateUser.isPending) return;
                     updateUser.mutate(toUpdatePayload(pendingValues));
                    }}
                    title='NOTICE!!!'
                    message={`Are you sure you want to update\n[${
                      pendingValues?.username || 'User'
                    }] profile`}
                    continueLabel='Update'
                    loading={updateUser.isPending}
                    showCloseText
                  />

                  {/* Success */}
                  <NoticeModal
                    open={successOpen}
                    onClose={() => setSuccessOpen(false)}
                    onContinue={() => setSuccessOpen(false)}
                    title='NOTICE!!!'
                    message={`You have successfully updated\n[${
                      pendingValues?.username || 'User'
                    }] profile`}
                    continueLabel='Finish'
                  />
                </Form>
              );
            }}
          </Formik>
        )}
      </Box>

      {/* ===== PURCHASE HISTORY (server list) ===== */}
      <ScrollableSection<PurchaseRow>
        title='SPONSORSHIP purchase history'
        items={phRows}
        fields={purchaseFieldData}
        searchKeys={['value', 'volume', 'date', 'time', 'source']}
        searchPlaceholder='Search purchases...'
        serverSearch
        loading={phFetching && phRows.length === 0}
        hasMore={phHasMore}
        onSearchChange={(q) => {
          applyPhSearch(q);
          setPhPage(1);
        }}
        onLoadMore={() => setPhPage((p) => p + 1)}
      />

      {/* ===== SPONSORSHIP HISTORY (server list) ===== */}
      <ScrollableSection<SponsorRow>
        title='SPONSORSHIP history'
        items={shRows}
        fields={sponsorFieldData}
        searchKeys={['team_name', 'value', 'volume', 'date', 'time']}
        searchPlaceholder='Search sponsorships...'
        serverSearch
        loading={shFetching && shRows.length === 0}
        hasMore={shHasMore}
        onSearchChange={(q) => {
          applyShSearch(q);
          setShPage(1);
        }}
        onLoadMore={() => setShPage((p) => p + 1)}
        renderRight={
          (/* row */) => (
            <IconButton aria-label='View' sx={{ color: '#fff', mt: 0.5 }}>
              <VisibilityRounded />
            </IconButton>
          )
        }
      />
    </>
  );
}
