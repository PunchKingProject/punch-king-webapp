import { Box, Button, CircularProgress, Typography, useMediaQuery } from "@mui/material";
import PKDialog from "./PkDialog";


export type PKImageDialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  src?: string | null;
  isLoading?: boolean;
  errorText?: string | null;
  onRetry?: () => void;
  actions?: React.ReactNode;
  /** draw a subtle frame/backdrop around image */
  frame?: boolean;
  /** specialized mobile layout for certificate preview */
  mobileCertificate?:boolean;
 
};


export default function PKImageDialog({
  open,
  onClose,
  title,
  src,
  isLoading = false,
  errorText = null,
  onRetry,
  actions,
  frame = true,
  mobileCertificate = false,
}: PKImageDialogProps) {
  const isMobile = useMediaQuery('(max-width:600px)');

  const useMobileCard = mobileCertificate && isMobile;

  // ===== Mobile certificate layout (screenshot style) =====
  if (useMobileCard) {
    return (
      <PKDialog
        open={open}
        onClose={onClose}
        // no heading row; “Close” is an inline text button in the top-right
        title={undefined}
        maxWidth='xs'
        fullWidth={false}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Close text in the top-right (matches design) */}
          <Box
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              color: '#F6C10A',
              fontWeight: 700,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            Close
          </Box>

          {/* White card with framed image */}
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 2,
              width: 'min(420px, 88vw)',
              maxHeight: '82vh',
              p: 1.5,
              boxShadow: 1,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxHeight: '74vh',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {isLoading ? (
                <CircularProgress />
              ) : errorText ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ mb: 1 }}>{errorText}</Typography>
                  {onRetry && <Button onClick={onRetry}>Retry</Button>}
                </Box>
              ) : src ? (
                <Box
                  component='img'
                  src={src}
                  alt='preview'
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '74vh',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <Typography sx={{ color: '#666' }}>
                  No image available
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </PKDialog>
    );
  }

  return (
    <PKDialog
      open={open}
      onClose={onClose}
      title={title}
      actions={actions}
      maxWidth='md'
    >
      <Box sx={{ display: 'grid', placeItems: 'center', pt: 1 }}>
        <Box
          sx={{
            width: 520,
            maxWidth: '100%',
            height: 360,
            borderRadius: 2,
            overflow: 'hidden',
            border: frame ? '1px solid #BDBDBD' : 'none',
            background: '#111',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : errorText ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ mb: 1 }}>{errorText}</Typography>
              {onRetry && <Button onClick={onRetry}>Retry</Button>}
            </Box>
          ) : src ? (
            <img
              src={src}
              alt='preview'
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <Typography sx={{ color: '#666' }}>No image available</Typography>
          )}
        </Box>
      </Box>
    </PKDialog>
  );
}