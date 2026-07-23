import { Box, Button, MenuItem, TextField, Typography, CircularProgress } from '@mui/material';
import { Form, Formik } from 'formik';
import { showError } from '../../../../utils/error/toastError.ts';
import { useCreateSubscription } from '../hooks/useCreateSubscription.ts';

const gold = '#EFAF00';

type FormValues = {
  planId: string;
  nameOnCard: string;
};

// 🚨 IMPORTANT: Change these 'id' numbers to match the exact plan IDs in your live database!
const HARDCODED_PLANS = [
  
  { id: 3, type: 'annual', price: 40, currency: 'USD' }
];

export default function MobileBuySubscriptionForm() {
  const { mutateAsync, isPending: isSubmitting } = useCreateSubscription();

  return (
    <Box sx={{ mt: 2 }}>
      <Formik<FormValues>
        initialValues={{ planId: '', nameOnCard: '' }}
        validate={(vals) => {
          const errs: Partial<Record<keyof FormValues, string>> = {};
          if (!vals.planId) errs.planId = 'Please select a plan';
          if (!vals.nameOnCard.trim()) errs.nameOnCard = 'Name on card is required';
          return errs;
        }}
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
        {({ values, handleChange, handleBlur, touched, errors }) => {
          // Find the selected plan from our hardcoded array
          const selectedPlan = HARDCODED_PLANS.find(p => String(p.id) === values.planId);

          return (
            <Form noValidate>
              <Box sx={{ display: 'grid', gap: 2.5 }}>
                
                {/* Hardcoded Dropdown */}
                <TextField
                  select
                  fullWidth
                  name='planId'
                  label='Choose Plan'
                  value={values.planId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.planId && errors.planId)}
                  helperText={touched.planId && errors.planId}
                  sx={{ '& .MuiInputBase-root': { bgcolor: '#101010', color: '#eee' } }}
                >
                  {HARDCODED_PLANS.map((p) => (
                    <MenuItem key={p.id} value={String(p.id)} sx={{ textTransform: 'capitalize' }}>
                      {p.type} Plan ({p.currency} {p.price.toLocaleString()})
                    </MenuItem>
                  ))}
                </TextField>

                {/* Name Input with Validation binding */}
                <TextField
                  fullWidth
                  name='nameOnCard'
                  label='Enter Name On Card'
                  value={values.nameOnCard}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.nameOnCard && errors.nameOnCard)}
                  helperText={touched.nameOnCard && errors.nameOnCard}
                  sx={{ '& .MuiInputBase-root': { bgcolor: '#101010', color: '#eee' } }}
                />

                {/* Summary Card */}
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