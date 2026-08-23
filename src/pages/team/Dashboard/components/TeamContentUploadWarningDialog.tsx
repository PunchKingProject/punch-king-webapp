// src/pages/team/Dashboard/components/TeamContentUploadWarningDialog.tsx

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

export default function TeamContentUploadWarningDialog() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkTeamContentStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Use absolute URL or your API base url for local/production environment
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
        const response = await fetch(`${apiBaseUrl}/user/team-personal-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // If the team does not have content, prompt them
          if (data && data.data && data.data.has_content === false) {
            setOpen(true);
          }
        }
      } catch (err) {
        console.error('Failed to verify team content compliance:', err);
      }
    };

    checkTeamContentStatus();
  }, []);

  const handleProceedToUpload = () => {
    setOpen(false);
    // Direct redirect to the required upload link
    window.location.href = 'https://punchkingboxing.com/team/catalogue/upload';
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        // Prevent closing by clicking backdrop since content upload is mandatory
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        setOpen(false);
      }}
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
            Fighter & Content Upload Required
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
            You have not uploaded your boxers or fighters information yet.
          </Typography>
          <Typography
            sx={{
              color: '#9a9a9a',
              fontSize: { xs: 12, sm: 13 },
              lineHeight: 1.6,
            }}
          >
            Please note that you must upload at least one fighter/video content to activate your team account and unlock full access to your dashboard features.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: '#f0c040',
            color: '#111',
            fontWeight: 500,
            width: '100%',
            '&:hover': { bgcolor: '#d4a800' },
          }}
          onClick={handleProceedToUpload}
        >
          Proceed to Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}