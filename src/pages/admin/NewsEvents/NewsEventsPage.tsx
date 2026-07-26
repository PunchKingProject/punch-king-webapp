import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Form, Formik } from 'formik';

import { showError } from '../../../utils/error/toastError.ts';
import { customFetch } from '../../../Axios.ts';
import SideBar from '../components/SideBar.tsx'; 

const gold = '#EFAF00';

interface Post {
  id: string | number;
  title: string;
  content: string;
  category?: string; 
  media_url?: string; // NEW: Added support for the feature image from your DB
}

export default function NewsEventsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await customFetch.get('/admin/news/');
      setPosts(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      setPosts([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenModal = (mode: 'create' | 'edit' | 'view', post?: Post) => {
    setModalMode(mode);
    setSelectedPost(post || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPost(null);
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await customFetch.delete(`/admin/news/${id}`);
      alert('Post deleted successfully!');
      fetchPosts();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#000' }}>
      
      <SideBar />

      <Box sx={{ flex: 1, p: { xs: 2, md: 5 }, width: '100%', overflowX: 'hidden' }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography sx={{ color: '#fff', fontSize: 32, fontWeight: 900 }}>
            News & Events
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleOpenModal('create')}
            sx={{
              bgcolor: gold,
              color: '#000',
              fontWeight: 800,
              borderRadius: '10px',
              px: 3,
              '&:hover': { bgcolor: '#d49b00' },
            }}
          >
            + Create New Post
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ bgcolor: '#1A1A1A', border: '1px solid #333', borderRadius: 2 }}>
          <Table aria-label="posts table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: gold, fontWeight: 800, borderColor: '#333' }}>ID</TableCell>
                <TableCell sx={{ color: gold, fontWeight: 800, borderColor: '#333' }}>Category</TableCell>
                <TableCell sx={{ color: gold, fontWeight: 800, borderColor: '#333' }}>Title</TableCell>
                <TableCell sx={{ color: gold, fontWeight: 800, borderColor: '#333' }}>Content Snippet</TableCell>
                <TableCell align="right" sx={{ color: gold, fontWeight: 800, borderColor: '#333' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5, borderColor: '#333' }}>
                    <CircularProgress sx={{ color: gold }} />
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: '#888', py: 5, borderColor: '#333' }}>
                    No posts found. Click "Create New Post" to publish an update.
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ color: '#eee', borderColor: '#333' }}>{post.id}</TableCell>
                    <TableCell sx={{ color: gold, borderColor: '#333', fontWeight: 600 }}>{post.category || 'Uncategorized'}</TableCell>
                    <TableCell sx={{ color: '#eee', borderColor: '#333', fontWeight: 600 }}>{post.title}</TableCell>
                    <TableCell sx={{ color: '#aaa', borderColor: '#333' }}>
                      {post.content?.length > 60 ? `${post.content.substring(0, 60)}...` : post.content}
                    </TableCell>
                    <TableCell align="right" sx={{ borderColor: '#333' }}>
                      <IconButton onClick={() => handleOpenModal('view', post)} sx={{ color: '#4caf50' }} title="View">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenModal('edit', post)} sx={{ color: '#2196f3' }} title="Edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(post.id)} sx={{ color: '#f44336' }} title="Delete">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </Box>

      {/* POST MODAL */}
      <Modal open={modalOpen} onClose={handleCloseModal} aria-labelledby="post-modal-title">
        <Box 
          sx={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
            width: '100%', maxWidth: 700, bgcolor: '#1A1A1A', p: 4, borderRadius: 2, 
            border: '1px solid #333', boxShadow: 24, outline: 'none',
            maxHeight: '90vh', overflowY: 'auto' // Added scrolling in case form gets too long
          }}
        >
          <Typography id="post-modal-title" variant="h6" sx={{ color: gold, fontWeight: 800, mb: 3, textTransform: 'uppercase' }}>
            {modalMode === 'create' ? 'Create New Post' : modalMode === 'edit' ? 'Edit Post' : 'View Post'}
          </Typography>

          {modalMode === 'view' && selectedPost ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* NEW: Render the image if it exists */}
              {selectedPost.media_url && (
                <Box 
                  component="img" 
                  src={selectedPost.media_url} 
                  alt="Post Feature" 
                  sx={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 2 }} 
                />
              )}
              <Typography sx={{ color: gold, fontSize: 14, fontWeight: 800, textTransform: 'uppercase' }}>
                {selectedPost.category || 'Uncategorized'}
              </Typography>
              <Typography sx={{ color: '#fff', fontSize: 22, fontWeight: 700, mt: -2 }}>{selectedPost.title}</Typography>
              <Typography sx={{ color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{selectedPost.content}</Typography>
              <Button variant="outlined" onClick={handleCloseModal} sx={{ mt: 2, color: '#eee', borderColor: '#555' }}>Close</Button>
            </Box>
          ) : (
            <Formik
              enableReinitialize
              initialValues={{ 
                category: selectedPost?.category || 'Tournament', 
                title: selectedPost?.title || '', 
                content: selectedPost?.content || '',
                media_url: selectedPost?.media_url || '' // NEW: Init media_url
              }}
              validate={(vals) => {
                const errs: any = {};
                if (!vals.category) errs.category = 'Category is required';
                if (!vals.title) errs.title = 'Title is required';
                if (!vals.content) errs.content = 'Content is required';
                return errs;
              }}
              onSubmit={async (vals, { setSubmitting }) => {
                try {
                  if (modalMode === 'create') {
                    await customFetch.post('/admin/news/', vals);
                    alert('Post published successfully!');
                  } else if (modalMode === 'edit' && selectedPost) {
                    await customFetch.patch(`/admin/news/`, { 
                      ...vals, 
                      id: selectedPost.id 
                    });
                    alert('Post updated successfully!');
                  }
                  fetchPosts();
                  handleCloseModal();
                } catch (err) {
                  showError(err);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ values, handleChange, handleBlur, touched, errors, isSubmitting, handleSubmit }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    
                    <TextField
                      select
                      fullWidth
                      name="category"
                      label="Category"
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.category && errors.category)}
                      helperText={touched.category && (errors.category as string)}
                      sx={{ 
                        '& .MuiInputBase-root': { bgcolor: '#101010', color: '#eee' },
                        '& .MuiSvgIcon-root': { color: gold } 
                      }}
                    >
                      <MenuItem value="Tournament">Tournament</MenuItem>
                      <MenuItem value="Catalogue">Catalogue</MenuItem>
                      <MenuItem value="Sponsors">Sponsors</MenuItem>
                    </TextField>

                    <TextField
                      fullWidth
                      name="title"
                      label="Post Title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.title && errors.title)}
                      helperText={touched.title && errors.title as string}
                      sx={{ '& .MuiInputBase-root': { bgcolor: '#101010', color: '#eee' } }}
                    />

                    {/* NEW: Feature Image URL Field */}
                    <TextField
                      fullWidth
                      name="media_url"
                      label="Feature Image URL (Optional)"
                      value={values.media_url}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="https://example.com/image.jpg"
                      sx={{ '& .MuiInputBase-root': { bgcolor: '#101010', color: '#eee' } }}
                    />

                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      name="content"
                      label="Post Content"
                      value={values.content}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.content && errors.content)}
                      helperText={touched.content && errors.content as string}
                      sx={{ '& .MuiInputBase-root': { bgcolor: '#101010', color: '#eee' } }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Button
                        onClick={handleCloseModal}
                        variant="outlined"
                        sx={{ flex: 1, color: '#eee', borderColor: '#555', fontWeight: 800, height: 50, borderRadius: '10px' }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || !values.category || !values.title || !values.content}
                        sx={{
                          flex: 1, bgcolor: gold, color: '#000', fontWeight: 800, height: 50, borderRadius: '10px',
                          '&:hover': { bgcolor: '#d49b00' }, '&.Mui-disabled': { bgcolor: '#555', color: '#888' }
                        }}
                      >
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (modalMode === 'edit' ? 'Save Changes' : 'Publish')}
                      </Button>
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      </Modal>
    </Box>
  );
}