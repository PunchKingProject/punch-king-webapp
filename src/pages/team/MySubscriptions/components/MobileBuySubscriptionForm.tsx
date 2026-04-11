import { Box, Button, MenuItem, TextField, Typography, CircularProgress } from '@mui/material';
import { Form, Formik } from 'formik';
import { showError } from '../../../../utils/error/toastError.ts';
import { useCreateSubscription } from '../hooks/useCreateSubscription.ts';
import { useGetSubscriptionPlans } from '../hooks/useGetSubscriptionPlans.ts';

const gold = '#EFAF00';


type FormValues = {
  planId: string;
  nameOnCard: string;
};

export default function MobileBuySubscriptionForm() {
  const { mutateAsync, isPending: isSubmitting } = useCreateSubscription();
  const { data: plans, isLoading: loadingPlans } = useGetSubscriptionPlans();

  return (
    <Box sx={{ mt: 2 }}>
      <Formik<FormValues>
        initialValues={{ planId: '', nameOnCard: '' }}
        onSubmit={async (vals) => {
          try {
            const isoDate = new Date().toISOString().split('T')[0] + 'T00:00:00Z';

            const response = await mutateAsync({
              plan_id: Number(vals.planId),
              name_on_card: vals.nameOnCard,
              payment_date: isoDate,
            });

            if (response?.data) {
              window.location.href = response.data;
            }
          } catch (err) {
            showError(err);
          }
        }}
      >
        {({ values, handleChange, touched, errors }) => {
          const selectedPlan = plans?.find(p => String(p.id) === values.planId);

          return (
            <Form noValidate>
              <Box sx={{ display: 'grid', gap: 2.5 }}>
                <TextField
                  select
                  fullWidth
                  name='planId'
                  label={loadingPlans ? 'Fetching plans...' : 'Choose Plan'}
                  value={values.planId}
                  onChange={handleChange}
                  error={Boolean(touched.planId && errors.planId)}
                  disabled={loadingPlans}
                  sx={{ '& .MuiInputBase-root': { bgcolor: '#101010', color: '#eee' } }}
                >
                  {plans?.map((p) => (
                    <MenuItem key={p.id} value={String(p.id)}>
                      {p.type} ({p.currency} {p.price.toLocaleString()})
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  name='nameOnCard'
                  label='Enter Name On Card'
                  onChange={handleChange}
                  error={Boolean(touched.nameOnCard && errors.nameOnCard)}
                  sx={{ '& .MuiInputBase-root': { bgcolor: '#101010', color: '#eee' } }}
                />

                <Box sx={{ bgcolor: '#1A1A1A', p: 2.5, borderRadius: 2, border: '1px solid #333' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ color: '#aaa', fontSize: 14 }}>Total Due:</Typography>
                    <Typography sx={{ color: gold, fontWeight: 900 }}>
                      {selectedPlan ? `${selectedPlan.currency} ${selectedPlan.price.toLocaleString()}` : '—'}
                    </Typography>
                  </Box>

                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    disabled={isSubmitting || !values.planId || !values.nameOnCard.trim()}
                    sx={{
                      bgcolor: gold,
                      color: '#000',
                      fontWeight: 800,
                      height: 50,
                      borderRadius: '10px'
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