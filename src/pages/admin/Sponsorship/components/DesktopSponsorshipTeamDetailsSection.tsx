import { Box, Skeleton, Typography } from '@mui/material';

export type SponsorshipTeamDetails = {
  team_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  address?: string | null;
  country?: string | null;
  state?: string | null;
};

const fallback = 'complete your profile';

const Row = ({ label, value }: { label: string; value?: string | null }) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography sx={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>
      {label}:
    </Typography>
    <Typography sx={{ color: '#A2A2A2', mt: 0.75, fontSize: 14 }}>
      {value || fallback}
    </Typography>
  </Box>
);

type Props = {
  loading?: boolean;
  team?: SponsorshipTeamDetails | null;
};

export default function DesktopSponsorshipTeamDetailsSection({
  loading,
  team,
}: Props) {


  if (loading) {
    return (
      <Box sx={{ maxWidth: 880 }}>
        <Skeleton height={36} width={240} sx={{ mb: 2 }} />
        <Skeleton height={22} width='60%' sx={{ mb: 1 }} />
        <Skeleton height={22} width='40%' sx={{ mb: 3 }} />
        <Skeleton height={22} width='55%' sx={{ mb: 1 }} />
        <Skeleton height={22} width='35%' sx={{ mb: 3 }} />
      </Box>
    );
  }

  const t = team || {};

  return (
    <Box sx={{ width: '80%', mx: 'auto' }}>
      <Typography component='h1' variant='h1' sx={{ fontWeight: 900 }}>
        TEAM DETAILS
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 4,
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          maxWidth: 880,
          mx: 0,
          mt: 2,
        }}
      >
        {/* Left */}
        <Box>
          <Row label='Team name' value={t.team_name ?? undefined} />
          <Row label='Phone number' value={t.phone_number ?? undefined} />
          <Row label='Country' value={t.country ?? undefined} />
        </Box>

        {/* Right */}
        <Box>
          <Row label='Team email' value={t.email ?? undefined} />
          <Row label='Address' value={t.address ?? undefined} />
          <Row label='State' value={t.state ?? undefined} />
        </Box>
      </Box>
    </Box>
  );
}
