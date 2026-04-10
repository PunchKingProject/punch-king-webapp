import {
    Box,
    Button,
    Card,
    CardContent,
    // CardMedia,
    Skeleton,
    Typography,
} from '@mui/material';

const cardSx = {
  background: '#1A1A1A',
  border: '1px solid #3B3B3B',
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  borderRadius: '12px',
};

function isVideo(url: string): boolean {
  return /\.(mp4|mov|webm|ogg|avi)(\?.*)?$/i.test(url);
}

const gold = '#EFAF00';

type Row = {
  idx: number;
  id: number;
  img: string | null;
  caption: string;
  date: string;
  comments: number;
  sponsors: number;
};
type Props = {
  rows: Row[];
  loading?: boolean;
  onViewPost?: (id: number) => void;
  onViewComments?: (id: number) => void;
  onViewSponsors?: (id: number) => void;
};

export default function MobileMyCatalogue({
  rows,
  loading,
  onViewComments,
  onViewSponsors,
}: Props) {
  if (loading) {
    return (
      <Box sx={{ display: 'grid', gap: 1.25 }}>
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={`sk-${i}`} sx={cardSx}>
            <Box sx={{ p: 1.25 }}>
              <Skeleton
                variant='rectangular'
                height={160}
                sx={{ bgcolor: '#2a2a2a', borderRadius: 2 }}
              />
              <Skeleton
                variant='text'
                width='80%'
                sx={{ mt: 1, bgcolor: '#2a2a2a' }}
              />
              <Skeleton
                variant='text'
                width='60%'
                sx={{ bgcolor: '#2a2a2a' }}
              />
            </Box>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', gap: 1.75 }}>
      {rows.map((r) => (
        <Card key={r.id} sx={cardSx}>
          <Box sx={{ p: 1.25 }}>
            <Typography sx={{ color: '#fff', fontWeight: 800, mb: 0.75 }}>
              {r.idx}.
            </Typography>
            // MobileMyCatalogue.tsx — only the media box changes

            <Box
              sx={{
                border: '1px solid #EFAF00',
                borderRadius: 2,
                p: 0.5,
                mb: 1,
                bgcolor: '#111',
                height: 160,          // fixed height keeps cards compact
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {r.img ? (
                isVideo(r.img) ? (
                  <video
                    src={r.img}
                    style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', borderRadius: 4 }}
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={r.img}
                    alt='media'
                    style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', borderRadius: 4 }}
                  />
                )
              ) : (
                <Box sx={{ width: '100%', height: '100%', bgcolor: '#2a2a2a', borderRadius: 1 }} />
              )}
            </Box>

            <CardContent sx={{ p: 0 }}>
              <Typography
                sx={{ color: '#C9C9C9', fontWeight: 700, fontSize: 12 }}
              >
                Caption: <span style={{ color: '#FFF' }}>{r.caption}</span>
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  alignItems: 'center',
                  gap: 1,
                  mt: 1,
                }}
              >
                <Typography
                  sx={{ color: '#C9C9C9', fontWeight: 700, fontSize: 12 }}
                >
                  Posted:
                </Typography>
                <Typography
                  sx={{ color: '#9ED27B', fontWeight: 700, fontSize: 12 }}
                >
                  {r.date}
                </Typography>
                <Box />

                <Typography
                  sx={{ color: '#C9C9C9', fontWeight: 700, fontSize: 12 }}
                >
                  Comments:
                </Typography>
                <Typography sx={{ color: '#A2A2A2', fontSize: 12 }}>
                  {r.comments} Comments
                </Typography>
                <Button
                  onClick={() => onViewComments?.(r.id)}
                  variant='text'
                  sx={{
                    color: gold,
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 0,
                    minWidth: 0,
                  }}
                >
                  View
                </Button>

                <Typography
                  sx={{ color: '#C9C9C9', fontWeight: 700, fontSize: 12 }}
                >
                  Sponsors:
                </Typography>
                <Typography sx={{ color: '#A2A2A2', fontSize: 12 }}>
                  {r.sponsors}
                </Typography>
                <Button
                  onClick={() => onViewSponsors?.(r.id)}
                  variant='text'
                  sx={{
                    color: gold,
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 0,
                    minWidth: 0,
                  }}
                >
                  View
                </Button>
              </Box>
            </CardContent>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
