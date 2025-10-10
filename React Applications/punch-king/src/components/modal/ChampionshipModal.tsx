import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { colors } from '../../theme/colors';
import { modalImage } from '../../assets';

type Props = {
  open: boolean;
  onClose: () => void;
  imageSrc: string; // right-side portrait
  logoSrc?: string; // optional: gold Punch King logo (left column)
  onSignup?: () => void; // optional: navigate to signup
};

const GOLD = '#EFAF00';

export default function ChampionshipModal({
  open,
  onClose,
//   imageSrc,
  logoSrc,
  onSignup,
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='lg'
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          bgcolor: '#0E0E0E',
          border: '1px solid #2C2C2C',
          borderRadius: fullScreen ? 0 : 3,
          boxShadow: '0 24px 64px rgba(0,0,0,0.65)',
        },
      }}
    >
      {/* header bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1, pl: 2 }}>
        <Typography
          component='h2'
          sx={{
            fontWeight: 900,
            fontSize: { xs: 18, sm: 20 },
            color: colors.Freeze,
          }}
        >
          Punch King African Championship
        </Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton
          onClick={onClose}
          aria-label='Close'
          sx={{ color: colors.Freeze, '&:hover': { color: GOLD } }}
          size='small'
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 0 }}>
        {/* two-column desktop, stacked mobile */}
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2, md: 4 },
            gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
            alignItems: 'start',
          }}
        >
          {/* LEFT: Logo + headline + copy + buttons */}
          <Box
            sx={{
              p: { xs: 2, md: 3 },
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid #2F2F2F',
              borderRadius: 2,
            }}
          >
            {logoSrc ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mb: { xs: 1, md: 1.5 },
                }}
              >
                <Box
                  component='img'
                  alt='Punch King'
                  src={logoSrc}
                  sx={{
                    width: { xs: 220, sm: 260, md: 320 },
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              </Box>
            ) : null}
            <Box
              sx={{
                position: 'relative',
                // top: '-200px',
              }}
            >
              {/* Big stacked headline like the design */}
              <Typography
                component='div'
                sx={{
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  fontSize: { xs: 40, sm: 50, md: 50 },
                  lineHeight: 1.05,
                  mt: 1,
                  // color: colors.Freeze,
                }}
              >
                AFRICAN
              </Typography>
              <Typography
                component='div'
                sx={{
                  fontWeight: 900,
                  textTransform: 'capitalize',
                  fontSize: { xs: 36, sm: 46, md: 48 },
                  lineHeight: 1.05,
                  mb: 2,
                  // color: colors.Freeze,
                }}
              >
                Championship
              </Typography>

              {/* body blocks, kept tight like the mock */}
              <Typography
                sx={{ color: '#CFCFCF', mb: 2, fontSize: { xs: 13, sm: 14 } }}
              >
                Are you ready for the ultimate rumble in the jungle!
              </Typography>

              <Typography
                sx={{ color: '#CFCFCF', mb: 2, fontSize: { xs: 13, sm: 14 } }}
              >
                8 African boxing teams with the most sponsorship are invited for
                a 2&nbsp;months non-stop boxing action to crown the Punch King
                African champion. Signup and subscribe to a plan to
                automatically submit your team for the race to collect the most
                sponsorship by individual sponsors already on the platform. The
                8 most sponsored teams after the closure of sponsorship period
                are qualified for the quarter finals and will compete for the
                Punch King crown.
              </Typography>

              {/* quick facts */}
              <Box sx={{ display: 'grid', gap: 0.75, mb: 2 }}>
                <InfoRow label='Bout' value='4 rounds' />
                <InfoRow label='Weight Category' value='Welter-weight' />
                <InfoRow label='Age' value='18–25' />
              </Box>

              {/* prizes */}
              <Box
                sx={{
                  border: '1px solid #3B3B3B',
                  borderRadius: 2,
                  p: 1.5,
                  mb: 2,
                  bgcolor: 'rgba(255,255,255,0.02)',
                }}
              >
                <PrizeRow
                  label='Punch King Champion'
                  value='₦50 million naira worth of professional contract, continental endorsement deals, and more.'
                />
                <PrizeRow label='Finalist' value='₦20 million naira.' />
                <PrizeRow label='Semi finalist' value='₦10 million naira.' />
                <PrizeRow label='Quarter finalist' value='₦5 million naira.' />
              </Box>

              <Typography
                sx={{
                  textAlign: 'left',
                  fontWeight: 900,
                  color: colors.Freeze,
                  fontSize: { xs: 16, sm: 18 },
                  mb: 2,
                }}
              >
                MARCH 25th 2026
              </Typography>

              {/* CTA buttons (styled like design) */}
              {/* CTA buttons */}
              <Box
                sx={{
                  display: 'grid',
                  gap: 1,
                  maxWidth: 260,
                  width: '100%', // let buttons stretch within this width
                  mx: 'auto', // ⬅️ center the whole block
                  justifyItems: 'center', // ⬅️ center children (the buttons)
                }}
              >
                <Button
                  onClick={onSignup}
                  variant='contained'
                  sx={{
                    bgcolor: GOLD,
                    color: '#C28E02',
                    textTransform: 'none',
                    fontWeight: 700,
                    height: 40,
                    borderRadius: 1,
                    width: '100%', // ⬅️ make the button fill the centered block
                    '&:hover': { bgcolor: '#FFC533' },
                  }}
                >
                  Sign up
                </Button>

                <Button
                  onClick={onClose}
                  variant='outlined'
                  sx={{
                    borderColor: '#6B6B6B',
                    color: '#C28E02',
                    backgroundColor: '#FFFCF4',
                    textTransform: 'none',
                    fontWeight: 600,
                    height: 36,
                    borderRadius: 1,
                    width: '100%', // ⬅️ fill the centered block
                  }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          </Box>

          {/* RIGHT: portrait image (sits above on mobile) */}
          <Box
            sx={{
              order: { xs: -1, md: 0 }, // image first on mobile (like your mobile mock)
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Box
              component='img'
              src={modalImage}
              alt='Championship poster'
              sx={{
                width: '100%',
                maxWidth: 520,
                aspectRatio: '3 / 4',
                objectFit: 'cover',
                borderRadius: 2,
                border: '1px solid #3B3B3B',
              }}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Typography
        sx={{ color: '#9E9E9E', fontWeight: 800, minWidth: 130, fontSize: 12 }}
      >
        {label}:
      </Typography>
      <Typography sx={{ color: '#EDEDED', fontSize: 12 }}>{value}</Typography>
    </Box>
  );
}

function PrizeRow({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '220px 1fr' },
        gap: 1,
        mb: 0.5,
      }}
    >
      <Typography sx={{ color: GOLD, fontWeight: 800, fontSize: 12 }}>
        {label}
      </Typography>
      <Typography sx={{ color: '#CFCFCF', fontSize: 12 }}>{value}</Typography>
    </Box>
  );
}
