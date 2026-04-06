// components/modals/NoticeModal.tsx
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import SuccessIcon from '../../assets/modalSuccess.svg?react';


type Props = {
  open: boolean;
  onClose: () => void;
  onContinue?: () => void;
  onSecondary?: () => void;
  title?: string;
  message?: string;
  continueLabel?: string;
  secondaryLabel?: string;
  icon?: ReactNode;
  loading?: boolean;
  showCloseText?: boolean;
};

export default function NoticeModal({
  open,
  onClose,
  onContinue,
  onSecondary,
  title = 'NOTICE!!!',
  message = 'An email has been sent to you. Use it to complete your signup.',
  continueLabel = 'Continue',
  secondaryLabel,
  icon = <SuccessIcon />,
  loading = false,
    showCloseText = false,
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
          position: 'relative',
          px: 0,
        },
      }}
    >
      {/* Close text (top-right) */}
      {showCloseText && (
        <Typography
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 10,
            color: '#F6C10A',
            fontWeight: 700,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          Close
        </Typography>
      )}

      
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

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexDirection: 'row-reverse',
            }}
          >
            {secondaryLabel && (
              <Button
                onClick={onSecondary}
                disabled={loading}
                variant='text'
                sx={{
                  color: '#EFAF00',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '1px 1px 2px 0px #8D67004F',
                  px: 2,
                }}
              >
                {secondaryLabel}
              </Button>
            )}

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
              {loading ? 'Please wait…' : continueLabel}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
