import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const gold = '#f0c040';

export default function AccountProfilePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    address: '',
    bio: '',
  });

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

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
        Profile
      </Typography>

      <Card
        sx={{
          bgcolor: '#111',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
            >
              <Avatar sx={{ width: 96, height: 96 }} />

              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 800, mb: 1 }}>
                  Profile picture
                </Typography>

                <Button
                  variant='outlined'
                  component='label'
                  sx={{
                    color: gold,
                    borderColor: gold,
                    textTransform: 'none',
                  }}
                >
                  Change picture
                  <input hidden type='file' accept='image/*' />
                </Button>
              </Box>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)',
                },
                gap: 2,
              }}
            >
              <TextField
                label='Full name'
                value={form.name}
                onChange={(event) =>
                  updateField('name', event.target.value)
                }
              />

              <TextField
                label='Email'
                type='email'
                value={form.email}
                onChange={(event) =>
                  updateField('email', event.target.value)
                }
              />

              <TextField
                label='Phone'
                value={form.phone}
                onChange={(event) =>
                  updateField('phone', event.target.value)
                }
              />

              <TextField
                label='Country'
                value={form.country}
                onChange={(event) =>
                  updateField('country', event.target.value)
                }
              />

              <TextField
                label='Address'
                value={form.address}
                onChange={(event) =>
                  updateField('address', event.target.value)
                }
              />

              <TextField
                multiline
                minRows={3}
                label='Biography'
                value={form.bio}
                onChange={(event) =>
                  updateField('bio', event.target.value)
                }
              />
            </Box>

            <Box>
              <Button
                variant='contained'
                sx={{
                  bgcolor: gold,
                  color: '#000',
                  fontWeight: 900,
                  px: 4,
                  '&:hover': { bgcolor: '#ffd465' },
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}