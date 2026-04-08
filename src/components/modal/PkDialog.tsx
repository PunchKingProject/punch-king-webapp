import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import CustomAuthButton from '../buttons/CustomAuthButton';

export type PKDialogProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disableCloseWhenBusy?: boolean;
};

export default function PKDialog({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  disableCloseWhenBusy = false,
}: PKDialogProps) {


  return (
    <Dialog
      open={open}
      onClose={disableCloseWhenBusy ? undefined : onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{ sx: { borderRadius: 3, background: '#F9F9F9' } }}
    >
      {title !== undefined && (
        <DialogTitle >
          {title}
          <Box
            sx={{
              display: 'flex',

              justifyContent: 'flex-end',
      
            }}
          >
            <CustomAuthButton
              aria-label='close'
              fullWidth={false}
              variant='contained'
              onClick={onClose}
              sx={{
                // py: '0',
                // px: 3
              }}
              disabled={disableCloseWhenBusy}
            >Close</CustomAuthButton>
          </Box>
        </DialogTitle>
      )}
      <DialogContent>
        <Box
       
        >
          {children}
        </Box>
      </DialogContent>
      {actions !== undefined && (
        <DialogActions sx={{ p: 3, pt: 1 }}>{actions}</DialogActions>
      )}
    </Dialog>
  );
}
