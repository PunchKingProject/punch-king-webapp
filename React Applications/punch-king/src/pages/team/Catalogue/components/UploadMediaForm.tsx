import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { uploadTeamImage } from '../../../../api/media'; // <-- use your provided util
import WarningIcon from '../../../../assets/modalQuestionIcon.svg?react';
import SuccessIcon from '../../../../assets/modalSuccess.svg?react';
import FormikTextarea from '../../../../components/form/FormikTextarea';
import FormikTextField from '../../../../components/form/FormikTextField';
import NoticeModal from '../../../../components/modal/NoticeModal';
import { useDisclosure } from '../../../../hooks/useDisclosure';
import ROUTES from '../../../../routes/routePath';
import { getErrorMessage } from '../../../../utils/error/error';
import { usePostStats } from '../../Catalogue/hooks/usePostStats';
import { useUploadPost } from '../hooks/useUploadPost';

const MAX_POSTS = 5;

const gold = '#f0c040';

const schema = Yup.object({
  title: Yup.string()
    .trim()
    .min(2, 'Too short')
    .max(120, 'Too long')
    .required('Title is required'),
  caption: Yup.string()
    .trim()
    .min(2, 'Too short')
    .max(2000, 'Too long')
    .required('Caption is required'),
  file: Yup.mixed<File>()
    .required('Please choose a file')
    .test('file-type', 'Only images or videos are allowed', (file) =>
      file ? /^image\/|^video\//.test(file.type) : false
    ),
});

type Values = {
  title: string;
  caption: string;
  file: File | null;
};

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function UploadMediaForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadPct, setUploadPct] = useState<number | null>(null);

  const { mutateAsync, isPending } = useUploadPost();
  const navigate = useNavigate();

  // NEW: confirm & success modals
  const confirm = useDisclosure(false);
  const success = useDisclosure(false);

  // NEW: current count so we can say “this will be your 3rd post…”
  const { data: stats } = usePostStats();
  const totalPosts = stats?.total_posts ?? 0;
  const nextPosition = Math.min(totalPosts + 1, MAX_POSTS);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <Formik<Values>
      initialValues={{ title: '', caption: '', file: null }}
      validationSchema={schema}
      onSubmit={async (values, helpers) => {
        if (!values.file) return;
        try {
          // 1) Upload raw file to /img/, get hosted URL
          setUploadPct(0);
          const file_url = await uploadTeamImage(values.file, {
            onUploadProgress: (e) => {
              if (!e.total) return;
              const pct = Math.round((e.loaded / e.total) * 100);
              setUploadPct(pct);
            },
          });

          // 2) Create the post with the returned URL
          await mutateAsync({
            title: values.title,
            caption: values.caption,
            file_url,
          });

          confirm.onClose();
          success.onOpen();
        } catch (e: unknown) {
          toast.error(getErrorMessage(e));
        } finally {
          helpers.setSubmitting(false);
          setUploadPct(null);
        }
      }}
    >
      {({
        setFieldValue,
        isSubmitting,
        isValid,
        touched,
        errors,
        values,
        handleSubmit,
      }) => (
        <Form noValidate>
          {/* Preview frame */}
          <Box
            sx={{
              width: '100%',
              maxWidth: 720,
              mx: 'auto',
              aspectRatio: '3/2',
              border: `1px solid ${gold}`,
              borderRadius: '6px',
              overflow: 'hidden',
              bgcolor: '#111',
              display: 'grid',
              placeItems: 'center',
            }}
            onClick={() => inputRef.current?.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt='preview'
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Typography sx={{ color: gold, fontWeight: 700 }}>
                upload file
              </Typography>
            )}
          </Box>

          {/* Hidden input */}
          <input
            ref={inputRef}
            type='file'
            accept='image/*,video/*'
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.currentTarget.files?.[0] ?? null;
              setFieldValue('file', f, true);
              if (preview) URL.revokeObjectURL(preview);
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
          />

          {touched.file && errors.file ? (
            <Typography sx={{ color: '#f44336', mt: 1, fontSize: 12 }}>
              {String(errors.file)}
            </Typography>
          ) : (
            <Typography
              onClick={() => inputRef.current?.click()}
              sx={{
                color: gold,
                textAlign: 'center',
                mt: 1,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {values.file ? 'Change picture' : 'Choose picture'}
            </Typography>
          )}

          {/* Progress (only while uploading to /img/) */}
          {uploadPct !== null && (
            <Box sx={{ mt: 1.5, maxWidth: 720, mx: 'auto' }}>
              <LinearProgress
                variant='determinate'
                value={uploadPct}
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 12,
                  color: '#A2A2A2',
                  textAlign: 'right',
                }}
              >
                {uploadPct}%
              </Typography>
            </Box>
          )}

          {/* Title */}
          <Box sx={{ mt: 2 }}>
            <FormikTextField
              name='title'
              placeholder='Title'
              showSuccessStyle
              successMessage='Looks good'
            />
          </Box>

          {/* Caption */}
          <Box sx={{ mt: 1 }}>
            <FormikTextarea
              name='caption'
              placeholder='Caption'
              rows={5}
              showSuccessStyle
              successMessage='Looks good'
            />
          </Box>

          {/* Submit → open confirm modal (not submitting yet) */}
          <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }}>
            <Button
              type='button'
              onClick={confirm.onOpen}
              disabled={isSubmitting || isPending || !isValid || !values.file}
              variant='contained'
              sx={{
                bgcolor: gold,
                color: '#000',
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#ffd465' },
              }}
              startIcon={
                isPending || uploadPct !== null ? (
                  <CircularProgress size={16} sx={{ color: '#000' }} />
                ) : undefined
              }
            >
              {isPending || uploadPct !== null ? 'Uploading…' : 'upload media'}
            </Button>
          </Box>

          {/* Confirm modal */}
          <NoticeModal
            open={confirm.open}
            onClose={confirm.onClose}
            onContinue={() => handleSubmit()} // now actually submit the form
            onSecondary={confirm.onClose}
            title='NOTICE!!!'
            message={`Are you sure you want to upload this post?\n\nThis will be your ${ordinal(
              nextPosition
            )} post of ${MAX_POSTS}.`}
            continueLabel={
              isSubmitting || isPending || uploadPct !== null
                ? 'Please wait…'
                : 'Post'
            }
            secondaryLabel='Cancel'
            icon={<WarningIcon />}
          />

          {/* Success modal */}
          <NoticeModal
            open={success.open}
            onClose={success.onClose}
            onContinue={() => {
              success.onClose();
              navigate(ROUTES.CATALOGUE);
            }}
            title='NOTICE!!!'
            message='You have successfully uploaded your post.'
            continueLabel='Finish'
            icon={<SuccessIcon />}
          />
        </Form>
      )}
    </Formik>
  );
}
