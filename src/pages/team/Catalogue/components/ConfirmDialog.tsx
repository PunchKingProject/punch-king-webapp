// components/ConfirmDialog.tsx
import {
  Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Button, CircularProgress
} from '@mui/material';

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
                                        open, title, description,
                                        confirmLabel, cancelLabel,
                                        loading, onConfirm, onCancel,
                                      }: Props) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth='xs' fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onCancel}
          disabled={loading}
          variant='outlined'
          sx={{ textTransform: 'none', fontWeight: 600, flex: 1 }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant='contained'
          color='error'
          sx={{ textTransform: 'none', fontWeight: 600, flex: 1 }}
          startIcon={loading ? <CircularProgress size={16} color='inherit' /> : null}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}