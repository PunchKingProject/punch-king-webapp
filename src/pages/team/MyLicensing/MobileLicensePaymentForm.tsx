// import {
//   Box,
//   Button,
//   CircularProgress,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
//   type SelectChangeEvent,
// } from '@mui/material';
// import { Form, Formik } from 'formik';
// import { useRef, useState } from 'react';
// import { toast } from 'react-toastify';
// import { useCreateLicensePayment } from './hooks/useCreateLicensePayment.ts';
// import { uploadTeamImage } from '../../../api/media.ts';
// import { showError } from '../../../utils/error/toastError.ts';
//
//
//
// type Plan = 'annual' | 'semiannual';
//
// const GOLD = '#EFAF00';
//
// /** Keep in sync with desktop */
// const PRICING: Record<Plan, number> = {
//   annual: 20000,
//   semiannual: 10000,
// };
//
// type FormValues = {
//   plan: Plan;
//   slipUrl: string; // URL after /img upload
// };
//
// const inputSx = {
//   '& .MuiInputBase-root': { bgcolor: '#101010', color: '#EDEDED' },
//   '& .MuiInputLabel-root': { color: '#9e9e9e' },
//   '& .MuiFormHelperText-root': { color: '#f44336' },
// };
//
// function fmtNGN(n: number) {
//   try {
//     return new Intl.NumberFormat(undefined, {
//       style: 'currency',
//       currency: 'NGN',
//       maximumFractionDigits: 0,
//     }).format(n);
//   } catch {
//     return `₦${n.toLocaleString()}`;
//   }
// }
//
// export default function MobileLicensePaymentForm() {
//   const { mutateAsync, isPending } = useCreateLicensePayment();
//
//   const [preview, setPreview] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//
//   const initialValues: FormValues = { plan: 'annual', slipUrl: '' };
//
//   const openPicker = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//       fileInputRef.current.click();
//     }
//   };
//
//   const handlePickFile = async (
//     file: File | null,
//     setFieldValue: (f: string, v: unknown, shouldValidate?: boolean) => void
//   ) => {
//     if (!file) return;
//     try {
//       setUploading(true);
//
//       // Safe preview (revoke previous object URL first)
//       setPreview((prev) => {
//         if (prev) URL.revokeObjectURL(prev);
//         return URL.createObjectURL(file);
//       });
//
//       // Upload to /img and store returned URL
//       const url = await uploadTeamImage(file);
//       await setFieldValue('slipUrl', url, true);
//       toast.success('Slip uploaded.');
//     } catch (e) {
//       showError(e);
//       setPreview((prev) => {
//         if (prev) URL.revokeObjectURL(prev);
//         return null;
//       });
//       await setFieldValue('slipUrl', '', true);
//     } finally {
//       setUploading(false);
//     }
//   };
//
//   return (
//     <Formik<FormValues>
//       initialValues={initialValues}
//       validate={(vals) => {
//         const errs: Partial<Record<keyof FormValues, string>> = {};
//         if (!vals.plan) errs.plan = 'Choose a plan';
//         if (!vals.slipUrl) errs.slipUrl = 'Upload proof of payment';
//         return errs;
//       }}
//       onSubmit={async (vals, helpers) => {
//         try {
//           const payment_amount = PRICING[vals.plan];
//           await mutateAsync({ payment_amount, payment_slip: vals.slipUrl });
//
//           toast.success('License payment submitted.');
//           helpers.resetForm({ values: initialValues });
//
//           setPreview((prev) => {
//             if (prev) URL.revokeObjectURL(prev);
//             return null;
//           });
//         } catch (e) {
//           showError(e);
//         } finally {
//           helpers.setSubmitting(false);
//         }
//       }}
//     >
//       {({ values, errors, touched, isSubmitting, setFieldValue }) => {
//         const amount = PRICING[values.plan];
//
//         const onPlanChange = (e: SelectChangeEvent<Plan>) => {
//           setFieldValue('plan', e.target.value as Plan, true);
//         };
//
//         return (
//           <Form noValidate>
//             {/* Plan + Cost */}
//             <Box sx={{ display: 'grid', gap: 1.25 }}>
//               <FormControl fullWidth size='small' sx={inputSx}>
//                 <InputLabel id='plan-label'>Select license plan</InputLabel>
//                 <Select<Plan>
//                   labelId='plan-label'
//                   label='Select license plan'
//                   value={values.plan}
//                   onChange={onPlanChange}
//                 >
//                   <MenuItem value='annual'>Annual licensing plan</MenuItem>
//                   {/* <MenuItem value="semiannual">6 months licensing plan</MenuItem> */}
//                 </Select>
//               </FormControl>
//               <TextField
//                 size='small'
//                 label='Cost (auto generated)'
//                 value={fmtNGN(amount)}
//                 InputProps={{ readOnly: true }}
//                 sx={inputSx}
//               />
//             </Box>
//
//             {/* Payment details (static) */}
//             <Box sx={{ mt: 3 }}>
//               <Typography sx={{ color: '#CFCFCF', fontWeight: 800, mb: 0.5 }}>
//                 PAYMENT DETAILS
//               </Typography>
//               <Typography sx={{ color: GOLD, fontSize: 11, mb: 1.5 }}>
//                 PAY INTO THIS ACCOUNT TO GET YOUR LICENSE
//                 <br />
//                 You are strongly advised to read our disclaimer
//               </Typography>
//
//               <TextField
//                 size='small'
//                 label='Bank name'
//                 value='GTB'
//                 InputProps={{ readOnly: true }}
//                 sx={inputSx}
//               />
//               <Box sx={{ height: 8 }} />
//               <TextField
//                 size='small'
//                 label='Account number'
//                 value='0129459037'
//                 InputProps={{ readOnly: true }}
//                 sx={inputSx}
//               />
//               <Box sx={{ height: 8 }} />
//               <TextField
//                 size='small'
//                 label='Account name'
//                 value='Punchking'
//                 InputProps={{ readOnly: true }}
//                 sx={inputSx}
//               />
//             </Box>
//
//             {/* Proof of payment */}
//             <Box sx={{ mt: 3 }}>
//               <Typography sx={{ color: '#CFCFCF', fontWeight: 800, mb: 1 }}>
//                 PROOF OF PAYMENT
//               </Typography>
//
//               <Box
//                 sx={{
//                   position: 'relative',
//                   width: '100%',
//                   maxWidth: 320,
//                   height: 200,
//                   borderRadius: 2,
//                   bgcolor: '#1A1A1A',
//                   border: '1px solid #3B3B3B',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   overflow: 'hidden',
//                 }}
//               >
//                 {preview ? (
//                   <img
//                     src={preview}
//                     alt='Payment slip preview'
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       objectFit: 'cover',
//                     }}
//                   />
//                 ) : (
//                   <Typography sx={{ color: '#A2A2A2' }}>
//                     Upload proof of payment
//                   </Typography>
//                 )}
//
//                 {uploading && (
//                   <Box
//                     sx={{
//                       position: 'absolute',
//                       inset: 0,
//                       bgcolor: 'rgba(0,0,0,0.35)',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                     }}
//                   >
//                     <CircularProgress size={28} />
//                   </Box>
//                 )}
//               </Box>
//
//               {/* hidden input + upload button with spinner */}
//               <input
//                 ref={fileInputRef}
//                 type='file'
//                 accept='image/*'
//                 style={{ display: 'none' }}
//                 onChange={(e) =>
//                   handlePickFile(
//                     e.currentTarget.files?.[0] ?? null,
//                     setFieldValue
//                   )
//                 }
//               />
//
//               <Box sx={{ mt: 1 }}>
//                 <Button
//                   type='button'
//                   onClick={openPicker}
//                   variant='contained'
//                   sx={{
//                     bgcolor: GOLD,
//                     color: '#000',
//                     textTransform: 'none',
//                     fontWeight: 700,
//                     height: 36,
//                     borderRadius: '10px',
//                     px: 3,
//                   }}
//                   startIcon={
//                     uploading ? (
//                       <CircularProgress size={16} sx={{ color: '#000' }} />
//                     ) : undefined
//                   }
//                   disabled={uploading}
//                 >
//                   {values.slipUrl ? 'change picture' : 'Upload'}
//                 </Button>
//                 <Typography sx={{ color: '#f44336', fontSize: 12 }}>
//                   {touched.slipUrl && errors.slipUrl ? errors.slipUrl : ' '}
//                 </Typography>
//               </Box>
//             </Box>
//
//             {/* Purchase status */}
//             <Box sx={{ mt: 3 }}>
//               <Typography sx={{ fontWeight: 900, fontSize: 14, mb: 1 }}>
//                 PURCHASE STATUS
//               </Typography>
//               <Box
//                 sx={{
//                   display: 'inline-flex',
//                   alignItems: 'center',
//                   border: '1px solid #FFC107',
//                   color: '#FFC107',
//                   borderRadius: '12px',
//                   height: 24,
//                   px: 1,
//                   fontSize: 12,
//                   fontWeight: 700,
//                 }}
//               >
//                 Pending
//               </Box>
//             </Box>
//
//             {/* Submit */}
//             <Box sx={{ mt: 3 }}>
//               <Button
//                 type='submit'
//                 fullWidth
//                 disabled={isSubmitting || isPending || uploading}
//                 variant='contained'
//                 sx={{
//                   bgcolor: GOLD,
//                   color: '#000',
//                   textTransform: 'none',
//                   fontWeight: 700,
//                   height: 40,
//                   borderRadius: '10px',
//                 }}
//                 startIcon={
//                   isSubmitting || isPending ? (
//                     <CircularProgress size={16} sx={{ color: '#000' }} />
//                   ) : undefined
//                 }
//               >
//                 {isSubmitting || isPending ? 'Please wait…' : 'Pay'}
//               </Button>
//             </Box>
//           </Form>
//         );
//       }}
//     </Formik>
//   );
// }


import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import {useGetLicensePlans} from "./hooks/useGetLicensePlans.ts";
import {useCreateLicensePayment} from "./hooks/useCreateLicensePayment.ts";
import {showError} from "../../../utils/error/toastError.ts";

const GOLD = '#EFAF00';

type FormValues = {
  planId: string;
};

function fmtPrice(n: number, currency: string = 'NGN') {
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    // Fallback if Intl fails
    const symbol = currency === 'USD' ? '$' : '₦';
    return `${symbol}${n.toLocaleString()}`;
  }
}

export default function MobileLicensePaymentForm() {
  const { data: plans, isLoading: loadingPlans } = useGetLicensePlans();
  const { mutateAsync, isPending } = useCreateLicensePayment();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 100px)', // Adjust 100px based on mobile header/footer
        pb: 4,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
        LICENSING
      </Typography>

      <Formik
        initialValues={{ planId: '' }}
        validate={(vals) => {
          const errs: Partial<Record<keyof FormValues, string>> = {};
          if (!vals.planId) errs.planId = 'Required';
          return errs;
        }}
        onSubmit={async (vals) => {
          try {
            const plan = plans?.find((p) => String(p.id) === vals.planId);
            if (!plan) return;

            const isoDate = new Date().toISOString().split('T')[0] + 'T00:00:00Z';

            const response = await mutateAsync({
              plan_id: Number(vals.planId),
              payment_date: isoDate,
            });

            // REDIRECT LOGIC: Redirect directly in the same window for mobile UX
            if (response?.data) {
              window.location.href = response.data;
            }
          } catch (e) {
            showError(e);
          }
        }}
      >
        {({ values, handleChange, errors, touched }) => {
          const selectedPlan = plans?.find((p) => String(p.id) === values.planId);

          return (
            <Form style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ color: GOLD, fontSize: 12, fontWeight: 700, mb: 2 }}>
                  SECURE BANK TRANSFER
                </Typography>

                <TextField
                  select
                  fullWidth
                  label={loadingPlans ? 'Loading plans...' : 'Select License Type'}
                  name="planId"
                  value={values.planId}
                  onChange={handleChange}
                  error={Boolean(touched.planId && errors.planId)}
                  sx={{
                    mb: 3,
                    '& .MuiInputBase-root': { bgcolor: '#101010', color: '#EDEDED' },
                    '& .MuiInputLabel-root': { color: '#9e9e9e' },
                  }}
                >
                  {plans?.map((p) => (
                    <MenuItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField>

                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: '#161616',
                    border: '1px solid #222',
                    textAlign: 'center',
                  }}
                >
                  <Typography sx={{ color: '#888', fontSize: 13, mb: 1 }}>
                    Amount Due
                  </Typography>
                  <Typography variant="h4" sx={{ color: GOLD, fontWeight: 900 }}>
                    {selectedPlan
                      ? fmtPrice(selectedPlan.price, selectedPlan.currency)
                      : '0'
                    }
                  </Typography>
                </Box>

                <Box sx={{ mt: 3, px: 1 }}>
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>How it works:</Typography>
                  <Typography sx={{ color: '#A2A2A2', fontSize: 14, lineHeight: 1.6 }}>
                    1. Select your preferred license and click "Pay".<br />
                    2. You will be redirected to a secure Flutterwave page.<br />
                    3. A unique one-time bank account number will be generated for you.<br />
                    4. Transfer the exact amount shown.<br />
                    5. Your license payment status will update to "Processed" immediately.<br />
                    6. Your license will be activated by a member of our team on review
                  </Typography>
                </Box>
              </Box>

              {/* Bottom Button Area */}
              <Box sx={{ mt: 'auto', pt: 4 }}>
                <Button
                  type="submit"
                  fullWidth
                  disabled={isPending || !values.planId}
                  variant="contained"
                  sx={{
                    bgcolor: GOLD,
                    color: '#000',
                    fontWeight: 800,
                    height: 52,
                    borderRadius: '12px',
                    fontSize: 16,
                    '&:disabled': { bgcolor: '#333', color: '#777' },
                  }}
                >
                  {isPending ? (
                    <CircularProgress size={24} sx={{ color: '#000' }} />
                  ) : (
                    'Proceed to Pay'
                  )}
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}