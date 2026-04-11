// src/components/SubscriptionWarningDialog.tsx

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { jwtDecode } from 'jwt-decode';
import {useNavigate} from "react-router-dom";
import ROUTES from "../../../../routes/routePath";

interface TokenPayload {
  free_post_days: number;
  // add your other JWT fields here
  subbed: boolean;
}

function getDaysRemainingFromToken(): number {
  try {
    const token = localStorage.getItem('token');
    if (!token) return 0;

    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.free_post_days ?? 0;
  } catch {
    return 0;
  }
}

function getSubStatusFromToken(): boolean {
  try {
    const token = localStorage.getItem('token');
    if (!token) return true;

    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.subbed;
  } catch {
    return true;
  }
}


export default function SubscriptionWarningDialog() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const days = getDaysRemainingFromToken();
    const subbed = getSubStatusFromToken()
    setDaysRemaining(days);
    // Only show if days > 0
    if (days >= 0 && !subbed) setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      slotProps={{
        paper: {
          sx: {
            bgcolor: '#222',
            border: '1px solid #3a3a3a',
            borderRadius: fullScreen ? 0 : 3,
          },
        },
      }}
    >
      <DialogContent sx={{ pt: 3 }}>
        {/* Title row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <WarningAmberRoundedIcon sx={{ color: '#f0c040', fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{ color: '#f0c040', fontWeight: 500, fontSize: { xs: 16, sm: 18 } }}
          >
            Free Posts Warning
          </Typography>
        </Box>

        {/* Warning box */}
        <Box
          sx={{
            bgcolor: '#1a1a1a',
            border: '1px solid #3a3a3a',
            borderRadius: 2,
            p: 2,
          }}
        >
          <Typography
            sx={{
              color: '#e53935',
              fontWeight: 500,
              fontSize: { xs: 14, sm: 15 },
              mb: 0.75,
            }}
          >
            As a new team, you get free catalogue posting access.
            Your free catalogue posting access expires in {' '}
            <strong>{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}</strong>
          </Typography>
          <Typography
            sx={{
              color: '#9a9a9a',
              fontSize: { xs: 12, sm: 13 },
              lineHeight: 1.6,
            }}
          >
            After this period your team will no longer be able to post new
            catalogues. Subscribe to avoid interruption.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={() => setOpen(false)}
          sx={{
            color: '#9a9a9a',
            borderColor: '#3a3a3a',
            '&:hover': { borderColor: '#555', bgcolor: 'transparent' },
          }}
          variant="outlined"
          size="small"
        >
          Dismiss
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: '#f0c040',
            color: '#111',
            fontWeight: 500,
            '&:hover': { bgcolor: '#d4a800' },
          }}
          onClick={() => {
            setOpen(false);
            // navigate to subscription page
            navigate(ROUTES.TEAM_SUBSCRIPTION_PAYMENT)
          }}
        >
          Get subscription
        </Button>
      </DialogActions>
    </Dialog>
  );
}