import { Box, Skeleton, Typography } from '@mui/material';

type Props = {
  loading?: boolean;
  posts?: number;
  comments?: number;
  uniqueSponsors?: number;
};

// Typography spec (Poppins 700, 16/30, centered)
const titleSx = {
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 700,
  fontSize: 16,
  lineHeight: 1,
  letterSpacing: 0,
//   textAlign: 'center' as const,
  color: '#A2A2A2',
  mb: 2
};

const valueSx = {
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 700,
  fontSize: 30,
  lineHeight: 1,
  letterSpacing: 0,
//   textAlign: 'center' as const,
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

export default function DesktopCatalogueStatsCards({
  loading,
  posts = 0,
  comments = 0,
  uniqueSponsors = 0,
}: Props) {
  if (loading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant='rectangular' height={120} />
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2.5,
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
      }}
    >
      <Card title='TOTAL POSTS' value={posts} />
      <Card title='TOTAL COMMENTS' value={comments} />
      <Card title='UNIQUE SPONSORS' value={uniqueSponsors} />
    </Box>
  );
}
