import { Box, Skeleton, Typography } from '@mui/material';

type Props = {
  loading?: boolean;
  sponsorships?: number;
  sponsors?: number;
  value?: number;
  rank?: number;
};

// shared text styles (your spec)
const titleSx = {
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 700,
  fontSize: 16,
  lineHeight: 1, // 100%
  letterSpacing: 0,
  //   textAlign: 'center' as const,
  color: '#A2A2A2',
  mb: 2,
};

const valueSx = {
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 700,
  fontSize: 30,
  lineHeight: 1, // 100%
  letterSpacing: 0,
  //   textAlign: 'center' as const,
  color: '#A2A2A2',
};

const Card = ({ title, value }: { title: string; value: string | number }) => (
  <Box
    sx={{
      p: 2,

      bgcolor: 'rgba(255,255,255,0.03)',
      minHeight: 120,
      //   display: 'flex',
      //   flexDirection: 'column',
      //   justifyContent: 'space-between',
      boxShadow: '2px 2px 10px 2px #2B2B2BB0',
      border: '1px solid #3B3B3B',
      backgroundColor: '#1A1A1A',
      borderRadius: '10px',
    }}
  >
    <Typography sx={titleSx}>{title}</Typography>
    <Typography sx={valueSx}>{value}</Typography>
  </Box>
);

export default function DesktopMySponsorshipStatsCards({
  loading,
  sponsorships = 0,
  sponsors = 0,
  value = 0,
  rank = 0,
}: Props) {
  const fmtUSD = (n: number) =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(
      Number.isFinite(n) ? n : 0
    );

  if (loading) {
    return (
      <Box  
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant='rectangular' height={120} />
        ))}
      </Box>
    );
  }

  // grid: 3 metrics + ranking drops to next row (like your mock)
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2.5,
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
      }}
    >
      <Card title='CHIPS' value={sponsorships} />
      <Card title='SPONSORS' value={sponsors} />
      <Card title='CHIPS VALUE' value={fmtUSD(value)} />
      <Card title='MY RANKING' value={`${rank || 0}TH`.toUpperCase()} />
    </Box>
  );
}
