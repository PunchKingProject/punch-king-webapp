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
import { uploadTeamImage } from '../../../../api/media.ts'; // <-- use your provided util
import WarningIcon from '../../../../assets/modalQuestionIcon.svg?react';
import SuccessIcon from '../../../../assets/modalSuccess.svg?react';
import FormikTextarea from '../../../../components/form/FormikTextarea.tsx';
import FormikTextField from '../../../../components/form/FormikTextField.tsx';
import NoticeModal from '../../../../components/modal/NoticeModal.tsx';
import { useDisclosure } from '../../../../hooks/useDisclosure.ts';
import ROUTES from '../../../../routes/routePath.ts';
import { getErrorMessage } from '../../../../utils/error/error.ts';
import { usePostStats } from '../hooks/usePostStats.ts';
import { useUploadPost } from '../hooks/useUploadPost.ts';
// import { useLocation, useSearchParams } from 'react-router-dom';
import {useUpdatePost} from "../hooks/useEditPost.ts";

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const MAX_POSTS = 5;

const gold = '#f0c040';

type EditPost = {
  id: number;
  title: string;
  caption: string;
  file_url: string | null;
};

type Props = {
  editPost?: EditPost | null;
};

// schema stays the same but file becomes optional in edit mode
const buildSchema = (isEditMode: boolean) =>
  Yup.object({
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
    file: isEditMode
      ? Yup.mixed<File>().nullable().optional() // file is optional when editing
      : Yup.mixed<File>()
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

// helper to determine if a URL or file is a video
function isVideo(source: File | string | null): boolean {
  if (!source) return false;
  if (source instanceof File) return source.type.startsWith('video/');
  // for remote URLs, check the extension
  return /\.(mp4|mov|webm|ogg|avi)(\?.*)?$/i.test(source);
}

export default function UploadMediaForm({ editPost }: Props) {
  const isEditMode = !!editPost;

  const inputRef = useRef<HTMLInputElement | null>(null);

  // If editing, show the existing file_url as the initial preview
  const [preview, setPreview] = useState<string | null>(editPost?.file_url ?? null);
  const [uploadPct, setUploadPct] = useState<number | null>(null);

  const { mutateAsync: uploadPost, isPending: isUploading } = useUploadPost();
  const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost(); // your edit mutation
  const isPending = isUploading || isUpdating;

  const navigate = useNavigate();
  const confirm = useDisclosure(false);
  const success = useDisclosure(false);

  const { data: stats } = usePostStats();
  const totalPosts = stats?.total_posts ?? 0;
  const nextPosition = Math.min(totalPosts + 1, MAX_POSTS);

  useEffect(() => {
    return () => {
      // Only revoke if preview is a local blob URL, not the remote file_url
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <Formik<Values>
      // Pre-fill from editPost if present
      initialValues={{
        title: editPost?.title ?? '',
        caption: editPost?.caption ?? '',
        file: null,
      }}
      validationSchema={buildSchema(isEditMode)}
      onSubmit={async (values, helpers) => {
        try {
          let file_url = editPost?.file_url ?? null; // default to existing URL

          // Only upload a new file if the user picked one
          if (values.file) {
            setUploadPct(0);
            file_url = await uploadTeamImage(values.file, {
              onUploadProgress: (e) => {
                if (!e.total) return;
                setUploadPct(Math.round((e.loaded / e.total) * 100));
              },
            });
          }

          if (isEditMode && editPost) {
            // Edit path — only send what changed
            await updatePost({
              post_id: editPost.id,
              title: values.title,
              caption: values.caption,
              ...(values.file && { file_url }), // only include if user picked a new file
            });
          } else {
            // Create path
            await uploadPost({
              title: values.title,
              caption: values.caption,
              file_url: file_url!,
            });
          }

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
      {({ setFieldValue, isSubmitting, isValid, touched, errors, values, handleSubmit }) => (
        <Form noValidate>

          {/* Preview frame */}
          {/* Preview frame */}
          <Box
            sx={{
              width: '100%',
              maxWidth: 720,
              mx: 'auto',
              border: `1px solid ${gold}`,
              borderRadius: '6px',
              overflow: 'hidden',
              bgcolor: '#111',
              cursor: 'pointer',
              // ❌ removed: aspectRatio: '3/2'
              // ❌ removed: display: 'grid', placeItems: 'center'
              // The media itself now defines the height
            }}
            onClick={() => inputRef.current?.click()}
          >
            {preview ? (
              isVideo(values.file ?? preview) ? (
                <video
                  src={preview}
                  controls
                  style={{
                    width: '100%',
                    height: 'auto',   // ← natural height
                    display: 'block', // ← removes inline baseline gap
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <img
                  src={preview}
                  alt='preview'
                  style={{
                    width: '100%',
                    height: 'auto',   // ← natural height
                    display: 'block', // ← removes inline baseline gap
                  }}
                />
              )
            ) : (
              // Empty state — give it a sensible min-height so it's tappable
              <Box
                sx={{
                  width: '100%',
                  minHeight: 180,
                  display: 'grid',
                  placeItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ pointerEvents: 'none' }}>
                  <Typography sx={{ color: gold, fontWeight: 700 }}>
                    Upload file
                  </Typography>
                  <Typography sx={{ color: '#A2A2A2', fontSize: 11, mt: 0.5 }}>
                    Images up to 10MB · Videos up to 50MB
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Hidden file input — unchanged */}
          <input
            ref={inputRef}
            type='file'
            accept='image/*,video/*'
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.currentTarget.files?.[0] ?? null;
              setFieldValue('file', f, true);
              if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
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
              {values.file
                ? isVideo(values.file)
                  ? 'Change video'
                  : 'Change image'
                : isEditMode
                  ? 'Replace file (optional)'
                  : 'Choose file'}
            </Typography>
          )}

          {/* Upload progress */}
          {uploadPct !== null && (
            <Box sx={{ mt: 1.5, maxWidth: 720, mx: 'auto' }}>
              <LinearProgress
                variant='determinate'
                value={uploadPct}
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography sx={{ mt: 0.5, fontSize: 12, color: '#A2A2A2', textAlign: 'right' }}>
                {uploadPct}%
              </Typography>
            </Box>
          )}

          {/*/!* Upload progress *!/*/}
          {/*{uploadPct !== null && (*/}
          {/*  <Box sx={{ mt: 1.5, maxWidth: 720, mx: 'auto' }}>*/}
          {/*    <LinearProgress*/}
          {/*      variant='determinate'*/}
          {/*      value={uploadPct}*/}
          {/*      sx={{ height: 6, borderRadius: 3 }}*/}
          {/*    />*/}
          {/*    <Typography sx={{ mt: 0.5, fontSize: 12, color: '#A2A2A2', textAlign: 'right' }}>*/}
          {/*      {uploadPct}%*/}
          {/*    </Typography>*/}
          {/*  </Box>*/}
          {/*)}*/}

          <Box sx={{ mt: 2 }}>
            <FormikTextField
              name='title'
              placeholder='Title'
              showSuccessStyle
              successMessage='Looks good'
            />
          </Box>

          <Box sx={{ mt: 1 }}>
            <FormikTextarea
              name='caption'
              placeholder='Caption'
              rows={5}
              showSuccessStyle
              successMessage='Looks good'
            />
          </Box>

          <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }}>
            <Button
              type='button'
              onClick={confirm.onOpen}
              disabled={
                isSubmitting ||
                isPending ||
                !isValid ||
                (!isEditMode && !values.file) // file required only for new uploads
              }
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
              {isPending || uploadPct !== null
                ? 'Saving…'
                : isEditMode
                  ? 'Save changes'
                  : 'Upload media'}
            </Button>
          </Box>

          {/* Confirm modal */}
          <NoticeModal
            open={confirm.open}
            onClose={confirm.onClose}
            onContinue={() => handleSubmit()}
            onSecondary={confirm.onClose}
            title='Confirm'
            message={
              isEditMode
                ? 'Are you sure you want to save these changes?'
                : `Are you sure you want to upload this post?\n\nThis will be your ${ordinal(nextPosition)} post of ${MAX_POSTS}.`
            }
            continueLabel={isSubmitting || isPending ? 'Please wait…' : isEditMode ? 'Save' : 'Post'}
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
            title='Success'
            message={
              isEditMode
                ? 'Your post has been updated successfully.'
                : 'Your post has been uploaded successfully.'
            }
            continueLabel='Finish'
            icon={<SuccessIcon />}
          />
        </Form>
      )}
    </Formik>
  );
}
