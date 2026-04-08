import { Box, Typography, Button, Link } from '@mui/material';
import dayjs from 'dayjs';
import type { BankInfo, SubApiRow } from '../api/subscriptions.types.ts';

type Props = {
  loading?: boolean;
  entry?: SubApiRow | null;
  onViewSlip?: () => void;
};

const field = (label: string, value?: string | null) => (
  <Box
    sx={{
      mb: 1.25,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 2,
      alignItems: 'center',
    }}
  >
    <Typography sx={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>
      {label}
    </Typography>
    <Typography sx={{ color: '#A2A2A2', mt: 0.5, fontSize: 14 }}>
      {value || 'N/A'}
    </Typography>
  </Box>
);

const fmtDateTime = (iso?: string | null) =>
  iso
    ? `${dayjs(iso).format('M/D/YYYY')}  ${dayjs(iso).format('h:mma')}`
    : 'N/A';

const fmtUSD = (n?: number | null) => {
  const v = typeof n === 'number' ? n : 0;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(v);
  } catch {
    return `$${v.toLocaleString()}`;
  }
};

const BankBlock = ({
  title,
  bank,
}: {
  title: string;
  bank?: BankInfo | null;
}) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography component='h3' sx={{ fontWeight: 900, fontSize: 16, mb: 1 }}>
      {title}
    </Typography>
    {field('Bank name:', bank?.bank_name)}
    {field('Account number:', bank?.account_number)}
    {field('Account name:', bank?.account_name)}
  </Box>
);

export default function DesktopSubscriptionPaymentDetailsSection({
  loading,
  entry,
  onViewSlip,
}: Props) {
  return (
    <Box id='payment-details' sx={{ mt: 6 }}>
      <Typography component='h2' variant='h2' sx={{ fontWeight: 900, mb: 2 }}>
        PAYMENT DETAILS
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 320px' },
          gap: 4,
          alignItems: 'start',
        }}
      >
        <Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            <BankBlock title='Paid into' bank={entry?.payment_into} />
            <BankBlock title='Paid from' bank={entry?.payment_from} />
          </Box>

          <Box
            sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.12)' }}
          >
            <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Box>
                <Typography
                  sx={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}
                >
                  Date and time
                </Typography>
                <Typography sx={{ mt: 0.5, fontSize: 14, fontWeight: 500 }}>
                  {fmtDateTime(entry?.payment_date)}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}
                >
                  amount paid
                </Typography>
                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#00C853',
                  }}
                >
                  {fmtUSD(entry?.payment_amount)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography
            component='h3'
            sx={{ fontWeight: 900, fontSize: 16, mb: 1 }}
          >
            Payment slip
          </Typography>

          <Box
            sx={{
              width: '100%',
              aspectRatio: '3 / 5',
              borderRadius: 1.5,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.12)',
              background: '#111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {loading ? (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  bgcolor: 'rgba(255,255,255,0.04)',
                }}
              />
            ) : entry?.payment_slip ? (
              <img
                src={entry.payment_slip}
                alt='Payment slip'
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Typography sx={{ color: '#A2A2A2', fontSize: 14 }}>
                No slip
              </Typography>
            )}
          </Box>

          {entry?.payment_slip && (
            <Box sx={{ mt: 1, display: 'flex', gap: 1.5 }}>
              <Button
                onClick={onViewSlip}
                variant='text'
                sx={{
                  color: '#f0c040',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 0,
                }}
              >
                View
              </Button>
              <Link
                href={entry.payment_slip}
                target='_blank'
                rel='noopener noreferrer'
                underline='hover'
                sx={{ color: '#f0c040', fontWeight: 600 }}
              >
                Open in new tab
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
