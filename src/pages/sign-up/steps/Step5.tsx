// pages/sign-up/steps/Step5.tsx
import VideoFileIcon from '@mui/icons-material/VideoFile';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { customFetch } from '../../../Axios.ts';
import CustomAuthButton from '../../../components/buttons/CustomAuthButton.tsx';
import { GoldSelect, GoldTextField } from '../../../components/form/GoldInput.tsx';
import NoticeModal from '../../../components/modal/NoticeModal.tsx';
import { useAppDispatch } from '../../../hooks.ts';
import { clearRegistrationDraft } from '../../../store/registration.slice.ts';

const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB limit
const VIDEO_ACCEPTS = ['video/mp4', 'video/mov', 'video/webm', 'image/jpeg', 'image/png', 'image/jpg'];

const validationSchema = Yup.object({
  title: Yup.string().required('Required'),
  caption: Yup.string().required('Required'),
  boxer_name: Yup.string().required('Required'),
  weight_class: Yup.string()
    .oneOf(
      [
        'lightweight',
        'welterweight',
        'middleweight',
        'others'
      ],
      'Select a valid weight class.'
    )
    .required('Required'),
  boxer_weight_kg: Yup.number().required('Required').positive('Must be positive'),
  sparring_location: Yup.string().required('Required'),
  shorts_color: Yup.string().required('Required'),
  glove_color: Yup.string().required('Required'),
});

export default function Step5() {
  const dispatch = useAppDispatch();
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const rid = sp.get('rid') || localStorage.getItem('pk_rid') || '';
  const flow = sp.get('flow') || 'team';

  const params = new URLSearchParams();
  if (rid) params.set('rid', rid);
  params.set('flow', flow);

  const [modalOpen, setModalOpen] = React.useState(true);
  const [file, setFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const initialValues = {
    title: '',
    caption: '',
    boxer_name: '',
    weight_class: '',
    boxer_weight_kg: '',
    sparring_location: '',
    shorts_color: '',
    glove_color: '',
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!VIDEO_ACCEPTS.includes(f.type) && !f.name.match(/\.(mp4|mov|webm|jpg|jpeg|png)$/i)) {
      setFileError('Unsupported file format. Please upload a valid video or image.');
      setFile(null);
      return;
    }
    if (f.size > MAX_VIDEO_SIZE) {
      setFileError('File size exceeds the 10MB limit.');
      setFile(null);
      return;
    }
    setFileError(null);
    setFile(f);
  };

  const handleSubmit = async (values: typeof initialValues) => {
    if (!file) {
      setFileError('Please upload your mandatory debut video or catalogue content.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('caption', values.caption);
      formData.append('category', 'Training');
      formData.append('boxer_name', values.boxer_name);
      formData.append('weight_class', values.weight_class);
      formData.append('boxer_weight_kg', String(values.boxer_weight_kg));
      formData.append('sparring_location', values.sparring_location);
      formData.append('shorts_color', values.shorts_color);
      formData.append('glove_color', values.glove_color);
      formData.append('file', file);

      // Submit via standard post route
      await customFetch.post('/post/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Registration and debut content successfully completed!');
      localStorage.removeItem('pk_registration_draft');
      dispatch(clearRegistrationDraft());

      navigate(`/welcome?${params.toString()}`, { replace: true });
    } catch (err: any) {
      console.error(err);
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to submit fighter content. Please try again.';
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NoticeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onContinue={() => setModalOpen(false)}
        title='MANDATORY DEBUT CONTENT'
        message='To complete your team verification and registration, please provide your fighter details and upload your initial video or catalogue post (Max 10MB).'
        continueLabel='Got It!'
      />

      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
          px: 2,
          py: 4,
        }}
      >
        <Typography variant='h5' fontWeight={800} color='white' textAlign='center' mb={3}>
          Fighter & Debut Content Setup
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty }) => (
            <Form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <GoldTextField name='title' placeholder='Post Title (e.g., Intro Sparring Session)' />
              <GoldTextField name='caption' placeholder='Caption / Description' multiline rows={3} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <GoldTextField name='boxer_name' placeholder='Boxer name' />
                <GoldSelect
                  name='weight_class'
                  placeholder='Weight class'
                  options={[
                    { label: 'Lightweight – up to 61.23kg / 135lbs', value: 'lightweight' },
                    { label: 'Welterweight – up to 66.68kg / 147lbs', value: 'welterweight' },
                    { label: 'Middleweight – up to 72.57kg / 160lbs', value: 'middleweight' },
                    { label: 'Other Categories – Uncategorized Weights', value: 'others' },
                  ]}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <GoldTextField name='boxer_weight_kg' placeholder='Actual boxer weight (kg)' type='number' />
                <GoldTextField name='sparring_location' placeholder='Sparring / Gym Location' />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <GoldTextField name='shorts_color' placeholder='Boxer shorts/clothing colour' />
                <GoldTextField name='glove_color' placeholder='Glove Color' />
              </Box>

              {/* File Upload Box */}
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: '2px dashed #EFAF00',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: 'rgba(239,175,0,0.03)',
                  '&:hover': { bgcolor: 'rgba(239,175,0,0.08)' },
                }}
              >
                <VideoFileIcon sx={{ fontSize: 48, color: '#EFAF00', mb: 1 }} />
                <Typography sx={{ color: 'white', fontWeight: 600 }}>
                  {file ? file.name : 'Click to upload debut video or catalogue media'}
                </Typography>
                <Typography variant='caption' sx={{ color: '#A2A2A2' }}>
                  Supports MP4, MOV, WEBM, JPG, PNG (Max 10MB)
                </Typography>
              </Box>

              {fileError && (
                <Typography variant='caption' sx={{ color: '#F6C10A', textAlign: 'center' }}>
                  {fileError}
                </Typography>
              )}

              <input
                ref={fileInputRef}
                type='file'
                accept='video/*,image/*'
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <Box display='flex' gap={2} mt={2}>
                <CustomAuthButton
                  onClick={() => navigate(`/sign-up/step4?${params.toString()}`)}
                  variant='contained'
                  fullWidth
                >
                  Back
                </CustomAuthButton>

                <CustomAuthButton
                  type='submit'
                  disabled={!file || loading}
                  variant='contained'
                  fullWidth
                  sx={{
                    backgroundColor: '#F6C10A',
                    color: '#000',
                    fontWeight: 700,
                    '&:hover': { backgroundColor: '#e0ae07' },
                    '&:disabled': { backgroundColor: '#6f6f6f', color: '#000' },
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={18} sx={{ color: '#000', mr: file ? 1 : 0 }} />
                      Please wait...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </CustomAuthButton>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
}