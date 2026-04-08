import { Box, Button, MenuItem, TextField, Typography, CircularProgress } from '@mui/material';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { showError } from '../../../../utils/error/toastError.ts';
import { useCreateSubscription } from '../hooks/useCreateSubscription.ts';
import { useGetSubscriptionPlans } from '../hooks/useGetSubscriptionPlans.ts';

const gold = '#EFAF00';
const inputBg = '#101010';
const textColor = '#EDEDED';

type FormValues = {
  planId: string;
  nameOnCard: string;
};

export default function DesktopBuySubscriptionForm() {
  const { mutateAsync, isPending: isSubmitting } = useCreateSubscription();
  const { data: plans, isLoading: loadingPlans } = useGetSubscriptionPlans();

  const initialValues: FormValues = {
    planId: '',
    nameOnCard: '',
  };

  return (
    <Box>
      <Typography component='h2' variant='h2' sx={{ fontWeight: 900, mb: 2 }}>
        UPGRADE SUBSCRIPTION
      </Typography>

      <Formik<FormValues>
        initialValues={initialValues}
        validate={(vals) => {
          const errs: Partial<Record<keyof FormValues, string>> = {};
          if (!vals.planId) errs.planId = 'Please select a plan';
          if (!vals.nameOnCard.trim()) errs.nameOnCard = 'Name on card is required';
          return errs;
        }}
        onSubmit={async (vals) => {
          try {
            // Generate the date at the point of sending
            const isoDate = new Date().toISOString().split('T')[0] + 'T00:00:00Z';

            const response = await mutateAsync({
              plan_id: Number(vals.planId),
              name_on_card: vals.nameOnCard,
              payment_date: isoDate,
            });

            if (response?.data) {
              toast.success('Redirecting to payment gateway...');
              window.open(response.data, '_blank', 'noopener,noreferrer');
            }
          } catch (err) {
            showError(err);
          }
        }}
      >
        {({ values, handleChange, handleBlur, touched, errors }) => {
          const selectedPlan = plans?.find(p => String(p.id) === values.planId);

          return (
            <Form noValidate>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 4, mt: 4 }}>
                {/* Inputs */}
                <Box sx={{ display: 'grid', gap: 3 }}>
                  <TextField
                    select
                    name='planId'
                    label={loadingPlans ? 'Loading plans...' : 'Select Subscription Plan'}
                    value={values.planId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.planId && errors.planId)}
                    helperText={touched.planId && errors.planId}
                    disabled={loadingPlans}
                    sx={{ '& .MuiInputBase-root': { bgcolor: inputBg, color: textColor } }}
                  >
                    {plans?.map((plan) => (
                      <MenuItem key={plan.id} value={String(plan.id)}>
                        {plan.type} — {plan.currency} {plan.price.toLocaleString()}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    name='nameOnCard'
                    label='Enter Name On Card'
                    value={values.nameOnCard}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.nameOnCard && errors.nameOnCard)}
                    helperText={touched.nameOnCard && errors.nameOnCard}
                    sx={{ '& .MuiInputBase-root': { bgcolor: inputBg, color: textColor } }}
                  />
                </Box>

                {/* Summary Card */}
                <Box sx={{ bgcolor: '#1A1A1A', p: 3, borderRadius: 2, border: '1px solid #3B3B3B' }}>
                  <Typography sx={{ color: gold, fontWeight: 800, mb: 2 }}>ORDER SUMMARY</Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ color: '#aaa' }}>Plan:</Typography>
                    <Typography sx={{ color: textColor }}>{selectedPlan?.type || '—'}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography sx={{ color: '#aaa' }}>Total:</Typography>
                    <Typography sx={{ color: gold, fontWeight: 900, fontSize: 20 }}>
                      {selectedPlan ? `${selectedPlan.currency} ${selectedPlan.price.toLocaleString()}` : '—'}
                    </Typography>
                  </Box>

                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    disabled={isSubmitting || !values.planId}
                    sx={{
                      bgcolor: gold,
                      color: '#000',
                      fontWeight: 700,
                      height: 48,
                      '&:hover': { bgcolor: '#d49b00' }
                    }}
                  >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Complete Payment'}
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