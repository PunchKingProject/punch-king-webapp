// // src/pages/user/MySponsorships/components/DesktopBuySponsorsForm.tsx
// import {
//   Box,
//   Button,
//   Link,
//   TextField,
//   Typography,
//   CircularProgress,
// } from '@mui/material';
// import { Form, Formik } from 'formik';
// import { useEffect, useMemo, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { useCreateSponsorPurchase } from '../hooks/useCreateSponsorPurchase.ts';
// import { showError } from '../../../../utils/error/toastError.ts';
// import { uploadTeamImage } from '../../../../api/media.ts';
//
// const gold = '#EFAF00';
// const UNIT_PRICE_NGN = 1000;
//
// type FormValues = {
//   amount: string; // digits only
//   slipUrl: string; // can be empty unless user replaces
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
//     }).format(n);
//   } catch {
//     return `₦${n.toLocaleString()}`;
//   }
// }
//
// export default function DesktopBuySponsorsForm() {
//   // read slip passed via navigate(..., { state: { slipUrl } })
//   const { state } = useLocation() as { state?: { slipUrl?: string } };
//   const slipFromState = state?.slipUrl ?? '';
//
//   const [preview, setPreview] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const { mutateAsync, isPending } = useCreateSponsorPurchase();
//
//   // show the slip from state as the preview initially
//   useEffect(() => {
//     if (slipFromState) setPreview(slipFromState);
//   }, [slipFromState]);
//
//   const initialValues: FormValues = useMemo(
//     () => ({ amount: '1', slipUrl: slipFromState }),
//     [slipFromState]
//   );
//
//   return (
//     <Box>
//       <Typography component='h2' variant='h2' sx={{ fontWeight: 900, mb: 2 }}>
//         PAYMENT DETAILS
//       </Typography>
//
//       <Formik<FormValues>
//         enableReinitialize
//         initialValues={initialValues}
//         validateOnMount
//         validate={(vals) => {
//           const errs: Partial<Record<keyof FormValues, string>> = {};
//           const raw = String(vals.amount ?? '').trim();
//           if (!raw) errs.amount = 'Enter units quantity';
//           else if (!/^\d+$/.test(raw)) errs.amount = 'Enter a whole number';
//           else if (parseInt(raw, 10) < 1) errs.amount = 'Must be at least 1';
//           // Do NOT validate slipUrl (comes from navigation or user may replace)
//           return errs;
//         }}
//         onSubmit={async (vals, helpers) => {
//           try {
//             const points = parseInt(vals.amount, 10);
//             const payment_amount = points * UNIT_PRICE_NGN;
//             const slip = vals.slipUrl || slipFromState || '';
//
//             await mutateAsync({ points, payment_amount, payment_slip: slip });
//
//             toast.success('Purchase request submitted.');
//             // keep the slip; only reset amount
//             helpers.setFieldValue('amount', '1', false);
//           } catch (err) {
//             showError(err);
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
//           const blockWeirdNumberKeys = (
//             e: React.KeyboardEvent<HTMLInputElement>
//           ) => {
//             if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
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
//               <Box
//                 sx={{
//                   display: 'grid',
//                   gridTemplateColumns: { xs: '1fr', md: '1fr 360px' },
//                   gap: 4,
//                   alignItems: 'start',
//                 }}
//               >
//                 {/* Left: bank details */}
//                 <Box>
//                   <Typography
//                     sx={{ color: '#EFAF00', fontWeight: 800, mb: 0.5 }}
//                   >
//                     PAY INTO THIS ACCOUNT TO GET SPONSORSHIP UNITS
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
//                 {/* Right: amount + cost */}
//                 <Box sx={{ display: 'grid', gap: 1.5 }}>
//                   <TextField
//                     name='amount'
//                     type='number'
//                     inputProps={{
//                       min: 1,
//                       inputMode: 'numeric',
//                       pattern: '[0-9]*',
//                     }}
//                     label='enter units quantity'
//                     value={values.amount}
//                     onKeyDown={blockWeirdNumberKeys}
//                     onChange={(e) => {
//                       const digitsOnly = e.target.value.replace(/[^\d]/g, '');
//                       setFieldValue('amount', digitsOnly, false); // no revalidate on each key
//                     }}
//                     onBlur={handleBlur}
//                     error={Boolean(touched.amount && errors.amount)}
//                     helperText={(touched.amount && errors.amount) || ' '}
//                     sx={{
//                       '& .MuiInputBase-root': {
//                         bgcolor: '#101010',
//                         color: '#EDEDED',
//                       },
//                       '& .MuiFormLabel-root': { color: '#aaa' },
//                     }}
//                   />
//
//                   <TextField
//                     label='Cost (auto generated)'
//                     value={cost ? fmtNGN(cost) : ''}
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
//               {/* Proof of payment */}
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
//                         No file attached
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
//                   {/* Optional: allow replacing the slip */}
//                   <Box sx={{ mt: 1 }}>
//                     <input
//                       id='slipFile'
//                       name='slipFile'
//                       type='file'
//                       accept='image/*'
//                       style={{ display: 'none' }}
//                       onChange={async (e) => {
//                         const file = e.currentTarget.files?.[0] ?? null;
//                         await handlePickFile(file);
//                       }}
//                     />
//                     <label htmlFor='slipFile'>
//                       <Link
//                         component='span'
//                         underline='hover'
//                         sx={{ color: gold, fontWeight: 700, cursor: 'pointer' }}
//                       >
//                         {values.slipUrl || slipFromState ? 'Replace' : 'Upload'}
//                       </Link>
//                     </label>
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
//               {/* Submit */}
//               <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
//                 <Button
//                   type='submit'
//                   disabled={!canSubmit}
//                   variant='contained'
//                   sx={{
//                     bgcolor: gold,
//                     color: '#000',
//                     textTransform: 'none',
//                     fontWeight: 700,
//                     height: 44,
//                     borderRadius: '10px',
//                     px: 6,
//                     opacity: !canSubmit ? 0.7 : 1,
//                   }}
//                 >
//                   {isSubmitting || isPending ? 'Please wait…' : 'Buy'}
//                 </Button>
//               </Box>
//
//               {/* Gentle hint only about amount */}
//               {!/^\d+$/.test(values.amount || '') && (
//                 <Typography
//                   sx={{
//                     textAlign: 'center',
//                     mt: 1,
//                     color: '#f0c040',
//                     fontSize: 12,
//                   }}
//                 >
//                   Enter a valid amount (whole number ≥ 1) to continue.
//                 </Typography>
//               )}
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

export default function DesktopBuySponsorsForm() {
    const { mutateAsync, isPending } = useCreateSponsorPurchase();
    // rates will default to undefined while loading; handle fallback in UI
    const { data: rates, isLoading: loadingRates } = useGetSponsorshipRates();

    const initialValues: FormValues = {
        rateId: '',
        nameOnCard: '',
    };

    return (
        <Box>
            <Typography component="h2" variant="h2" sx={{ fontWeight: 900, mb: 2 }}>
                PURCHASE SPONSORSHIP UNITS
            </Typography>

            <Formik<FormValues>
                initialValues={initialValues}
                validate={(vals) => {
                    const errs: Partial<Record<keyof FormValues, string>> = {};
                    if (!vals.rateId) errs.rateId = 'Please select a package';
                    if (!vals.nameOnCard.trim()) errs.nameOnCard = 'Name on card is required';
                    return errs;
                }}
                onSubmit={async (vals, helpers) => {
                    try {
                        // 1. Execute mutation
                        const response = await mutateAsync({
                            rate_id: Number(vals.rateId),
                            name_on_card: vals.nameOnCard,
                        });

                        if (response?.data) {
                            toast.success('Redirecting to payment gateway...');

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
                    // Logic to find current selection for the UI summary
                    const currentRate = rates?.find((r) => String(r.id) === values.rateId);

                    const canSubmit =
                        values.rateId &&
                        values.nameOnCard.trim() &&
                        !isSubmitting &&
                        !isPending;

                    return (
                        <Form noValidate>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                    gap: 4,
                                    alignItems: 'start',
                                    mt: 4
                                }}
                            >
                                {/* Left Side: Inputs */}
                                <Box sx={{ display: 'grid', gap: 3 }}>
                                    <Typography sx={{ color: gold, fontWeight: 800, mb: -1 }}>
                                        SELECT A SPONSORSHIP PACKAGE
                                    </Typography>

                                    <FormControl fullWidth error={Boolean(touched.rateId && errors.rateId)}>
                                        <InputLabel id="rate-label" sx={{ color: '#aaa' }}>Select Package</InputLabel>
                                        <Select
                                            labelId="rate-label"
                                            name="rateId"
                                            value={values.rateId}
                                            label="Select Package"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            sx={{
                                                bgcolor: inputBg,
                                                color: textColor,
                                                '& .MuiSvgIcon-root': { color: gold }
                                            }}
                                        >
                                            {loadingRates ? (
                                                <MenuItem disabled>Loading rates...</MenuItem>
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

                                {/* Right Side: Order Summary */}
                                <Box
                                    sx={{
                                        bgcolor: '#1A1A1A',
                                        p: 3,
                                        borderRadius: 2,
                                        border: '1px solid #3B3B3B',
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 800, color: gold, mb: 2 }}>
                                        ORDER SUMMARY
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography sx={{ color: '#A2A2A2' }}>Points to be added:</Typography>
                                        <Typography sx={{ color: textColor, fontWeight: 700 }}>
                                            {currentRate ? `${currentRate.points} Units` : '—'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                        <Typography sx={{ color: '#A2A2A2' }}>Total Cost:</Typography>
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
                                            fontWeight: 700,
                                            height: 48,
                                            borderRadius: '10px',
                                            '&:hover': { bgcolor: '#d49b00' },
                                            opacity: !canSubmit ? 0.7 : 1,
                                        }}
                                    >
                                        {isSubmitting || isPending ? 'Processing...' : 'Pay Now'}
                                    </Button>
                                </Box>
                            </Box>

                            <Typography sx={{ mt: 4, color: '#A2A2A2', fontSize: 12 }}>
                                Payments are securely processed via Flutterwave. By clicking "Pay Now", you agree to our terms of service.
                            </Typography>
                        </Form>
                    );
                }}
            </Formik>
        </Box>
    );
}