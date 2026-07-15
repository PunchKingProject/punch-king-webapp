import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const gold = '#f0c040';

export default function AccountSecurityPage() {
  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography
        component='h1'
        sx={{
          color: '#fff',
          fontSize: { xs: '1.8rem', md: '2.4rem' },
          fontWeight: 900,
          mb: 3,
        }}
      >
        Account Security
      </Typography>

      <Stack spacing={3}>
        <Card
          sx={{
            bgcolor: '#111',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Typography sx={{ color: '#fff', fontWeight: 900, mb: 2 }}>
              Change password
            </Typography>

            <Stack spacing={2}>
              <TextField label='Current password' type='password' />
              <TextField label='New password' type='password' />
              <TextField label='Confirm new password' type='password' />

              <Box>
                <Button
                  variant='contained'
                  sx={{
                    bgcolor: gold,
                    color: '#000',
                    fontWeight: 900,
                  }}
                >
                  Update Password
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card
          sx={{
            bgcolor: '#111',
            border: '1px solid rgba(255,80,80,0.25)',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Typography sx={{ color: '#fff', fontWeight: 900 }}>
              Delete account
            </Typography>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

            <Alert severity='warning' sx={{ mb: 2 }}>
              Account deletion should be permanent only after confirmation.
            </Alert>

            <Button variant='outlined' color='error'>
              Delete My Account
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}