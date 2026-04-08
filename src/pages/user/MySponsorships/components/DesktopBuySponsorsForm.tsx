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
                                        label="Enter Name On Card"
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