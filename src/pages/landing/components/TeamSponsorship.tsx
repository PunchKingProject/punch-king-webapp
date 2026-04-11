// src/pages/landing/components/TeamSponsorship.tsx
import { Box, Typography, useMediaQuery } from '@mui/material';
import { colors } from '../../../theme/colors.ts';
import { rankingBoxer } from '../../../assets'; // use any image you prefer

type Props = {
  imageSrc?: string;
};

const PAD_X = {
  xs: '1.88em',
  '@media (min-width:910px) and (max-width:1000px)': { padding: '0 2em' },
  '@media (min-width:1000px) and (max-width:1100px)': { padding: '0 1em' },
  '@media (min-width:1100px)': { padding: '0 5.38em' },
};

export default function TeamSponsorship({ imageSrc = rankingBoxer }: Props) {
  const isTabletUp = useMediaQuery('(min-width:910px)');

  return (
    <Box id='sponsorship' sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ padding: PAD_X }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mb: { xs: 3, md: 4 },
          }}
        >
          <Typography
            component='h2'
            sx={{
              fontWeight: 900,
              letterSpacing: 0.2,
              fontSize: 'clamp(2rem, 5vw, 7.625rem)',
              lineHeight: 1,
            }}
          >
            TEAM
          </Typography>
          <Typography
            component='h2'
            sx={{
              textTransform: 'uppercase',
              fontWeight: 800,
              color: colors.Accent,
              fontSize: { xs: '2.25rem', md: '3rem' },
              mt: { xs: -1, md: -2 },
            }}
          >
            Sponsorship
          </Typography>
        </Box>

        {/* Content */}
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2.5, md: 6 },
            gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
            alignItems: 'start',
          }}
        >
          {/* Left: Copy */}
          <Box sx={{ maxWidth: { md: 640 } }}>
            <Typography
              sx={{ color: '#CFCFCF', mb: 2, fontSize: { xs: 14, md: 16 } }}
            >
              Go all out and support your favorite teams by sponsoring their
              quest to compete in the Punch King African boxing tournament. Your
              sponsorship is very crucial as it is the only tool to give your
              favorite team a chance to shine on a continental stage.
            </Typography>
            <Typography
              sx={{ color: '#CFCFCF', mb: 2, fontSize: { xs: 14, md: 16 } }}
            >
              We also believe this should be made exciting for sponsors as we
              provide you with
              <strong> X2 cash pay outs</strong> of your sponsorship amount when
              your sponsored team qualifies.
            </Typography>
            <Typography sx={{ color: '#CFCFCF', fontSize: { xs: 14, md: 16 } }}>
              Place an instant order for sponsorship to support your favorite
              team.
            </Typography>
          </Box>

          {/* Right: Image */}
          <Box sx={{ display: 'grid', placeItems: 'center' }}>
            <Box
              component='img'
              src={imageSrc}
              alt='Team Sponsorship'
              sx={{
                width: '100%',
                maxWidth: isTabletUp ? 560 : 520,
                aspectRatio: '16 / 9',
                objectFit: 'cover',
                borderRadius: 3,
                boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
