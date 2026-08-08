// src/pages/landing/components/QualificationPoll.tsx
import { Box, Typography, Card, CardContent, Grid, Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VideocamIcon from '@mui/icons-material/Videocam';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Temporary mock data showcasing top teams meeting the criteria (complete profile & video uploaded)
const mockTopTeams = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  team_name: `Team ${String.fromCharCode(65 + i)} Boxing Club`,
  sponsors: Math.floor(Math.random() * 60) + 15,
  weight_class: i % 2 === 0 ? 'Professional Welterweight' : 'Professional Lightweight',
  has_video: true,
  profile_complete: true,
})).sort((a, b) => b.sponsors - a.sponsors);

export default function QualificationPoll() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, md: '6.98em' }, bgcolor: '#000' }}>
      
      {/* Section Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          sx={{ color: '#EFAF00', fontWeight: 700, fontSize: 14, letterSpacing: 1.5, mb: 1, textTransform: 'uppercase' }}
        >
          Sponsorship / Show Qualification Poll
        </Typography>
        <Typography 
          variant="h3" 
          sx={{ color: '#FFF', fontWeight: 900, mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}
        >
          Top Leading Teams
        </Typography>
        <Typography sx={{ color: '#A2A2A2', maxWidth: 650, mx: 'auto', fontSize: 15 }}>
          Showcasing the leading teams securing the most sponsorships. Only teams with verified complete profiles and uploaded training/sparring videos qualify for the leaderboard.
        </Typography>
      </Box>

      {/* Grid Layout: Exactly 3 cards per line on medium/large screens */}
      <Grid container spacing={3} justifyContent="center">
        {mockTopTeams.map((team, index) => (
          <Grid item xs={12} sm={6} md={4} key={team.id}>
            <Card 
              sx={{ 
                background: '#1A1A1A', 
                border: '1px solid #3B3B3B', 
                boxShadow: '2px 2px 10px 2px #2B2B2BB0',
                borderRadius: '12px',
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, border-color 0.2s',
                '&:hover': { transform: 'translateY(-4px)', borderColor: '#EFAF00' }
              }}
            >
              <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                
                {/* Top Row: Rank & Status Badges */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      bgcolor: index < 3 ? 'rgba(239, 175, 0, 0.15)' : '#252525',
                      color: index < 3 ? '#EFAF00' : '#A2A2A2',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '20px',
                      fontWeight: 800,
                      fontSize: 13,
                      border: index < 3 ? '1px solid #EFAF00' : '1px solid #3B3B3B'
                    }}
                  >
                    <EmojiEventsIcon sx={{ fontSize: 16 }} />
                    Rank #{index + 1}
                  </Box>

                  {/* Verification Criteria Icons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <span title="Complete Profile Info">
                      <CheckCircleIcon sx={{ color: '#EFAF00', fontSize: 18 }} />
                    </span>
                    <span title="Video Uploaded">
                      <VideocamIcon sx={{ color: '#EFAF00', fontSize: 18 }} />
                    </span>
                  </Box>
                </Box>

                {/* Team Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                  <Avatar 
                    sx={{ width: 50, height: 50, bgcolor: '#2a2a2a', border: '2px solid #EFAF00', fontWeight: 800, color: '#EFAF00' }}
                  >
                    {team.team_name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography sx={{ color: '#FFF', fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>
                      {team.team_name}
                    </Typography>
                    <Typography sx={{ color: '#A2A2A2', fontSize: 12, mt: 0.5 }}>
                      {team.weight_class}
                    </Typography>
                  </Box>
                </Box>

                {/* Sponsorship Units / Score Box */}
                <Box 
                  sx={{ 
                    bgcolor: '#111', 
                    p: 1.5, 
                    borderRadius: '8px', 
                    border: '1px solid #2B2B2B',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography sx={{ color: '#A2A2A2', fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
                    Total Sponsorships
                  </Typography>
                  <Typography sx={{ color: '#EFAF00', fontSize: 18, fontWeight: 900 }}>
                    {team.sponsors} Chips
                  </Typography>
                </Box>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}