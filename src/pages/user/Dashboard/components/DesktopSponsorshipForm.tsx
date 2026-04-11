import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip, CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { useVoteForPost } from '../hooks/useVoteForPost.ts';
import { showError } from '../../../../utils/error/toastError.ts';

const gold = '#EFAF00';

type Props = {
  postId: number;
  teamName: string;
  teamPosition?: string;
  mediaUrl?: string | null;
  sponsors?: number;
  contributors?: number;
};

const cardSx = {
  background: '#1A1A1A',
  border: '1px solid #3B3B3B',
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  borderRadius: '12px',
};

type FormValues = {
  amount: string; // keep as string for the input
};

export default function DesktopSponsorshipForm({
  postId,
  teamName,
  teamPosition,
  mediaUrl,
  sponsors,
  contributors,
}: Props) {
  const { mutateAsync, isPending } = useVoteForPost();

  return (
    <Box sx={{ display: 'grid', gap: 2, maxWidth: 430 }}>
      {/* Title */}
      <Typography variant='h4' sx={{ color: '#fff', fontWeight: 900 }}>
        SPONSORSHIP
      </Typography>

      {/* Meta */}
      <Typography sx={{ color: '#EFAF00', fontWeight: 700 }}>
        TEAM NAME:&nbsp;
        <span style={{ color: '#fff' }}>{teamName || '—'}</span>
      </Typography>
      <Typography sx={{ color: '#EFAF00', fontWeight: 700 }}>
        POSITION:&nbsp;
        <span style={{ color: '#fff' }}>{teamPosition || '—'}</span>
      </Typography>

      {/* Media */}
      <Card sx={{ ...cardSx, p: 1 }}>
        {mediaUrl ? (
          <CardMedia
            component='img'
            image={mediaUrl}
            alt={teamName}
            sx={{ height: 220, objectFit: 'cover', borderRadius: '10px' }}
          />
        ) : (
          <Box sx={{ height: 220, bgcolor: '#2a2a2a', borderRadius: '10px' }} />
        )}
      </Card>

      {/* Chips */}
      <Box sx={{ display: 'flex', gap: 2 }}>
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
          }}
        />
      </Box>

      <Formik<FormValues>
        initialValues={{ amount: '5' }}
        validateOnMount
        validate={(values) => {
          const errors: Partial<Record<keyof FormValues, string>> = {};
          const raw = values.amount.trim();
          if (!raw) errors.amount = 'Amount is required';
          else if (!/^\d+$/.test(raw)) errors.amount = 'Enter a whole number';
          else if (Number(raw) < 5) errors.amount = 'Amount must be at least 5';
          return errors;
        }}
        onSubmit={async (vals, helpers) => {
          try {
            const amount = parseInt(vals.amount.trim(), 10);
            await mutateAsync({ post_id: postId, amount });
            toast.success('Sponsorship submitted successfully.');
            helpers.resetForm({ values: { amount: '5' } });
          } catch (err: unknown) {
            showError(err);
          }
        }}
      >
        {(formikProps) => {
          const {
            values,
            errors,
            touched,
            setFieldValue,
            handleBlur,
            isSubmitting,
            isValid,
          } = formikProps;

          return (
            <Form noValidate>
              <Card sx={cardSx}>
                <CardContent sx={{ display: 'grid', gap: 1 }}>
                  <TextField
                    type='text'
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
                      touched.amount && errors.amount
                        ? errors.amount
                        : 'Minimum sponsorship: 5 chips'
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

              <Button
                type='submit'
                fullWidth
                disabled={!isValid || isPending || isSubmitting}
                variant='contained'
                sx={{
                  bgcolor: gold,
                  color: '#000',
                  textTransform: 'none',
                  fontWeight: 700,
                  height: 44,
                  borderRadius: '10px',
                  mt: 1.5,
                  '&.Mui-disabled': {
                    bgcolor: '#333',
                    color: '#777',
                  },
                }}
              >
                {isPending ? (
                  <CircularProgress size={20} sx={{ color: '#000' }} />
                ) : (
                  'Sponsor'
                )}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}
