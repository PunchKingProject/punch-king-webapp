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
                          label="Enter Name On Card"
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