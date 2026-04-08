import { Card, CardContent, Skeleton, Typography, Box } from '@mui/material';

type Props = {
  loading?: boolean;
  totalPoints?: number;
  totalCash?: number;
};

function fmtNGN(n: number) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `₦${n.toLocaleString()}`;
  }
}

export default function DesktopSponsorRelatedStatsCards({
  loading,
  totalPoints = 0,
  totalCash = 0,
}: Props) {
  const CardBox = ({ title, value }: { title: string; value: string }) => (
    <Card
      sx={{
        bgcolor: '#1a1a1a',
        border: '1px solid #2f2f2f',
        borderRadius: 2,
        minWidth: 260,
      }}
    >
      <CardContent>
        <Typography sx={{ color: '#A2A2A2', fontWeight: 800, fontSize: 12 }}>
          {title}
        </Typography>
        <Typography sx={{ color: '#FFFCF4', fontWeight: 900, fontSize: 28 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))',
        gap: 2,
      }}
    >
      {loading ? (
        <>
          <Skeleton variant='rounded' height={96} />
          <Skeleton variant='rounded' height={96} />
        </>
      ) : (
        <>
          <CardBox title='CHIPS' value={String(totalPoints)} />
          <CardBox title='CHIPS VALUE' value={fmtNGN(totalCash)} />
        </>
      )}
    </Box>
  );
}
