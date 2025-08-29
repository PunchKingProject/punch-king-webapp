// components/modals/NoticeModal.tsx
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import SuccessIcon from '../../assets/modalSuccess.svg?react';


type Props = {
  open: boolean;
  onClose: () => void;
  onContinue?: () => void;
  title?: string;
  message?: string;
  continueLabel?: string;
  icon?: ReactNode;
};

export default function NoticeModal({
  open,
  onClose,
  onContinue,
  title = 'NOTICE!!!',
  message = 'An email has been sent to you. Use it to complete your signup.',
  continueLabel = 'Continue',
  icon = <SuccessIcon />,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 300,
          borderRadius: 2,
          background: '#fff',
          color: '#3B3B3B',
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent sx={{ p: 2.5 }}>
        <Box display='grid' justifyItems='center' gap={1.25}>
          {/* <CheckCircleRoundedIcon sx={{ color: '#63db6c', fontSize: 36 }} /> */}
          {icon && (
            <Box
              sx={{
                '& svg': { width: 36, height: 36 },
              }}
            >
              {icon}
            </Box>
          )}
          <Typography
            variant='subtitle1'
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant='body2'
            sx={{ textAlign: 'center', mb: 1, fontWeight: 500 }}
          >
            {message}
          </Typography>

          <Button
            onClick={onContinue}
            variant='contained'
            sx={{
              backgroundColor: '#F6C10A',
              color: '#C28E02',
              textTransform: 'none',
              fontWeight: 700,
              '&:hover': { backgroundColor: '#e0ae07' },
            }}
          >
            {continueLabel}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
