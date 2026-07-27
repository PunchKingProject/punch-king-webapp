import { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardMedia,
  Chip, 
  Container, 
  Typography,
  CircularProgress,
  Modal,
  Button
} from '@mui/material';
import { colors } from '../../../theme/colors';
import { customFetch } from '../../../Axios.ts';

const EventActivities = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  useEffect(() => {
    const fetchAdminNews = async () => {
      try {
        const res = await customFetch.get('/post/all-posts?limit=10');
        const allPosts = res.data?.data?.posts || res.data?.posts || [];

        // Filter out team sparring videos (they always have a boxer_name)
        // Map the backend 'caption' & 'file' to frontend 'content' & 'media_url'
        const adminOnlyPosts = allPosts
          .filter((p: any) => !p.boxer_name && !p.weight_class)
          .map((p: any) => ({
            id: p.id || p.ID,
            title: p.title || p.Title,
            content: p.caption || p.Caption || '',
            media_url: p.file || p.File || '',
            category: p.category || (p.status === 'approved' ? 'Official News' : 'Update')
          }));

        setNews(adminOnlyPosts);
      } catch (err) {
        console.error('Failed to fetch news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminNews();
  }, []);

  return (
    <Box sx={{ bgcolor: '#000', py: { xs: 7, md: 10 } }}>
      <Container maxWidth="xl">
        <Box textAlign="center" mb={5}>
          <Typography sx={{ color: colors.Accent, fontWeight: 900, letterSpacing: '.18em' }}>
            EVENT ACTIVITIES
          </Typography>
          <Typography sx={{ color: '#fff', fontSize: { xs: '2rem', md: '3.2rem' }, fontWeight: 950 }}>
            News, Updates & Bulletin
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,.65)', maxWidth: 720, mx: 'auto', mt: 2 }}>
            Latest tournament updates, announcements, sponsorship information and platform activities.
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress sx={{ color: colors.Accent }} />
          </Box>
        ) : news.length === 0 ? (
          <Typography sx={{ color: 'rgba(255,255,255,.65)', textAlign: 'center', py: 10, fontSize: '1.1rem' }}>
            No official updates available at the moment. Check back soon.
          </Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 3 }}>
            {/* Slice to 3 so it perfectly fits your original 3-column grid design */}
            {news.slice(0, 3).map((event) => (
              <Card
                key={event.id}
                onClick={() => setSelectedPost(event)}
                sx={{
                  bgcolor: '#111',
                  border: '1px solid rgba(255,255,255,.08)',
                  borderRadius: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: colors.Accent,
                  }
                }}
              >
                {event.media_url && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={event.media_url}
                    alt={event.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Chip
                    label={event.category}
                    size="small"
                    sx={{ bgcolor: 'rgba(239,175,0,.13)', color: colors.Accent, fontWeight: 800, mb: 2 }}
                  />
                  <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.25rem', mb: 1, lineHeight: 1.3 }}>
                    {event.title}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: 'rgba(255,255,255,.65)', 
                      lineHeight: 1.7,
                      display: '-webkit-box', 
                      WebkitLineClamp: 3, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden' 
                    }}
                  >
                    {event.content}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* Reading Modal for Full Post */}
      <Modal open={!!selectedPost} onClose={() => setSelectedPost(null)}>
        <Box 
          sx={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
            width: '90%', maxWidth: 700, bgcolor: '#111', borderRadius: 4, 
            border: `1px solid ${colors.Accent}`, boxShadow: 24, outline: 'none',
            maxHeight: '90vh', overflowY: 'auto'
          }}
        >
          {selectedPost?.media_url && (
            <Box 
              component="img" 
              src={selectedPost.media_url} 
              alt={selectedPost.title} 
              sx={{ width: '100%', maxHeight: 350, objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }} 
            />
          )}
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            <Chip 
              label={selectedPost?.category} 
              size="small"
              sx={{ bgcolor: 'rgba(239,175,0,.13)', color: colors.Accent, fontWeight: 800, mb: 2 }} 
            />
            <Typography sx={{ color: '#fff', fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 900, mb: 3 }}>
              {selectedPost?.title}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,.8)', fontSize: '1rem', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
              {selectedPost?.content}
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => setSelectedPost(null)} 
              sx={{ mt: 5, color: '#fff', borderColor: 'rgba(255,255,255,.2)', borderRadius: 2, px: 4, py: 1, fontWeight: 700, '&:hover': { borderColor: colors.Accent } }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default EventActivities;