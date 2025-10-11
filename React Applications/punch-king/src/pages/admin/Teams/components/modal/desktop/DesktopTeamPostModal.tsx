// src/pages/admin/Teams/components/catalogue/TeamPostModal.tsx
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import CloseRounded from '@mui/icons-material/CloseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import { isVideo } from '../../../../../../utils/helpers';
import type { TeamPost } from '../../../api/teams.types';

type Props = { open: boolean; onClose: () => void; item?: TeamPost | null };

export default function TeamPostModal({ open, onClose, item }: Props) {
  const isSm = useMediaQuery('(max-width:600px)');
  const video = item ? isVideo(item.file_url) : false;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isSm ? '95vw' : 520,
          borderRadius: 2,
          bgcolor: '#111',
          color: '#fff',
          border: '2px solid #EFAF00',
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={onClose} size='small' sx={{ color: '#EFAF00' }}>
            <CloseRounded />
          </IconButton>
        </Box>

        <Box
          sx={{
            position: 'relative',
            border: '2px solid #EFAF00',
            borderRadius: 1.5,
            overflow: 'hidden',
            height: 260,
            mb: 2,
          }}
        >
          {!!item && (
            <>
              {video ? (
                <video
                  src={item.file_url}
                  controls
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={item.file_url}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
              {video && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'grid',
                    placeItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <PlayArrowRounded sx={{ fontSize: 56, color: '#FFC107' }} />
                </Box>
              )}
            </>
          )}
        </Box>

        {!!item && (
          <Box sx={{ display: 'grid', gap: 1 }}>
            <L label='Title' v={item.title} />
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Pill label='Sponsorships' value={item.sponsorships} />
              <Pill label='Sponsors' value={item.sponsors} />
            </Box>
            {item.caption && (
              <Box sx={{ mt: 1 }}>
                <Typography sx={{ color: '#EFAF00', fontWeight: 700 }}>
                  Caption:
                </Typography>
                <Typography sx={{ color: '#fff' }}>{item.caption}</Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

function L({ label, v }: { label: string; v: string }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '90px 1fr',
        alignItems: 'baseline',
      }}
    >
      <Typography sx={{ color: '#EFAF00', fontWeight: 700 }}>
        {label}:
      </Typography>
      <Typography sx={{ color: '#fff' }}>{v}</Typography>
    </Box>
  );
}

function Pill({ label, value }: { label: string; value: number }) {
  return (
    <Box
      sx={{
        px: 1.25,
        py: 0.75,
        bgcolor: '#FFC107',
        color: '#000',
        borderRadius: 1,
        fontWeight: 800,
        minWidth: 120,
        textAlign: 'center',
      }}
    >
      {value} {label}
    </Box>
  );
}
