// src/pages/admin/Teams/components/catalogue/TeamPostModal.tsx
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { isVideo } from '../../../../../../utils/helpers.ts';
import type { TeamPost } from '../../../api/teams.types.ts';

type Props = { open: boolean; onClose: () => void; item?: TeamPost | null };

export default function TeamPostModal({ open, onClose, item }: Props) {
  const isSm = useMediaQuery('(max-width:600px)');
  const video = item ? isVideo(item.file_url) : false;
  
  // Cast to any to access the new fields without strict type errors
  const extendedItem = item as any;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isSm ? '95vw' : 580,
          maxWidth: 600,
          borderRadius: 2,
          bgcolor: '#111',
          color: '#fff',
          border: '2px solid #EFAF00',
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
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
            height: isSm ? 220 : 300,
            mb: 3,
            bgcolor: '#000',
          }}
        >
          {!!item && (
            <>
              {video ? (
                <video
                  src={item.file_url}
                  controls
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <img
                  src={item.file_url}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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
                  {/* Optional: Add a custom play button overlay here if needed */}
                </Box>
              )}
            </>
          )}
        </Box>

        {!!item && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Header / Title */}
            <Box>
              <Typography sx={{ color: '#fff', fontSize: '1.4rem', fontWeight: 900, lineHeight: 1.2 }}>
                {item.title}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mt: 0.5 }}>
                {extendedItem.team || 'Professional Team'} • {new Date(item.created_at).toLocaleDateString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Pill label='Sponsorships' value={item.sponsorships || 0} />
              <Pill label='Sponsors' value={item.sponsors || 0} />
            </Box>

            {/* Fighter Details Grid */}
            {extendedItem.boxer_name && (
              <Box sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.03)', p: 2, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography sx={{ color: '#EFAF00', fontWeight: 900, mb: 1.5, fontSize: '1.1rem' }}>
                  Fighter Details
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                  <L label="Boxer" v={extendedItem.boxer_name} />
                  <L label="Class" v={extendedItem.weight_class} />
                  
                  {extendedItem.boxer_weight_kg && (
                    <L label="Weight" v={`${extendedItem.boxer_weight_kg} kg`} />
                  )}
                  {extendedItem.shorts_color && (
                    <L label="Trunks" v={extendedItem.shorts_color} />
                  )}
                  {extendedItem.glove_color && (
                    <L label="Gloves" v={extendedItem.glove_color} />
                  )}
                </Box>

                {/* Opponent Details (Rendered only if provided) */}
                {extendedItem.opponent_name && (
                  <>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
                    <Typography sx={{ color: '#EFAF00', fontWeight: 900, mb: 1.5, fontSize: '1rem' }}>
                      Opponent Details
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                      <L label="Opponent" v={extendedItem.opponent_name} />
                      {extendedItem.opponent_weight_kg && (
                        <L label="Weight" v={`${extendedItem.opponent_weight_kg} kg`} />
                      )}
                      {extendedItem.opponent_shorts_color && (
                        <L label="Trunks" v={extendedItem.opponent_shorts_color} />
                      )}
                    </Box>
                  </>
                )}

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
                
                {extendedItem.sparring_location && (
                  <L label="Location" v={extendedItem.sparring_location} labelWidth="80px" />
                )}
              </Box>
            )}

            {/* Description / Caption */}
            {item.caption && (
              <Box sx={{ mt: 1 }}>
                <Typography sx={{ color: '#EFAF00', fontWeight: 800, mb: 0.5 }}>
                  Description
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  {item.caption}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Updated L component to support dynamic widths and wrapping text
function L({ label, v, labelWidth = '70px' }: { label: string; v: string | number; labelWidth?: string }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `${labelWidth} 1fr`,
        alignItems: 'start',
      }}
    >
      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.85rem' }}>
        {label}:
      </Typography>
      <Typography sx={{ color: '#fff', fontSize: '0.9rem', wordBreak: 'break-word' }}>
        {v}
      </Typography>
    </Box>
  );
}

function Pill({ label, value }: { label: string; value: number }) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.75,
        bgcolor: '#FFC107',
        color: '#000',
        borderRadius: 1,
        fontWeight: 800,
        fontSize: '0.9rem',
        minWidth: 120,
        textAlign: 'center',
        flex: { xs: 1, sm: 'none' } // Stretches on mobile, fits content on desktop
      }}
    >
      {value} {label}
    </Box>
  );
}