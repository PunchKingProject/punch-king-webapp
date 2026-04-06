// src/components/modal/MobileImagePickerDialog.tsx
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { useRef } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;

  /** Current image to preview (can be empty) */
  src?: string;

  /** Called with the picked file. You handle upload outside. */
  onPick: (file: File) => void | Promise<void>;

  /** Shows loading state on the button and prevents closing while busy */
  picking?: boolean;

  /** Button label (default: "Upload new") */
  actionLabel?: string;

  /** Accept attribute for the file input (default: images) */
  accept?: string;
};

export default function MobileImagePickerDialog({
  open,
  onClose,
  src,
  onPick,
  picking = false,
  actionLabel = 'Upload new',
  accept = 'image/*',
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Dialog
      open={open}
      onClose={picking ? undefined : onClose}
      PaperProps={{
        sx: {
          width: 340,
          borderRadius: 2,
          background: '#111',
          color: '#EDEDED',
          overflow: 'visible',
          position: 'relative',
        },
      }}
    >
      {/* Close (top-right) */}
      <Typography
        onClick={() => !picking && onClose()}
        sx={{
          position: 'absolute',
          right: 10,
          top: -28,
          color: '#F6C10A',
          fontWeight: 700,
          cursor: picking ? 'not-allowed' : 'pointer',
          pointerEvents: picking ? 'none' : 'auto',
          userSelect: 'none',
        }}
      >
        Close
      </Typography>

      <DialogContent sx={{ p: 2 }}>
        {/* Preview frame */}
        <Box
          sx={{
            borderRadius: 2,
            border: '2px solid #F6C10A',
            p: 1,
            background: '#0b0b0b',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 190,
              borderRadius: 1.5,
              overflow: 'hidden',
              background: '#1a1a1a',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {src ? (
              <img
                src={src}
                alt='team preview'
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Typography sx={{ color: '#777' }}>No image</Typography>
            )}
          </Box>
        </Box>

        {/* Action */}
        <Box sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant='contained'
            onClick={() => inputRef.current?.click()}
            disabled={picking}
            sx={{
              backgroundColor: '#F6C10A',
              color: '#000',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#e0ae07' },
            }}
          >
            {picking ? 'Uploading…' : actionLabel}
          </Button>

          {/* Hidden chooser */}
          <input
            ref={inputRef}
            type='file'
            accept={accept}
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              if (file) onPick(file);
              // reset so picking the same file twice still fires
              if (inputRef.current) inputRef.current.value = '';
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
