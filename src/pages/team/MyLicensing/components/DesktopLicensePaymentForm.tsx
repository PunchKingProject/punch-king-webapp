// import {
//   Box,
//   Button,
//   CircularProgress,
//   FormControl,
//   InputLabel,
//   Link,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
//   type SelectChangeEvent,
// } from '@mui/material';
// import { Form, Formik } from 'formik';
// import { useState } from 'react';
// import { toast } from 'react-toastify';
// import { uploadTeamImage } from '../../../../api/media.ts';
// import { useCreateLicensePayment } from '../hooks/useCreateLicensePayment.ts';
// import { showError } from '../../../../utils/error/toastError.ts';
//
// const GOLD = '#EFAF00';
// type Plan = 'annual' | 'semiannual'; // 6 months
//
// const PRICING: Record<Plan, number> = {
//   annual: 20000,
//   semiannual: 10000,
// };
//
// const labelSx = { fontWeight: 800, fontSize: 14, lineHeight: 1.2 };
// const valueSx = { color: '#A2A2A2', mt: 0.5, fontSize: 14 };
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
// type FormValues = {
//   plan: Plan;
//   slipUrl: string; // url after /img upload
// };
//
// export default function DesktopLicensePaymentForm() {
//   const [preview, setPreview] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//
//   const { mutateAsync, isPending } = useCreateLicensePayment();
//
//   const initialValues: FormValues = {
//     plan: 'annual',
//     slipUrl: '',
//   };
//
//   return (
//     <Box>
//       <Typography component='h2' variant='h2' sx={{ fontWeight: 900, mb: 2 }}>
//         PAYMENT DETAILS
//       </Typography>
//
//       <Formik<FormValues>
//         initialValues={initialValues}
//         validate={(vals) => {
//           const errs: Partial<Record<keyof FormValues, string>> = {};
//           if (!vals.plan) errs.plan = 'Choose a plan';
//           if (!vals.slipUrl) errs.slipUrl = 'Upload proof of payment';
//           return errs;
//         }}
//         onSubmit={async (vals, helpers) => {
//           try {
//             const payment_amount = PRICING[vals.plan];
//
//             await mutateAsync({
//               payment_amount,
//               payment_slip: vals.slipUrl,
//             });
//
//             toast.success('License payment submitted.');
//             helpers.resetForm({ values: initialValues });
//             setPreview((prev) => {
//               if (prev) URL.revokeObjectURL(prev);
//               return null;
//             });
//           } catch (e) {
//             showError(e);
//           } finally {
//             helpers.setSubmitting(false);
//           }
//         }}
//       >
//         {({
//           values,
//           errors,
//           touched,
//           setFieldValue,
//           setFieldTouched,
//           isSubmitting,
//         }) => {
//           const cost = PRICING[values.plan];
//
//           const handlePlanChange = (e: SelectChangeEvent<Plan>) => {
//             setFieldValue('plan', e.target.value as Plan, true);
//           };
//
//           const handlePickFile = async (file: File | null) => {
//             if (!file) return;
//             try {
//               setUploading(true);
//               // local preview (revoke previous to avoid leaks)
//               setPreview((prev) => {
//                 if (prev) URL.revokeObjectURL(prev);
//                 return URL.createObjectURL(file);
//               });
//
//               const url = await uploadTeamImage(file);
//               await setFieldValue('slipUrl', url, true);
//               await setFieldTouched('slipUrl', true, false);
//               toast.success('Slip uploaded.');
//             } catch (e) {
//               showError(e);
//               setPreview((prev) => {
//                 if (prev) URL.revokeObjectURL(prev);
//                 return null;
//               });
//               await setFieldValue('slipUrl', '', true);
//               await setFieldTouched('slipUrl', true, false);
//             } finally {
//               setUploading(false);
//             }
//           };
//
//           return (
//             <Form noValidate>
//               <Box
//                 sx={{
//                   display: 'grid',
//                   gridTemplateColumns: { xs: '1fr', md: '1fr 360px' },
//                   gap: 4,
//                   alignItems: 'start',
//                 }}
//               >
//                 {/* Left: static bank we pay into */}
//                 <Box>
//                   <Typography sx={{ color: GOLD, fontWeight: 800, mb: 0.5 }}>
//                     PAY INTO THIS ACCOUNT TO GET YOUR LICENSE
//                   </Typography>
//                   <Typography sx={{ color: '#A2A2A2', fontSize: 12, mb: 2 }}>
//                     You are strongly advised to read our disclaimer
//                   </Typography>
//
//                   <Box sx={{ mb: 1.25 }}>
//                     <Typography sx={labelSx}>Bank name:</Typography>
//                     <Typography sx={valueSx}>GTB</Typography>
//                   </Box>
//                   <Box sx={{ mb: 1.25 }}>
//                     <Typography sx={labelSx}>Account number:</Typography>
//                     <Typography sx={valueSx}>0129459037</Typography>
//                   </Box>
//                   <Box sx={{ mb: 1.25 }}>
//                     <Typography sx={labelSx}>Account name:</Typography>
//                     <Typography sx={valueSx}>Punchking</Typography>
//                   </Box>
//                 </Box>
//
//                 {/* Right: plan + cost */}
//                 <Box sx={{ display: 'grid', gap: 1.5 }}>
//                   <FormControl fullWidth>
//                     <InputLabel id='plan-label' sx={{ color: '#EDEDED' }}>
//                       Choose plan
//                     </InputLabel>
//                     <Select
//                       labelId='plan-label'
//                       value={values.plan}
//                       label='Choose plan'
//                       onChange={handlePlanChange}
//                       sx={{
//                         '& .MuiInputBase-root': {
//                           bgcolor: '#101010',
//                           color: '#EDEDED',
//                         },
//                       }}
//                     >
//                       <MenuItem value='annual'>
//                         Annual Licensing plan
//                       </MenuItem>
//                       {/* <MenuItem value='semiannual'>
//                         6 months subscription
//                       </MenuItem> */}
//                     </Select>
//                     <Typography
//                       sx={{ color: '#f44336', fontSize: 12, mt: 0.5 }}
//                     >
//                       {touched.plan && errors.plan ? errors.plan : ' '}
//                     </Typography>
//                   </FormControl>
//
//                   <TextField
//                     label='Cost (auto generated)'
//                     value={fmtNGN(cost)}
//                     InputProps={{ readOnly: true }}
//                     sx={{
//                       '& .MuiInputBase-root': {
//                         bgcolor: '#101010',
//                         color: '#EDEDED',
//                       },
//                       '& .MuiInputBase-input': { color: '#EDEDED' },
//                     }}
//                     InputLabelProps={{ sx: { color: '#EDEDED' } }}
//                   />
//                 </Box>
//               </Box>
//
//               {/* Slip + status */}
//               <Box
//                 sx={{
//                   mt: 6,
//                   display: 'grid',
//                   gridTemplateColumns: { xs: '1fr', md: '1fr 320px' },
//                   gap: 4,
//                   alignItems: 'start',
//                 }}
//               >
//                 <Box>
//                   <Typography
//                     component='h3'
//                     sx={{ fontWeight: 900, fontSize: 20, mb: 2 }}
//                   >
//                     PROOF OF PAYMENT
//                   </Typography>
//
//                   <Box
//                     sx={{
//                       position: 'relative',
//                       width: 320,
//                       height: 200,
//                       borderRadius: 2,
//                       bgcolor: '#1A1A1A',
//                       border: '1px solid #3B3B3B',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       overflow: 'hidden',
//                     }}
//                   >
//                     {preview ? (
//                       <img
//                         src={preview}
//                         alt='Payment slip preview'
//                         style={{
//                           width: '100%',
//                           height: '100%',
//                           objectFit: 'cover',
//                         }}
//                       />
//                     ) : (
//                       <Typography sx={{ color: '#A2A2A2' }}>
//                         No file chosen
//                       </Typography>
//                     )}
//
//                     {uploading && (
//                       <Box
//                         sx={{
//                           position: 'absolute',
//                           inset: 0,
//                           bgcolor: 'rgba(0,0,0,0.35)',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                         }}
//                       >
//                         <CircularProgress size={36} />
//                       </Box>
//                     )}
//                   </Box>
//
//                   <Box sx={{ mt: 1 }}>
//                     <input
//                       id='slip'
//                       name='slip'
//                       type='file'
//                       accept='image/*'
//                       style={{ display: 'none' }}
//                       onChange={async (e) => {
//                         const f = e.currentTarget.files?.[0] ?? null;
//                         await handlePickFile(f);
//                       }}
//                     />
//                     <label htmlFor='slip'>
//                       <Link
//                         component='span'
//                         underline='hover'
//                         sx={{ color: GOLD, fontWeight: 700, cursor: 'pointer' }}
//                       >
//                         {values.slipUrl ? 'Replace' : 'Upload'}
//                       </Link>
//                     </label>
//                     <Typography sx={{ color: '#f44336', fontSize: 12 }}>
//                       {touched.slipUrl && errors.slipUrl ? errors.slipUrl : ' '}
//                     </Typography>
//                   </Box>
//                 </Box>
//
//                 <Box>
//                   <Typography sx={{ fontWeight: 900, fontSize: 16, mb: 1 }}>
//                     PURCHASE STATUS
//                   </Typography>
//                   <Box
//                     sx={{
//                       border: '1px solid #FFC107',
//                       color: '#FFC107',
//                       borderRadius: '12px',
//                       height: 28,
//                       display: 'inline-flex',
//                       alignItems: 'center',
//                       px: 1.25,
//                       fontWeight: 600,
//                     }}
//                   >
//                     Pending
//                   </Box>
//                 </Box>
//               </Box>
//
//               <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
//                 <Button
//                   type='submit'
//                   disabled={isSubmitting || isPending || uploading}
//                   variant='contained'
//                   sx={{
//                     bgcolor: GOLD,
//                     color: '#000',
//                     textTransform: 'none',
//                     fontWeight: 700,
//                     height: 44,
//                     borderRadius: '10px',
//                     px: 6,
//                   }}
//                 >
//                   {isSubmitting || isPending ? 'Please wait…' : 'Pay'}
//                 </Button>
//               </Box>
//             </Form>
//           );
//         }}
//       </Formik>
//     </Box>
//   );
// }


import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useGetLicensePlans } from '../hooks/useGetLicensePlans.ts';
import { useCreateLicensePayment } from '../hooks/useCreateLicensePayment.ts';
import { showError } from '../../../../utils/error/toastError.ts';

const GOLD = '#EFAF00';
const inputBg = '#101010';
const textColor = '#EDEDED';

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

type FormValues = {
  planId: string;
};

export default function DesktopLicensePaymentForm() {
  const { data: plans, isLoading: loadingPlans } = useGetLicensePlans();
  const { mutateAsync, isPending } = useCreateLicensePayment();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 120px)', // Adjust 120px based on your Header height
        width: '100%',
        pb: 10,
      }}
    >
      <Typography component="h2" variant="h2" sx={{ fontWeight: 900, mb: 4 }}>
        LICENSE ACQUISITION
      </Typography>

      <Formik<FormValues>
        initialValues={{ planId: '' }}
        validate={(vals) => {
          const errs: Partial<Record<keyof FormValues, string>> = {};
          if (!vals.planId) errs.planId = 'Please select a license type';
          return errs;
        }}
        onSubmit={async (vals) => {
          try {
            const selectedPlan = plans?.find((p) => String(p.id) === vals.planId);
            if (!selectedPlan) return;

            // Date format: ISO T00:00:00Z
            const isoDate = new Date().toISOString().split('T')[0] + 'T00:00:00Z';

            const response = await mutateAsync({
              plan_id: Number(vals.planId),
              payment_date: isoDate,
            });

            // REDIRECT LOGIC: Take the link from the response.data and open in new tab
            if (response?.data) {
              window.open(response.data, '_blank', 'noopener,noreferrer');
            }
          } catch (e) {
            showError(e);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => {
          const selectedPlan = plans?.find((p) => String(p.id) === values.planId);

          return (
            <Form noValidate style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { md: '1fr 400px' },
                  gap: 6,
                  flexGrow: 1,
                }}
              >
                {/* Left Side: Plan Selection & Info */}
                <Box>
                  <Typography sx={{ color: GOLD, fontWeight: 800, mb: 0.5 }}>
                    DIRECT BANK TRANSFER
                  </Typography>
                  <Typography sx={{ color: '#A2A2A2', fontSize: 13, mb: 4 }}>
                    Your license will be activated automatically once the transfer is confirmed by the system.
                  </Typography>

                  <Box sx={{ maxWidth: 500 }}>
                    <FormControl fullWidth error={Boolean(touched.planId && errors.planId)}>
                      <InputLabel sx={{ color: textColor }}>Select License Type</InputLabel>
                      <Select
                        name="planId"
                        value={values.planId}
                        label="Select License Type"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loadingPlans}
                        sx={{
                          bgcolor: inputBg,
                          color: textColor,
                          '& .MuiSvgIcon-root': { color: textColor },
                        }}
                      >
                        {plans?.map((plan) => (
                          <MenuItem key={plan.id} value={String(plan.id)}>
                            {plan.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.planId && errors.planId && (
                        <Typography variant="caption" sx={{ mt: 0.5, color: '#f44336' }}>
                          {errors.planId}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ mt: 6, p: 3, bgcolor: '#161616', borderRadius: 2, borderLeft: `4px solid ${GOLD}` }}>
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

                {/* Right Side: Order Summary */}
                <Box
                  sx={{
                    bgcolor: '#111',
                    p: 4,
                    borderRadius: 3,
                    border: '1px solid #222',
                    height: 'fit-content',
                    position: 'sticky',
                    top: 20,
                  }}
                >
                  <Typography sx={{ fontWeight: 900, fontSize: 18, color: textColor, mb: 3 }}>
                    ORDER SUMMARY
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ color: '#888' }}>License:</Typography>
                    <Typography sx={{ color: textColor, fontWeight: 600 }}>
                      {selectedPlan?.name || 'Not selected'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Typography sx={{ color: '#888' }}>Validity Period:</Typography>
                    <Typography sx={{ color: textColor }}>365 Days</Typography>
                  </Box>

                  <Box sx={{ borderTop: '1px solid #333', pt: 3, mb: 4 }}>
                    <Typography sx={{ color: '#888', fontSize: 12, mb: 1 }}>Total Payable</Typography>
                    <Typography variant="h3" sx={{ color: GOLD, fontWeight: 900 }}>
                      {selectedPlan
                        ? fmtPrice(selectedPlan.price, selectedPlan.currency)
                        : '₦0'
                      }
                    </Typography>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    disabled={isPending || loadingPlans}
                    variant="contained"
                    sx={{
                      bgcolor: GOLD,
                      color: '#000',
                      fontWeight: 800,
                      height: 54,
                      fontSize: 16,
                      '&:hover': { bgcolor: '#d39e00' },
                    }}
                  >
                    {isPending ? <CircularProgress size={24} color="inherit" /> : 'Proceed to Pay'}
                  </Button>
                </Box>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}
