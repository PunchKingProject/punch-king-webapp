// pages/sign-up/steps/Step4.tsx
import ImageIcon from '@mui/icons-material/Image';
import { Box, CircularProgress, Typography } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FailureIcon from '../../../assets/failureIcon.svg?react';
import HelpIcon from '../../../assets/helpIcon.svg?react';
import SuccessIcon from '../../../assets/modalSuccess.svg?react';
import { customFetch } from '../../../Axios'; // your axios instance
import CustomAuthButton from '../../../components/buttons/CustomAuthButton';
import { useAppDispatch } from '../../../hooks';
import { mergeDraft } from '../../../store/registration.slice';

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export default function Step4() {
  const dispatch = useAppDispatch();
  // const [sp] = useSearchParams();
  const navigate = useNavigate();

  // const rid = sp.get('rid') || localStorage.getItem('pk_rid') || '';
  // const flow = (sp.get('flow') || 'user') as 'user' | 'team';

  // const params = new URLSearchParams();
  // if (rid) params.set('rid', rid);
  // params.set('flow', flow);

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const openPicker = () => fileInputRef.current?.click();

  function validate(f?: File) {
    if (!f) return 'No file selected.';
    if (!ACCEPT.includes(f.type))
      return 'This picture format is either not supported or too large';
    if (f.size > MAX_SIZE_BYTES)
      return 'This picture format is either not supported or too large';
    return null;
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    const msg = validate(f || undefined);
    if (msg) {
      setError(msg);
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    if (!f) return;
    setError(null);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f)); // local preview
  }

  const hasImage = !!previewUrl && !error;

  // Save the current (local) preview into Redux so the Preview page can render it,
  // even before uploading to the server.
  // function persistPreviewToDraft() {
  //   if (hasImage) {
  //     dispatch(mergeDraft({ step4: { profile_picture: previewUrl! } }));
  //   }
  // }

  async function onFinish() {
    if (!file) return;
    try {
      setLoading(true);

      // Upload avatar to server (rid is added by your Axios interceptor)
      const form = new FormData();
      form.append('file', file);

      const resp = await customFetch.post('/img/', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Store the server URL in Redux draft

      console.log(resp.data.data)
      const serverUrl = resp?.data?.data ?? previewUrl!;
      dispatch(mergeDraft({ step4: { profile_picture: serverUrl } }));

      // Optionally tell the backend to advance step:
      // await customFetch.post('/registration/advance', { step: 4 });

      // navigate(`/sign-up/complete?${params.toString()}`);
      
      toast.success('Image url generated and stored');
            navigate(`/sign-up/complete`);
    } catch (e) {
      console.log(e)
      toast.error('Upload failed. Please try again.');
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // function onPreview() {
  //   if (!hasImage) return;
  //   persistPreviewToDraft();
  //   navigate(`/sign-up/complete`);
  // }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 420,
        mx: 'auto',
        px: 2,
        pt: 2,
        position: 'relative',
      }}
    >
      {/* Image frame / preview */}
      <Box
        sx={{
          position: 'relative',
          mx: 'auto',
          width: 240,
          height: 160,
          borderRadius: 2,
          border: '3px solid #9E9E9E',
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
          mb: 1.5,
          bgcolor: 'transparent',
        }}
        aria-busy={loading}
      >
        {hasImage ? (
          <Box
            component='img'
            src={previewUrl!}
            alt='Selected avatar'
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <ImageIcon sx={{ fontSize: 72, color: '#9E9E9E' }} />
        )}

        {/* Upload overlay spinner */}
        {loading && hasImage && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(1px)',
              zIndex: 2,
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>

      {/* Badge (top-right) */}
      <Box
        sx={{
          position: 'absolute',
          right: '0px',
          top: '0px',
          color: error ? '#F6C10A' : hasImage ? '#63db6c' : '#F6C10A',
          bgcolor: 'rgba(0,0,0,.2)',
          borderRadius: '50%',
          p: 0.3,

          lineHeight: 0,
          zIndex: 3,
        }}
      >
        <Box
          sx={{
            '& svg': { width: 20, height: 20 },
          }}
        >
          {error ? <FailureIcon /> : hasImage ? <SuccessIcon /> : <HelpIcon />}
        </Box>
      </Box>

      {/* Error message */}
      {error && (
        <Typography
          variant='caption'
          sx={{
            color: '#F6C10A',
            display: 'block',
            textAlign: 'center',
            mb: 1,
          }}
        >
          {error}
        </Typography>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type='file'
        accept={ACCEPT.join(',')}
        style={{ display: 'none' }}
        onChange={onChange}
      />

      {/* Upload / Change button */}
      <Box textAlign='center' mb={2}>
        <CustomAuthButton
          onClick={openPicker}
          variant='contained'
          fullWidth={false}
          sx={{
            // backgroundColor: '#F6C10A',
            // color: '#000',
            // textTransform: 'none',
            width: 'contained',
            fontWeight: 700,
            px: 3,
            // '&:hover': { backgroundColor: '#e0ae07' },
          }}
        >
          {hasImage ? 'Change picture' : 'Upload'}
        </CustomAuthButton>
      </Box>

      {/* Actions */}
      <Box
        display='flex'
        flexDirection='column'
        gap={1.5}
        sx={{
          mb: 3,
        }}
      >
        {/* Finish (upload to server, then preview/complete) */}
        <CustomAuthButton
          onClick={onFinish}
          disabled={!hasImage || loading}
          variant='contained'
          sx={{
            // backgroundColor: '#6f6f6f',
            // color: '#000',
            // textTransform: 'none',
            // fontWeight: 700,
            // py: 1.1,
            ...(hasImage &&
              !loading && {
                backgroundColor: '#F6C10A',
                '&:hover': { backgroundColor: '#e0ae07' },
              }),
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={18} sx={{ color: '#000', mr: 1 }} />
              Please wait...
            </>
          ) : (
            'Preview'
          )}
        </CustomAuthButton>
        {/* Preview screen (no upload required) */}
        {/* <Button
          onClick={onPreview}
          disabled={!hasImage}
          variant='contained'
          sx={{
            backgroundColor: '#F6C10A',
            color: '#000',
            textTransform: 'none',
            fontWeight: 700,
            py: 1.1,
            '&:disabled': { backgroundColor: '#6f6f6f', color: '#000' },
          }}
        >
          Preview
        </Button> */}
        {/* Back to step 3 */}
        <CustomAuthButton
          onClick={() => navigate(`/sign-up/step3`)}
          variant='contained'
          // sx={{
          //   backgroundColor: '#F6C10A',
          //   color: '#000',
          //   textTransform: 'none',
          //   fontWeight: 700,
          //   py: 1.1,
          // }}
        >
          Back
        </CustomAuthButton>
      </Box>
    </Box>
  );
}
