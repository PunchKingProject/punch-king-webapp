import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Form,
  Formik,
  type FormikHelpers,
} from 'formik';
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import {
  uploadTeamImage,
  validateMediaFile,
} from '../../../../api/media.ts';
import SuccessIcon from '../../../../assets/modalSuccess.svg?react';
import NoticeModal from '../../../../components/modal/NoticeModal.tsx';
import { useDisclosure } from '../../../../hooks/useDisclosure.ts';
import { getErrorMessage } from '../../../../utils/error/error.ts';
import { WEIGHT_CLASSES, type WeightClass } from '../../../team/Catalogue/api/catalogue.types.ts';
import { createAdminTeamPost } from '../api/teams.api.ts';

const GOLD = '#f0c040';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

type Props = {
  teamId: number;
  onSuccessCallback: () => void;
};

type FormValues = {
  title: string;
  caption: string;
  file: File | null;
  boxer_name: string;
  weight_class: WeightClass | '';
  boxer_weight_kg: number | '';
  shorts_color: string;
  glove_color: string;
  opponent_name: string;
  opponent_weight_kg: number | '';
  opponent_shorts_color: string;
  sparring_location: string;
};

const initialFormValues: FormValues = {
  title: '',
  caption: '',
  file: null,
  boxer_name: '',
  weight_class: '',
  boxer_weight_kg: '',
  shorts_color: '',
  glove_color: '',
  opponent_name: '',
  opponent_weight_kg: '',
  opponent_shorts_color: '',
  sparring_location: '',
};

const validationSchema = Yup.object({
  title: Yup.string().trim().min(2, 'Title is too short.').max(120, 'Maximum 120 characters.').required('Title is required.'),
  caption: Yup.string().trim().min(2, 'Description is too short.').max(2000, 'Maximum 2,000 characters.').required('Description is required.'),
  boxer_name: Yup.string().trim().min(2, 'Boxer name is too short.').max(120, 'Maximum 120 characters.').required('Boxer name is required.'),
  weight_class: Yup.string().oneOf(['lightweight', 'welterweight', 'middleweight'], 'Select a valid weight class.').required('Weight class is required.'),
  boxer_weight_kg: Yup.number().typeError('Enter the boxer weight.').positive('Boxer weight must be greater than zero.').max(72.57, 'The supported divisions currently end at 72.57kg.').required('Boxer weight is required.'),
  shorts_color: Yup.string().trim().max(100, 'Maximum 100 characters.').required('Boxer clothing/shorts information is required.'),
  glove_color: Yup.string().trim().max(100, 'Maximum 100 characters.').required('Glove colour is required.'),
  opponent_name: Yup.string().trim().max(120, 'Maximum 120 characters.'),
  opponent_weight_kg: Yup.number().transform((val, orig) => orig === '' || orig === null ? undefined : val).optional(),
  opponent_shorts_color: Yup.string().trim().max(100, 'Maximum 100 characters.'),
  sparring_location: Yup.string().trim().max(200, 'Maximum 200 characters.').required('Sparring location is required.'),
  file: Yup.mixed<File>()
    .required('Choose a sparring video or image.')
    .test('file-type', 'Only supported images or videos are allowed.', (file) => file instanceof File && (file.type.startsWith('image/') || file.type.startsWith('video/')))
    .test('file-size', 'Maximum media size is 10MB.', (file) => file instanceof File && file.size <= MAX_FILE_SIZE),
});

function isVideo(source: File | string | null): boolean {
  if (!source) return false;
  if (source instanceof File) return source.type.startsWith('video/');
  return /\.(mp4|mov|webm|ogg|avi)(\?.*)?$/i.test(source);
}

function numberValue(value: number | ''): number {
  return value === '' ? 0 : Number(value);
}

export default function AdminUploadMediaForm({ teamId, onSuccessCallback }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadPercent, setUploadPercent] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const successModal = useDisclosure(false);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileSelection = async (
    file: File | undefined,
    setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => Promise<void>
  ) => {
    if (!file) return;
    try {
      validateMediaFile(file);
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
      await setFieldValue('file', file, true);
      setPreview(URL.createObjectURL(file));
    } catch (error) {
      toast.error(getErrorMessage(error));
      if (inputRef.current) inputRef.current.value = '';
      await setFieldValue('file', null, true);
    }
  };

  const submitForm = async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    try {
      if (!values.file) throw new Error('A media file is required.');

      setUploadPercent(0);
      const fileUrl = await uploadTeamImage(values.file, {
        onUploadProgress: (event) => {
          if (!event.total) return;
          setUploadPercent(Math.round((event.loaded / event.total) * 100));
        },
      });

      if (!fileUrl) throw new Error('File upload failed.');

      const payload = {
        team_id: teamId,
        title: values.title.trim(),
        caption: values.caption.trim(),
        file_url: fileUrl,
        boxer_name: values.boxer_name.trim(),
        weight_class: values.weight_class as WeightClass,
        boxer_weight_kg: numberValue(values.boxer_weight_kg),
        shorts_color: values.shorts_color.trim(),
        glove_color: values.glove_color.trim(),
        opponent_name: values.opponent_name.trim(),
        opponent_weight_kg: numberValue(values.opponent_weight_kg),
        opponent_shorts_color: values.opponent_shorts_color.trim(),
        sparring_location: values.sparring_location.trim(),
      };

      setIsUploading(true);
      await createAdminTeamPost(payload);
      setIsUploading(false);

      successModal.onOpen();
    } catch (error) {
      setIsUploading(false);
      toast.error(getErrorMessage(error));
    } finally {
      helpers.setSubmitting(false);
      setUploadPercent(null);
    }
  };

  return (
    <Formik<FormValues>
      initialValues={initialFormValues}
      validationSchema={validationSchema}
      onSubmit={submitForm}
    >
      {({ values, errors, touched, isSubmitting, isValid, setFieldValue, handleChange, handleBlur }) => (
        <Form noValidate>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Card sx={{ bgcolor: '#101010', border: '1px solid rgba(240,192,64,0.25)', borderRadius: 3 }}>
              <CardContent>
                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.15rem', mb: 0.5 }}>Sparring media</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', mb: 2 }}>Upload an image or sparring video. Maximum file size: 10MB.</Typography>
                
                <input
                  ref={inputRef}
                  hidden
                  type='file'
                  accept='image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,video/ogg'
                  onChange={(event) => void handleFileSelection(event.currentTarget.files?.[0], setFieldValue)}
                />

                <Box
                  onClick={() => inputRef.current?.click()}
                  sx={{ minHeight: 260, border: `1px dashed ${GOLD}`, borderRadius: 2, bgcolor: '#080808', cursor: 'pointer', overflow: 'hidden', display: 'grid', placeItems: 'center' }}
                >
                  {preview ? (
                    isVideo(values.file ?? preview) ? (
                      <Box component='video' src={preview} controls onClick={(e) => e.stopPropagation()} sx={{ width: '100%', maxHeight: 400, objectFit: 'contain', bgcolor: '#000' }} />
                    ) : (
                      <Box component='img' src={preview} alt='Preview' sx={{ width: '100%', maxHeight: 400, objectFit: 'contain', bgcolor: '#000' }} />
                    )
                  ) : (
                    <Stack spacing={1.5} alignItems='center' textAlign='center' sx={{ px: 2 }}>
                      <CloudUploadOutlinedIcon sx={{ color: GOLD, fontSize: 52 }} />
                      <Typography sx={{ color: '#fff', fontWeight: 800 }}>Select sparring media</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>Click to choose a file from your device.</Typography>
                    </Stack>
                  )}
                </Box>
                {touched.file && errors.file && <FormHelperText error>{String(errors.file)}</FormHelperText>}
                
                {uploadPercent !== null && (
                  <Box sx={{ mt: 2 }}>
                    <Stack direction='row' justifyContent='space-between' mb={0.7}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem' }}>Uploading media</Typography>
                      <Typography sx={{ color: GOLD, fontWeight: 800, fontSize: '0.8rem' }}>{uploadPercent}%</Typography>
                    </Stack>
                    <LinearProgress variant='determinate' value={uploadPercent} sx={{ bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: GOLD } }} />
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#101010', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
              <CardContent>
                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.15rem', mb: 2.5 }}>Post information</Typography>
                <Stack spacing={2.5}>
                  <TextField fullWidth name='title' label='Post title' value={values.title} onChange={handleChange} onBlur={handleBlur} error={touched.title && Boolean(errors.title)} helperText={touched.title && errors.title} />
                  <TextField fullWidth multiline minRows={3} name='caption' label='Description' value={values.caption} onChange={handleChange} onBlur={handleBlur} error={touched.caption && Boolean(errors.caption)} helperText={touched.caption && errors.caption} />
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#101010', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
              <CardContent>
                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.15rem', mb: 2.5 }}>Fighter information</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2.5 }}>
                  <TextField fullWidth name='boxer_name' label='Boxer name' value={values.boxer_name} onChange={handleChange} onBlur={handleBlur} error={touched.boxer_name && Boolean(errors.boxer_name)} helperText={touched.boxer_name && errors.boxer_name} />
                  <FormControl fullWidth error={touched.weight_class && Boolean(errors.weight_class)}>
                    <InputLabel id='weight-class-label'>Weight class</InputLabel>
                    <Select labelId='weight-class-label' name='weight_class' label='Weight class' value={values.weight_class} onChange={handleChange} onBlur={handleBlur}>
                      {WEIGHT_CLASSES.map((wc) => <MenuItem key={wc.value} value={wc.value}>{wc.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <TextField fullWidth type='number' name='boxer_weight_kg' label='Actual boxer weight (kg)' value={values.boxer_weight_kg} onChange={handleChange} onBlur={handleBlur} />
                  <TextField fullWidth name='sparring_location' label='Sparring location' value={values.sparring_location} onChange={handleChange} onBlur={handleBlur} />
                  <TextField fullWidth name='shorts_color' label='Boxer shorts/clothing colour' value={values.shorts_color} onChange={handleChange} onBlur={handleBlur} />
                  <TextField fullWidth name='glove_color' label='Boxer glove colour' value={values.glove_color} onChange={handleChange} onBlur={handleBlur} />
                </Box>
              </CardContent>
            </Card>

            <Alert icon={<InfoOutlinedIcon />} severity='info' sx={{ bgcolor: 'rgba(240,192,64,0.08)', color: 'rgba(255,255,255,0.78)', border: '1px solid rgba(240,192,64,0.24)' }}>
              The fighter details become part of the video’s catalogue information.
            </Alert>

            <Stack direction='row' justifyContent='flex-end' spacing={1.5}>
              <Button type='submit' variant='contained' disabled={isSubmitting || isUploading || !isValid} startIcon={isUploading ? <CircularProgress size={18} /> : undefined} sx={{ bgcolor: GOLD, color: '#000', fontWeight: 900, px: 5 }}>
                {isUploading ? 'Uploading...' : 'Upload Post'}
              </Button>
            </Stack>
          </Stack>

          <NoticeModal
            open={successModal.open}
            onClose={successModal.onClose}
            onContinue={() => {
              successModal.onClose();
              onSuccessCallback();
            }}
            title='Success'
            message='The fighter sparring post has been uploaded successfully by Admin.'
            continueLabel='Finish'
            icon={<SuccessIcon />}
          />
        </Form>
      )}
    </Formik>
  );
}