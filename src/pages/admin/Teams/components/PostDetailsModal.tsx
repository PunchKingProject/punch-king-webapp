import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { toast } from 'react-toastify';

type Props = {
  post: any;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

// Helper to determine if the media is a video
function isVideo(url: string): boolean {
  if (!url) return false;
  return /\.(mp4|mov|webm|ogg|avi)(\?.*)?$/i.test(url);
}

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    backgroundColor: '#111',
    borderRadius: '8px',
    '& fieldset': { borderColor: '#3B3B3B' },
    '&:hover fieldset': { borderColor: '#EFAF00' },
    '&.Mui-focused fieldset': { borderColor: '#EFAF00' },
  },
  '& .MuiInputLabel-root': { color: '#A2A2A2' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#EFAF00' },
};

export default function PostDetailsModal({ post, open, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  
  // Initialize form state with the selected post's data
  const [formData, setFormData] = useState({
    caption: '',
    boxer_name: '',
    weight_class: '',
    boxer_weight_kg: '',
    sparring_location: '',
    shorts_color: '',
    glove_color: '',
  });

  // Update form state whenever the selected post changes
  useEffect(() => {
    if (post) {
      setFormData({
        caption: post.caption || '',
        boxer_name: post.boxer_name || '',
        weight_class: post.weight_class || '',
        boxer_weight_kg: post.boxer_weight_kg?.toString() || '',
        sparring_location: post.sparring_location || '',
        shorts_color: post.shorts_color || '',
        glove_color: post.glove_color || '',
      });
    }
  }, [post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); 
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/post/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          post_id: post.id,
          ...formData,
          boxer_weight_kg: parseFloat(formData.boxer_weight_kg) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      toast.success('Post updated successfully!');
      onSuccess(); 
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating.');
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#1A1A1A',
          border: '1px solid #EFAF00',
          borderRadius: '12px',
          color: '#fff'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #3B3B3B' }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          Edit Media Details
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ width: '100%', height: 350, bgcolor: '#000', borderRadius: 2, overflow: 'hidden', mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {post.file_url ? (
            isVideo(post.file_url) ? (
              <video src={post.file_url} controls style={{ maxWidth: '100%', maxHeight: '100%' }} />
            ) : (
              <img src={post.file_url} alt="Post media" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            )
          ) : (
            <Typography sx={{ color: '#A2A2A2' }}>No media available</Typography>
          )}
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          Fighter information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
             <TextField
              fullWidth
              label="Caption"
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Boxer name"
              name="boxer_name"
              value={formData.boxer_name}
              onChange={handleChange}
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Weight class"
              name="weight_class"
              value={formData.weight_class}
              onChange={handleChange}
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Actual boxer weight (kg)"
              name="boxer_weight_kg"
              type="number"
              value={formData.boxer_weight_kg}
              onChange={handleChange}
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sparring location"
              name="sparring_location"
              value={formData.sparring_location}
              onChange={handleChange}
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Boxer shorts/clothing colour"
              name="shorts_color"
              value={formData.shorts_color}
              onChange={handleChange}
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Boxer glove colour"
              name="glove_color"
              value={formData.glove_color}
              onChange={handleChange}
              sx={inputStyles}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, border: '1px solid #3B3B3B', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoOutlinedIcon sx={{ color: '#00A3FF' }} />
          <Typography sx={{ fontSize: 13, color: '#C9C9C9' }}>
            The fighter details become part of the video's catalogue information.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #3B3B3B' }}>
        <Button onClick={onClose} sx={{ color: '#A2A2A2', fontWeight: 700, mr: 2 }}>
          CANCEL
        </Button>
        <Button 
          variant="contained" 
          onClick={handleUpdate}
          disabled={loading}
          sx={{ 
            bgcolor: '#EFAF00', 
            color: '#000', 
            fontWeight: 800,
            '&:hover': { bgcolor: '#d49b00' }
          }}
        >
          {loading ? 'UPDATING...' : 'UPDATE POST'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}