import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  Typography,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { useVoteForPost } from '../hooks/useVoteForPost';
import { showError } from '../../../../utils/error/toastError';

const gold = '#EFAF00';

type Props = {
  postId: number | undefined;
  teamName: string;
  teamPosition?: string;
  mediaUrl?: string | null;
  sponsors?: number;
  contributors?: number;
  onBuy: () => void;
};

type FormValues = { amount: string };

const cardSx = {
  background: '#1A1A1A',
  border: '1px solid #3B3B3B',
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  borderRadius: '12px',
};

export default function MobileSponsorshipForm({
  postId,
  teamName,
  teamPosition,
  mediaUrl,
  sponsors,
  contributors,
//   onBuy,
}: Props) {


  const { mutateAsync, isPending } = useVoteForPost();

  return (
    <Box sx={{ display: 'grid', gap: 1.25, maxWidth: 520 }}>
      {/* Meta */}
      <Box sx={{ display: 'grid', gap: 0.25 }}>
        <Typography sx={{ color: '#EFAF00', fontWeight: 700, fontSize: 12 }}>
          {' '}
          TEAM NAME:&nbsp;
          <span style={{ color: '#fff' }}>{teamName || '—'}</span>
        </Typography>
        <Typography sx={{ color: '#EFAF00', fontWeight: 700, fontSize: 12 }}>
          POSITION:&nbsp;
          <span style={{ color: '#fff' }}>{teamPosition || '—'}</span>
        </Typography>
      </Box>
      {/* Media */}
      <Card sx={{ ...cardSx, p: 0.75 }}>
        {mediaUrl ? (
          <CardMedia
            component='img'
            image={mediaUrl}
            alt={teamName}
            sx={{ height: 200, objectFit: 'cover', borderRadius: '10px' }}
          />
        ) : (
          <Box sx={{ height: 200, bgcolor: '#2a2a2a', borderRadius: '10px' }} />
        )}
      </Card>
      {/* Chips */}
      <Box sx={{ display: 'flex', gap: 1.25 }}>
        <Chip
          icon={<GroupsIcon sx={{ color: gold }} />}
          label={
            <span style={{ display: 'flex', gap: 6 }}>
              <b style={{ color: '#fff' }}>{sponsors ?? 0}</b>
              <span style={{ color: '#C9C9C9' }}>Sponsors</span>
            </span>
          }
          sx={{
            bgcolor: 'transparent',
            border: '1px solid #3B3B3B',
            color: '#fff',
            height: 32,
          }}
        />
        <Chip
          icon={<Diversity3Icon sx={{ color: gold }} />}
          label={
            <span style={{ display: 'flex', gap: 6 }}>
              <b style={{ color: '#fff' }}>{contributors ?? 0}</b>
              <span style={{ color: '#C9C9C9' }}>Contributors</span>
            </span>
          }
          sx={{
            bgcolor: 'transparent',
            border: '1px solid #3B3B3B',
            color: '#fff',
            height: 32,
          }}
        />
      </Box>
      {/* Form */}
      <Formik<FormValues>
        initialValues={{ amount: '5' }}
        validateOnMount
        validate={(values) => {
          const errors: Partial<Record<keyof FormValues, string>> = {};
          const raw = values.amount.trim();
          if (!raw) errors.amount = 'Amount is required';
          else if (!/^\d+$/.test(raw)) errors.amount = 'Enter a whole number';
          else if (Number(raw) < 1) errors.amount = 'Amount must be at least 1';
          return errors;
        }}
        onSubmit={async (vals, helpers) => {
          try {
            if (!postId) throw new Error('Missing post.');
            const amount = parseInt(vals.amount.trim(), 10);
            await mutateAsync({ post_id: postId, amount });
            toast.success('Sponsorship submitted successfully.');
            helpers.resetForm({ values: { amount: '1' } });
          } catch (err: unknown) {
            showError(err);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          handleBlur,
          isSubmitting,
        }) => {
          const amountValid =
            /^\d+$/.test(values.amount.trim()) && Number(values.amount) >= 1;

          return (
            <Form noValidate>
              <Card sx={cardSx}>
                <CardContent sx={{ display: 'grid', gap: 1 }}>
                  <TextField
                    type='text' // keep text; we sanitize manually
                    name='amount'
                    label='Enter number of chips'
                    value={values.amount}
                    onChange={(e) => {
                      const next = e.target.value.replace(/[^\d]/g, '');
                      setFieldValue('amount', next);
                    }}
                    onBlur={handleBlur}
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '\\d*',
                    }}
                    error={Boolean(touched.amount && errors.amount)}
                    helperText={
                      touched.amount && errors.amount ? errors.amount : ' '
                    }
                    sx={{
                      '& .MuiInputBase-root': {
                        bgcolor: '#101010',
                        color: '#EDEDED',
                      },
                      '& .MuiFormLabel-root': { color: '#aaa' },
                    }}
                  />
                </CardContent>
              </Card>
              <Box sx={{ display: 'flex', gap: 1.25, mt: 1.25 }}>
                <Button
                  type='submit'
                  disabled={!amountValid || isPending || isSubmitting}
                  variant='contained'
                  sx={{
                    bgcolor: gold,
                    color: '#000',
                    textTransform: 'none',
                    fontWeight: 700,
                    height: 44,
                    borderRadius: '10px',
                    flex: 1,
                  }}
                >
                  {isPending ? 'Submitting…' : 'Sponsor'}
                </Button>

                {/* <Button
                  type='button'
                  onClick={onBuy}
                  variant='outlined'
                  sx={{
                    borderColor: gold,
                    color: gold,
                    textTransform: 'none',
                    fontWeight: 700,
                    height: 44,
                    borderRadius: '10px',
                    flex: 1,
                  }}
                >
                  Buy Units
                </Button> */}
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}
