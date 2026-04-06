import { Box, Dialog, DialogContent, IconButton, Typography, useMediaQuery } from "@mui/material";
import type { ReactNode } from "react";
import { colors } from "../../../../../../theme/colors.ts";
import CloseRounded from '@mui/icons-material/CloseRounded';


type Props = {
  open: boolean;
  onClose: () => void;
  /** Title / caption area you want under the media */
  body?: ReactNode;
  /** The media element (img or video) */
  media: ReactNode;
}

function MobilePostModal({ open, onClose, media, body }: Props) {
      const isXs = useMediaQuery('(max-width:600px)');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isXs}
      PaperProps={{
        sx: {
          bgcolor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(1px)',
          borderRadius: isXs ? 0 : 2,
          border: `1px solid ${colors.Accent}`,
          mx: isXs ? 0 : 2,
        },
      }}
    >
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography
          onClick={onClose}
          sx={{
            color: colors.Accent,
            fontWeight: 700,
            cursor: 'pointer',
            mr: 1,
          }}
        >
          Close
        </Typography>
        <IconButton onClick={onClose} sx={{ color: colors.Accent }}>
          <CloseRounded />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 0 }}>
        <Box
          sx={{
            border: `1px solid ${colors.Accent}`,
            borderRadius: 2,
            overflow: 'hidden',
            mx: 'auto',
            width: '100%',
            maxWidth: 520,
          }}
        >
          {media}
        </Box>

        {body && <Box sx={{ mt: 2, maxWidth: 520, mx: 'auto' }}>{body}</Box>}
      </DialogContent>
    </Dialog>
  );
}

export default MobilePostModal