import {
  Box,
  Button,
  CircularProgress,

  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { uploadTeamImage } from '../../../../api/media.ts';
import { showError } from '../../../../utils/error/toastError.ts';
import { useCreateSubscription } from '../hooks/useCreateSubscription.ts';

const gold = '#EFAF00';

// keep in sync with desktop prices
const PLAN_PRICE: Record<'annual' | 'semi-annual', number> = {
  annual: 20000,
  'semi-annual': 10000,
};

type FormValues = {
  plan: 'annual' | 'semi-annual';
  slipUrl: string; // URL received after /img upload
};

function fmtNGN(n: number) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `₦${n.toLocaleString()}`;
  }
}

const inputSx = {
  '& .MuiInputBase-root': { bgcolor: '#101010', color: '#EDEDED' },
  '& .MuiInputLabel-root': { color: '#9e9e9e' },
  '& .MuiFormHelperText-root': { color: '#f44336' },
};

export default function MobileBuySubscriptionForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { mutateAsync, isPending } = useCreateSubscription();
    const fileInputRef = useRef<HTMLInputElement | null>(null);


  const initialValues: FormValues = { plan: 'annual', slipUrl: '' };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validate={(vals) => {
        const errs: Partial<Record<keyof FormValues, string>> = {};
        if (!vals.slipUrl) errs.slipUrl = 'Upload proof of payment';
        return errs;
      }}
      onSubmit={async (vals, helpers) => {
        try {
          const amount = PLAN_PRICE[vals.plan];
          await mutateAsync({
            type: vals.plan,
            payment_amount: amount,
            payment_slip: vals.slipUrl,
          });
          toast.success('Subscription request submitted.');
          helpers.resetForm({ values: initialValues });
          if (preview) {
            URL.revokeObjectURL(preview);
          }
          setPreview(null);
        } catch (err) {
          showError(err);
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
      }) => {
     const amount = PLAN_PRICE[values.plan];
     const isBuying = isSubmitting || isPending;

     const openPicker = () => {
       // IMPORTANT: reset so selecting the same file fires onChange
       if (fileInputRef.current) {
         fileInputRef.current.value = '';
         fileInputRef.current.click();
       }
     };

        const handlePickFile = async (file: File | null) => {
          if (!file) return;
          try {
            setUploading(true);
            setPreview((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return URL.createObjectURL(file);
            });
            const url = await uploadTeamImage(file);
            await setFieldValue('slipUrl', url, true);
            await setFieldTouched('slipUrl', true, false);
            toast.success('Slip uploaded.');
          } catch (e) {
            showError(e);
            setPreview((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return null;
            });
            await setFieldValue('slipUrl', '', true);
            await setFieldTouched('slipUrl', true, false);
          } finally {
            setUploading(false);
          }
        };

        return (
          <Form noValidate>
            {/* Select plan + price */}
            <Box sx={{ display: 'grid', gap: 1.25 }}>
              <TextField
                select
                name='plan'
                label='Select subscription plan'
                value={values.plan}
                onChange={(e) =>
                  setFieldValue('plan', e.target.value as FormValues['plan'])
                }
                sx={inputSx}
                size='small'
              >
                <MenuItem value='annual'>Annual subscription plan</MenuItem>
                <MenuItem value='semi-annual'>6 months subscription</MenuItem>
              </TextField>

              <TextField
                label='Cost (auto generated)'
                value={fmtNGN(amount)}
                InputProps={{ readOnly: true }}
                sx={inputSx}
                size='small'
              />
            </Box>

            {/* Payment details (static) */}
            <Box sx={{ mt: 4 }}>
              <Typography sx={{ color: '#CFCFCF', fontWeight: 800, mb: 0.5 }}>
                PAYMENT DETAILS
              </Typography>
              <Typography sx={{ color: gold, fontSize: 11, mb: 1.5 }}>
                PAY INTO THIS ACCOUNT TO GET SPONSORSHIP UNITS
                <br />
                You are strongly advised to read our disclaimer
              </Typography>

              <TextField
                label='Bank name'
                value='GTB'
                InputProps={{ readOnly: true }}
                sx={inputSx}
                size='small'
              />
              <Box sx={{ height: 8 }} />
              <TextField
                label='Account number'
                value='0129459037'
                InputProps={{ readOnly: true }}
                sx={inputSx}
                size='small'
              />
              <Box sx={{ height: 8 }} />
              <TextField
                label='Account name'
                value='Punchking'
                InputProps={{ readOnly: true }}
                sx={inputSx}
                size='small'
              />
            </Box>

            {/* Proof of payment */}
            <Box sx={{ mt: 4 }}>
              <Typography sx={{ color: '#CFCFCF', fontWeight: 800, mb: 1 }}>
                PROOF OF PAYMENT
              </Typography>

              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 320,
                  height: 200,
                  borderRadius: 2,
                  bgcolor: '#1A1A1A',
                  border: '1px solid #3B3B3B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt='Payment slip preview'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Typography sx={{ color: '#A2A2A2' }}>
                    Upload proof of payment
                  </Typography>
                )}

                {uploading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: 'rgba(0,0,0,0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CircularProgress size={28} />
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 1 }}>
                {/* <input
                  ref={fileInputRef}
                  id='slip'
                  name='slip'
                  type='file'
                  accept='image/*'
                  style={{ display: 'none' }}
                  onChange={async (e) =>
                    handlePickFile(e.currentTarget.files?.[0] ?? null)
                  }
                /> */}
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  style={{ display: 'none' }}
                  onChange={(e) =>
                    handlePickFile(e.currentTarget.files?.[0] ?? null)
                  }
                />

                <Box sx={{ mt: 1 }}>
                  <Button
                    type='button'
                    onClick={openPicker}
                    variant='contained'
                    sx={{
                      bgcolor: '#EFAF00',
                      color: '#000',
                      textTransform: 'none',
                      fontWeight: 700,
                      height: 36,
                      borderRadius: '10px',
                      px: 3,
                    }}
                  >
                    {values.slipUrl ? 'change picture' : 'Upload'}
                  </Button>
                  <Typography sx={{ color: '#f44336', fontSize: 12 }}>
                    {touched.slipUrl && errors.slipUrl ? errors.slipUrl : ' '}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Purchase status chip */}
            <Box sx={{ mt: 3 }}>
              <Typography sx={{ fontWeight: 900, fontSize: 14, mb: 1 }}>
                PURCHASE STATUS
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1px solid #FFC107',
                  color: '#FFC107',
                  borderRadius: '12px',
                  height: 24,
                  px: 1,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Pending
              </Box>
            </Box>

            {/* Submit */}
            <Box sx={{ mt: 3 }}>
              <Button
                type='submit'
                fullWidth
                disabled={isBuying ||  uploading}
                variant='contained'
                sx={{
                  bgcolor: gold,
                  color: '#000',
                  textTransform: 'none',
                  fontWeight: 700,
                  height: 40,
                  borderRadius: '10px',
                }}
                startIcon={
                  isBuying ? (
                    <CircularProgress size={18} sx={{ color: '#000' }} />
                  ) : undefined
                }
              >
                {isSubmitting || isPending ? 'Please wait…' : 'Buy'}
              </Button>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
}
 