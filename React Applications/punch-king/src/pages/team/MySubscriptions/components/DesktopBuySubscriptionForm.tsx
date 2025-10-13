import {
  Box,
  Button,
  CircularProgress,
  Link,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { uploadTeamImage } from '../../../../api/media';
import { showError } from '../../../../utils/error/toastError';
import { useCreateSubscription } from '../hooks/useCreateSubscription';

const gold = '#EFAF00';

// 👉 tweak these if your pricing changes
const PLAN_PRICE: Record<'annual' | 'semi-annual', number> = {
  annual: 20000,
  'semi-annual': 10000,
};

type FormValues = {
  plan: 'annual' | 'semi-annual';
  slipUrl: string; // URL after /img upload
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

const labelSx = { fontWeight: 800, fontSize: 14, lineHeight: 1.2 };
const valueSx = { color: '#A2A2A2', mt: 0.5, fontSize: 14 };

export default function DesktopBuySubscriptionForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { mutateAsync, isPending } = useCreateSubscription();

  const initialValues: FormValues = {
    plan: 'annual',
    slipUrl: '',
  };

  return (
    <Box>
      <Typography component='h2' variant='h2' sx={{ fontWeight: 900, mb: 2 }}>
        PAYMENT DETAILS
      </Typography>

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
              setPreview(null);
            }
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

          const handlePickFile = async (file: File | null) => {
            if (!file) return;
            try {
              setUploading(true);
              // safe preview (clean previous URL first)
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
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 360px' },
                  gap: 4,
                  alignItems: 'start',
                }}
              >
                {/* Left: static bank details to pay into */}
                <Box>
                  <Typography
                    sx={{ color: '#EFAF00', fontWeight: 800, mb: 0.5 }}
                  >
                    PAY INTO THIS ACCOUNT TO GET SUBSCRIPTION
                  </Typography>
                  <Typography sx={{ color: '#A2A2A2', fontSize: 12, mb: 2 }}>
                    You are strongly advised to read our disclaimer
                  </Typography>

                  <Box sx={{ mb: 1.25 }}>
                    <Typography sx={labelSx}>Bank name:</Typography>
                    <Typography sx={valueSx}>GTB</Typography>
                  </Box>
                  <Box sx={{ mb: 1.25 }}>
                    <Typography sx={labelSx}>Account number:</Typography>
                    <Typography sx={valueSx}>0129459037</Typography>
                  </Box>
                  <Box sx={{ mb: 1.25 }}>
                    <Typography sx={labelSx}>Account name:</Typography>
                    <Typography sx={valueSx}>Punchking</Typography>
                  </Box>
                </Box>

                {/* Right: plan select + cost */}
                <Box sx={{ display: 'grid', gap: 1.5 }}>
                  <TextField
                    select
                    name='plan'
                    label='Choose subscription plan'
                    value={values.plan}
                    onChange={(e) =>
                      setFieldValue(
                        'plan',
                        e.target.value as FormValues['plan']
                      )
                    }
                    sx={{
                      '& .MuiInputBase-root': {
                        bgcolor: '#101010',
                        color: '#EDEDED',
                      },
                      '& .MuiFormLabel-root': { color: '#aaa' },
                    }}
                  >
                    <MenuItem value='annual'>Annual</MenuItem>
                    <MenuItem value='semi-annual'>6 months</MenuItem>
                  </TextField>

                  <TextField
                    label='Cost (auto generated)'
                    value={amount ? fmtNGN(amount) : ''}
                    InputProps={{ readOnly: true }}
                    sx={{
                      '& .MuiInputBase-root': {
                        bgcolor: '#101010',
                        color: '#EDEDED',
                      },
                      '& .MuiInputBase-input': { color: '#EDEDED' },
                    }}
                    InputLabelProps={{ sx: { color: '#EDEDED' } }}
                  />
                </Box>
              </Box>

              {/* Proof of payment + status */}
              <Box
                sx={{
                  mt: 6,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 320px' },
                  gap: 4,
                  alignItems: 'start',
                }}
              >
                <Box>
                  <Typography
                    component='h3'
                    sx={{ fontWeight: 900, fontSize: 20, mb: 2 }}
                  >
                    PROOF OF PAYMENT
                  </Typography>

                  <Box
                    sx={{
                      position: 'relative',
                      width: 320,
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
                        No file chosen
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
                        <CircularProgress size={36} />
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mt: 1 }}>
                    <input
                      id='slip'
                      name='slip'
                      type='file'
                      accept='image/*'
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.currentTarget.files?.[0] ?? null;
                        await handlePickFile(file);
                      }}
                    />
                    <label htmlFor='slip'>
                      <Link
                        component='span'
                        underline='hover'
                        sx={{ color: gold, fontWeight: 700, cursor: 'pointer' }}
                      >
                        {values.slipUrl ? 'Change picture' : 'Upload'}
                      </Link>
                    </label>
                    <Typography sx={{ color: '#f44336', fontSize: 12 }}>
                      {touched.slipUrl && errors.slipUrl ? errors.slipUrl : ' '}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: 16, mb: 1 }}>
                    PURCHASE STATUS
                  </Typography>
                  <Box
                    sx={{
                      border: '1px solid #FFC107',
                      color: '#FFC107',
                      borderRadius: '12px',
                      height: 28,
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 1.25,
                      fontWeight: 600,
                    }}
                  >
                    Pending
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                  type='submit'
                  disabled={isSubmitting || isPending || uploading}
                  variant='contained'
                  sx={{
                    bgcolor: gold,
                    color: '#000',
                    textTransform: 'none',
                    fontWeight: 700,
                    height: 44,
                    borderRadius: '10px',
                    px: 6,
                  }}
                >
                  {isSubmitting || isPending ? 'Please wait…' : 'Pay'}
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}
