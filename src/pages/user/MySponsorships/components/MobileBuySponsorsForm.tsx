// import {
//   Box,
//   Button,
//   CircularProgress,
//   IconButton,
//   Link,
//   TextField,
//   Tooltip,
//   Typography,
// } from '@mui/material';
// import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
// import { Formik, Form } from 'formik';
// import { useEffect, useMemo, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { uploadTeamImage } from '../../../../api/media.ts';
// import { useCreateSponsorPurchase } from '../hooks/useCreateSponsorPurchase.ts';
// import { showError } from '../../../../utils/error/toastError.ts';
//
// const gold = '#EFAF00';
// const UNIT_PRICE_NGN = 1000;
//
// type FormValues = {
//   amount: string; // units (digits only)
//   slipUrl: string; // uploaded/forwarded slip url
// };
//
// const labelSx = {
//   fontWeight: 800,
//   fontSize: 12,
//   lineHeight: 1.1,
//   color: '#FFFCF4',
// };
// const valueSx = { color: '#A2A2A2', mt: 0.5, fontSize: 13 };
//
// function fmtNGN(n: number) {
//   try {
//     return new Intl.NumberFormat(undefined, {
//       style: 'currency',
//       currency: 'NGN',
//     }).format(n);
//   } catch {
//     return `₦${n.toLocaleString()}`;
//   }
// }
//
// async function copyToClipboard(text: string) {
//   try {
//     await navigator.clipboard.writeText(text);
//     toast.success('Copied to clipboard');
//   } catch {
//     toast.error('Failed to copy');
//   }
// }
//
// export default function MobileBuySponsorsForm() {
//   // pick slip passed via navigation state (optional)
//   const { state } = useLocation() as { state?: { slipUrl?: string } };
//   const slipFromState = state?.slipUrl ?? '';
//
//   const [preview, setPreview] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const { mutateAsync, isPending } = useCreateSponsorPurchase();
//
//   useEffect(() => {
//     if (slipFromState) setPreview(slipFromState);
//   }, [slipFromState]);
//
//   const initialValues: FormValues = useMemo(
//     () => ({ amount: '10', slipUrl: slipFromState }), // default “10” like screenshot
//     [slipFromState]
//   );
//
//   return (
//     <Box sx={{ mt: 3 }}>
//       {/* Amount + Cost */}
//       <Formik<FormValues>
//         enableReinitialize
//         initialValues={initialValues}
//         validate={(vals) => {
//           const errs: Partial<Record<keyof FormValues, string>> = {};
//           const raw = (vals.amount ?? '').trim();
//           if (!raw) errs.amount = 'Enter units quantity';
//           else if (!/^\d+$/.test(raw)) errs.amount = 'Enter a whole number';
//           else if (parseInt(raw, 10) < 1) errs.amount = 'Must be at least 1';
//           return errs;
//         }}
//         onSubmit={async (vals, helpers) => {
//           try {
//             const points = parseInt(vals.amount, 10);
//             const payment_amount = points * UNIT_PRICE_NGN;
//             const slip = vals.slipUrl || slipFromState || '';
//
//             await mutateAsync({ points, payment_amount, payment_slip: slip });
//             toast.success('Purchase request submitted.');
//             helpers.setFieldValue('amount', '1', false);
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
//           handleBlur,
//           isSubmitting,
//         }) => {
//           const amountNum = Number.parseInt(values.amount || '0', 10);
//           const cost =
//             Number.isFinite(amountNum) && amountNum > 0
//               ? amountNum * UNIT_PRICE_NGN
//               : 0;
//
//           const blockWeirdNumberKeys = (
//             e: React.KeyboardEvent<HTMLInputElement>
//           ) => {
//             if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
//           };
//
//           const handlePickFile = async (file: File | null) => {
//             if (!file) return;
//             try {
//               setUploading(true);
//               setPreview((prev) => {
//                 if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
//                 return URL.createObjectURL(file);
//               });
//               const url = await uploadTeamImage(file);
//               await setFieldValue('slipUrl', url, false);
//               toast.success('Slip uploaded.');
//             } catch (e) {
//               showError(e);
//               setPreview(slipFromState || null);
//               await setFieldValue('slipUrl', slipFromState, false);
//             } finally {
//               setUploading(false);
//             }
//           };
//
//           const canSubmit =
//             /^\d+$/.test(values.amount || '') &&
//             parseInt(values.amount, 10) >= 1 &&
//             !isSubmitting &&
//             !isPending &&
//             !uploading;
//
//           return (
//             <Form noValidate>
//               {/* Inputs */}
//               <Box sx={{ mt: 2, display: 'grid', gap: 1.5 }}>
//                 <TextField
//                   name='amount'
//                   type='number'
//                   inputProps={{
//                     min: 1,
//                     inputMode: 'numeric',
//                     pattern: '[0-9]*',
//                   }}
//                   value={values.amount}
//                   label='Enter units quantity'
//                   onKeyDown={blockWeirdNumberKeys}
//                   onChange={(e) => {
//                     const digitsOnly = e.target.value.replace(/[^\d]/g, '');
//                     setFieldValue('amount', digitsOnly, false);
//                   }}
//                   onBlur={handleBlur}
//                   error={Boolean(touched.amount && errors.amount)}
//                   helperText={(touched.amount && errors.amount) || ' '}
//                   sx={{
//                     '& .MuiInputBase-root': {
//                       bgcolor: '#101010',
//                       color: '#EDEDED',
//                     },
//                     '& .MuiFormLabel-root': { color: '#aaa' },
//                   }}
//                 />
//
//                 <TextField
//                   label='₦ Cost (auto)'
//                   value={cost ? fmtNGN(cost) : ''}
//                   InputProps={{ readOnly: true }}
//                   sx={{
//                     '& .MuiInputBase-root': { bgcolor: '#101010' },
//                     '& .MuiInputBase-input': { color: '#EDEDED' },
//                   }}
//                   InputLabelProps={{ sx: { color: '#EDEDED' } }}
//                 />
//               </Box>
//
//               {/* Payment Details */}
//               <Box sx={{ mt: 3 }}>
//                 <Typography
//                   sx={{
//                     fontWeight: 900,
//                     fontSize: 16,
//                     color: '#FFFCF4',
//                     mb: 1,
//                   }}
//                 >
//                   PAYMENT DETAILS
//                 </Typography>
//                 <Typography
//                   sx={{ color: '#EFAF00', fontWeight: 800, fontSize: 12 }}
//                 >
//                   PAY INTO THIS ACCOUNT TO GET SPONSORSHIP UNITS
//                 </Typography>
//                 <Typography sx={{ color: '#A2A2A2', fontSize: 12, mb: 2 }}>
//                   You are strongly advised to read our disclaimer
//                 </Typography>
//
//                 <Box sx={{ mb: 1.25 }}>
//                   <Typography sx={labelSx}>Bank name:</Typography>
//                   <Typography sx={valueSx}>GTB</Typography>
//                 </Box>
//
//                 <Box
//                   sx={{
//                     mb: 1.25,
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 1,
//                   }}
//                 >
//                   <Box>
//                     <Typography sx={labelSx}>Account number:</Typography>
//                     <Typography sx={valueSx}>0129459037</Typography>
//                   </Box>
//                   <Tooltip title='Copy'>
//                     <IconButton
//                       size='small'
//                       onClick={() => copyToClipboard('0129459037')}
//                       sx={{
//                         border: '1px solid #3B3B3B',
//                         borderRadius: 1.5,
//                         color: '#EDEDED',
//                         p: 0.5,
//                       }}
//                     >
//                       <ContentCopyRounded fontSize='inherit' />
//                     </IconButton>
//                   </Tooltip>
//                 </Box>
//
//                 <Box sx={{ mb: 1.25 }}>
//                   <Typography sx={labelSx}>Account name:</Typography>
//                   <Typography sx={valueSx}>Punchking</Typography>
//                 </Box>
//               </Box>
//
//               {/* Proof of Payment */}
//               <Box sx={{ mt: 3 }}>
//                 <Typography
//                   sx={{
//                     fontWeight: 900,
//                     fontSize: 16,
//                     mb: 1.5,
//                     color: '#FFFCF4',
//                   }}
//                 >
//                   PROOF OF PAYMENT
//                 </Typography>
//
//                 <Box
//                   sx={{
//                     position: 'relative',
//                     width: '100%',
//                     maxWidth: 260,
//                     height: 170,
//                     borderRadius: 2,
//                     bgcolor: '#1A1A1A',
//                     border: '1px solid #3B3B3B',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     overflow: 'hidden',
//                   }}
//                 >
//                   {preview ? (
//                     <img
//                       src={preview}
//                       alt='Payment slip preview'
//                       style={{
//                         width: '100%',
//                         height: '100%',
//                         objectFit: 'cover',
//                       }}
//                     />
//                   ) : (
//                     <Typography sx={{ color: '#A2A2A2' }}>
//                       No file attached
//                     </Typography>
//                   )}
//
//                   {uploading && (
//                     <Box
//                       sx={{
//                         position: 'absolute',
//                         inset: 0,
//                         bgcolor: 'rgba(0,0,0,0.35)',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                       }}
//                     >
//                       <CircularProgress size={30} />
//                     </Box>
//                   )}
//                 </Box>
//
//                 <Box sx={{ mt: 1 }}>
//                   <input
//                     id='slipFile'
//                     name='slipFile'
//                     type='file'
//                     accept='image/*'
//                     style={{ display: 'none' }}
//                     onChange={async (e) => {
//                       const file = e.currentTarget.files?.[0] ?? null;
//                       await handlePickFile(file);
//                     }}
//                   />
//                   <label htmlFor='slipFile'>
//                     <Link
//                       component='span'
//                       underline='hover'
//                       sx={{ color: gold, fontWeight: 700, cursor: 'pointer' }}
//                     >
//                       {values.slipUrl || slipFromState
//                         ? 'change picture'
//                         : 'upload picture'}
//                     </Link>
//                   </label>
//                 </Box>
//               </Box>
//
//               {/* Status + CTA */}
//               <Box sx={{ mt: 3 }}>
//                 <Typography
//                   sx={{
//                     fontWeight: 900,
//                     fontSize: 14,
//                     mb: 0.75,
//                     color: '#FFFCF4',
//                   }}
//                 >
//                   PURCHASE STATUS
//                 </Typography>
//                 <Box
//                   sx={{
//                     border: '1px solid #FFC107',
//                     color: '#FFC107',
//                     borderRadius: '12px',
//                     height: 28,
//                     display: 'inline-flex',
//                     alignItems: 'center',
//                     px: 1.25,
//                     fontWeight: 700,
//                     mb: 2,
//                   }}
//                 >
//                   Pending
//                 </Box>
//
//                 <Button
//                   type='submit'
//                   disabled={!canSubmit}
//                   variant='contained'
//                   fullWidth
//                   sx={{
//                     bgcolor: gold,
//                     color: '#000',
//                     textTransform: 'none',
//                     fontWeight: 800,
//                     height: 44,
//                     borderRadius: '10px',
//                     opacity: !canSubmit ? 0.7 : 1,
//                   }}
//                 >
//                   {isSubmitting || isPending ? 'Please wait…' : 'Buy'}
//                 </Button>
//
//                 {/* Lightweight hint */}
//                 {!/^\d+$/.test(values.amount || '') && (
//                   <Typography
//                     sx={{
//                       textAlign: 'center',
//                       mt: 1,
//                       color: '#f0c040',
//                       fontSize: 12,
//                     }}
//                   >
//                     Enter a valid amount (whole number ≥ 1) to continue.
//                   </Typography>
//                 )}
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
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { useCreateSponsorPurchase } from '../hooks/useCreateSponsorPurchase.ts';
import { useGetSponsorshipRates } from '../hooks/useGetSponsorshipRates.ts';
import { showError } from '../../../../utils/error/toastError.ts';

const gold = '#EFAF00';
const inputBg = '#101010';
const textColor = '#EDEDED';

type FormValues = {
  rateId: string;
  nameOnCard: string;
};

export default function MobileBuySponsorsForm() {
  const { mutateAsync, isPending } = useCreateSponsorPurchase();
  const { data: rates, isLoading: loadingRates } = useGetSponsorshipRates();

  const initialValues: FormValues = {
    rateId: '',
    nameOnCard: '',
  };

  return (
      <Box sx={{ mt: 2, pb: 4 }}>
        <Typography
            component="h2"
            sx={{ fontWeight: 900, fontSize: 20, color: '#FFFCF4', mb: 2 }}
        >
          PURCHASE SPONSORSHIP UNITS
        </Typography>

        <Formik<FormValues>
            initialValues={initialValues}
            validate={(vals) => {
              const errs: Partial<Record<keyof FormValues, string>> = {};
              if (!vals.rateId) errs.rateId = 'Select a package';
              if (!vals.nameOnCard.trim()) errs.nameOnCard = 'Name on card required';
              return errs;
            }}
            onSubmit={async (vals, helpers) => {
              try {
                const response = await mutateAsync({
                  rate_id: Number(vals.rateId),
                  name_on_card: vals.nameOnCard,
                });

                if (response?.data) {
                  toast.success('Redirecting to payment...');
                  // Same tab redirect for mobile stability
                  window.location.href = response.data;
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
              handleBlur,
              handleChange,
              isSubmitting,
            }) => {
            const currentRate = rates?.find((r) => String(r.id) === values.rateId);

            const canSubmit =
                values.rateId &&
                values.nameOnCard.trim() &&
                !isSubmitting &&
                !isPending;

            return (
                <Form noValidate>
                  <Box sx={{ display: 'grid', gap: 2.5 }}>
                    {/* Selection Section */}
                    <Box sx={{ display: 'grid', gap: 2 }}>
                      <Typography sx={{ color: gold, fontWeight: 800, fontSize: 13 }}>
                        SELECT A PACKAGE
                      </Typography>

                      <FormControl fullWidth error={Boolean(touched.rateId && errors.rateId)}>
                        <InputLabel id="rate-label-mobile" sx={{ color: '#aaa' }}>
                          Choose Plan
                        </InputLabel>
                        <Select
                            labelId="rate-label-mobile"
                            name="rateId"
                            value={values.rateId}
                            label="Choose Plan"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={{
                              bgcolor: inputBg,
                              color: textColor,
                              '& .MuiSvgIcon-root': { color: gold }
                            }}
                        >
                          {loadingRates ? (
                              <MenuItem disabled>Loading...</MenuItem>
                          ) : (
                              rates?.map((rate) => (
                                  <MenuItem key={rate.id} value={String(rate.id)}>
                                    {rate.points} Points — {rate.currency} {rate.price}
                                  </MenuItem>
                              ))
                          )}
                        </Select>
                        {touched.rateId && errors.rateId && (
                            <FormHelperText>{errors.rateId}</FormHelperText>
                        )}
                      </FormControl>

                      <TextField
                          name="nameOnCard"
                          label="Name On Card"
                          variant="outlined"
                          fullWidth
                          value={values.nameOnCard}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(touched.nameOnCard && errors.nameOnCard)}
                          helperText={touched.nameOnCard && errors.nameOnCard}
                          sx={{
                            '& .MuiInputBase-root': { bgcolor: inputBg, color: textColor },
                            '& .MuiFormLabel-root': { color: '#aaa' },
                          }}
                      />
                    </Box>

                    {/* Order Summary Card */}
                    <Box
                        sx={{
                          bgcolor: '#1A1A1A',
                          p: 2.5,
                          borderRadius: 2,
                          border: '1px solid #3B3B3B',
                          mt: 1
                        }}
                    >
                      <Typography sx={{ fontWeight: 800, color: gold, fontSize: 14, mb: 2 }}>
                        ORDER SUMMARY
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography sx={{ color: '#A2A2A2', fontSize: 14 }}>Units:</Typography>
                        <Typography sx={{ color: textColor, fontWeight: 700, fontSize: 14 }}>
                          {currentRate ? `${currentRate.points} pts` : '—'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography sx={{ color: '#A2A2A2', fontSize: 14 }}>Total:</Typography>
                        <Typography sx={{ color: gold, fontWeight: 900, fontSize: 18 }}>
                          {currentRate ? `${currentRate.currency} ${currentRate.price}` : '—'}
                        </Typography>
                      </Box>

                      <Button
                          type="submit"
                          disabled={!canSubmit}
                          variant="contained"
                          fullWidth
                          sx={{
                            bgcolor: gold,
                            color: '#000',
                            textTransform: 'none',
                            fontWeight: 800,
                            height: 48,
                            borderRadius: '10px',
                            '&:active': { bgcolor: '#d49b00' },
                            opacity: !canSubmit ? 0.7 : 1,
                          }}
                      >
                        {isSubmitting || isPending ? 'Processing...' : 'Pay Now'}
                      </Button>
                    </Box>

                    <Typography
                        sx={{
                          textAlign: 'center',
                          color: '#A2A2A2',
                          fontSize: 11,
                          px: 2,
                          lineHeight: 1.4
                        }}
                    >
                      Payments processed via Flutterwave. You will be redirected to a secure payment page.
                    </Typography>
                  </Box>
                </Form>
            );
          }}
        </Formik>
      </Box>
  );
}