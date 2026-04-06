import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { uploadTeamImage } from '../../../../api/media.ts';
import { useCreateLicensePayment } from '../hooks/useCreateLicensePayment.ts';
import { showError } from '../../../../utils/error/toastError.ts';

const GOLD = '#EFAF00';
type Plan = 'annual' | 'semiannual'; // 6 months

const PRICING: Record<Plan, number> = {
  annual: 20000,
  semiannual: 10000,
};

const labelSx = { fontWeight: 800, fontSize: 14, lineHeight: 1.2 };
const valueSx = { color: '#A2A2A2', mt: 0.5, fontSize: 14 };

function fmtNGN(n: number) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `₦${n.toLocaleString()}`;
  }
}

type FormValues = {
  plan: Plan;
  slipUrl: string; // url after /img upload
};

export default function DesktopLicensePaymentForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { mutateAsync, isPending } = useCreateLicensePayment();

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
          if (!vals.plan) errs.plan = 'Choose a plan';
          if (!vals.slipUrl) errs.slipUrl = 'Upload proof of payment';
          return errs;
        }}
        onSubmit={async (vals, helpers) => {
          try {
            const payment_amount = PRICING[vals.plan];

            await mutateAsync({
              payment_amount,
              payment_slip: vals.slipUrl,
            });

            toast.success('License payment submitted.');
            helpers.resetForm({ values: initialValues });
            setPreview((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return null;
            });
          } catch (e) {
            showError(e);
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
          const cost = PRICING[values.plan];

          const handlePlanChange = (e: SelectChangeEvent<Plan>) => {
            setFieldValue('plan', e.target.value as Plan, true);
          };

          const handlePickFile = async (file: File | null) => {
            if (!file) return;
            try {
              setUploading(true);
              // local preview (revoke previous to avoid leaks)
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
                {/* Left: static bank we pay into */}
                <Box>
                  <Typography sx={{ color: GOLD, fontWeight: 800, mb: 0.5 }}>
                    PAY INTO THIS ACCOUNT TO GET YOUR LICENSE
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

                {/* Right: plan + cost */}
                <Box sx={{ display: 'grid', gap: 1.5 }}>
                  <FormControl fullWidth>
                    <InputLabel id='plan-label' sx={{ color: '#EDEDED' }}>
                      Choose plan
                    </InputLabel>
                    <Select
                      labelId='plan-label'
                      value={values.plan}
                      label='Choose plan'
                      onChange={handlePlanChange}
                      sx={{
                        '& .MuiInputBase-root': {
                          bgcolor: '#101010',
                          color: '#EDEDED',
                        },
                      }}
                    >
                      <MenuItem value='annual'>
                        Annual Licensing plan
                      </MenuItem>
                      {/* <MenuItem value='semiannual'>
                        6 months subscription
                      </MenuItem> */}
                    </Select>
                    <Typography
                      sx={{ color: '#f44336', fontSize: 12, mt: 0.5 }}
                    >
                      {touched.plan && errors.plan ? errors.plan : ' '}
                    </Typography>
                  </FormControl>

                  <TextField
                    label='Cost (auto generated)'
                    value={fmtNGN(cost)}
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

              {/* Slip + status */}
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
                        const f = e.currentTarget.files?.[0] ?? null;
                        await handlePickFile(f);
                      }}
                    />
                    <label htmlFor='slip'>
                      <Link
                        component='span'
                        underline='hover'
                        sx={{ color: GOLD, fontWeight: 700, cursor: 'pointer' }}
                      >
                        {values.slipUrl ? 'Replace' : 'Upload'}
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
                    bgcolor: GOLD,
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
