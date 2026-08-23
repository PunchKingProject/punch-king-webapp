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
  InputAdornment,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
  media_url?: string;
  caption?: string; 
  file?: string;    
  file_url?: string; 
}

export default function NewsEventsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Search and Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await customFetch.get('/admin/news/');
      
      const responseData = res.data?.data || res.data;

      const mapBackendToFrontend = (data: any[]) => data.map((p: any) => ({
        ...p,
        category: p.category || p.Category || p.type || p.Type || p.tag || p.Tag || 'Tournament',
        content: p.content || p.caption || p.Caption || '',
        media_url: p.file_url || p.media_url || p.file || p.File || '' 
      }));
      
      if (Array.isArray(responseData)) {
        setPosts(mapBackendToFrontend(responseData));
      } else if (responseData && Array.isArray(responseData.posts)) {
        setPosts(mapBackendToFrontend(responseData.posts));
      } else {
        setPosts([]); 
      }
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

  // --- Filtering & Sorting Logic ---
  const filteredAndSortedPosts = posts
    .filter((p) => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => Number(b.id) - Number(a.id)); // Sorts newest (highest ID) to top

  const paginatedPosts = filteredAndSortedPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#000' }}>
      <SideBar />

      <Box sx={{ flex: 1, p: { xs: 2, md: 5 }, width: '100%', height: '100vh', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
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

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search posts by title or category..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#888' }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              maxWidth: 500,
              '& .MuiInputBase-root': { bgcolor: '#1A1A1A', color: '#eee', borderRadius: 2 },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: gold },
            }}
          />
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
              ) : paginatedPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: '#888', py: 5, borderColor: '#333' }}>
                    {searchQuery ? 'No posts match your search.' : 'No posts found. Click "Create New Post" to publish an update.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPosts.map((post) => (
                  <TableRow key={post.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ color: '#eee', borderColor: '#333' }}>{post.id}</TableCell>
                    <TableCell sx={{ color: gold, borderColor: '#333', fontWeight: 600 }}>{post.category || 'Tournament'}</TableCell>
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
          
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredAndSortedPosts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{
              color: '#eee',
              borderTop: '1px solid #333',
              '.MuiTablePagination-selectIcon': { color: gold },
            }}
          />
        </TableContainer>
      </Box>

      <Modal open={modalOpen} onClose={handleCloseModal} aria-labelledby="post-modal-title">
        <Box 
          sx={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
            width: '100%', maxWidth: 700, bgcolor: '#1A1A1A', p: 4, borderRadius: 2, 
            border: '1px solid #333', boxShadow: 24, outline: 'none',
            maxHeight: '90vh', overflowY: 'auto'
          }}
        >
          <Typography id="post-modal-title" variant="h6" sx={{ color: gold, fontWeight: 800, mb: 3, textTransform: 'uppercase' }}>
            {modalMode === 'create' ? 'Create New Post' : modalMode === 'edit' ? 'Edit Post' : 'View Post'}
          </Typography>

          {modalMode === 'view' && selectedPost ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {selectedPost.media_url && (
                <Box 
                  component="img" 
                  src={selectedPost.media_url} 
                  alt="Post Feature" 
                  sx={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 2 }} 
                />
              )}
              <Typography sx={{ color: gold, fontSize: 14, fontWeight: 800, textTransform: 'uppercase' }}>
                {selectedPost.category || 'Tournament'}
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
                file: null as File | null, 
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
    const formData = new FormData();
    formData.append('category', vals.category);
    formData.append('title', vals.title);
    formData.append('content', vals.content);
    formData.append('caption', vals.content); 
    
    // Attach the raw image file if selected
    if (vals.file) {
      formData.append('file', vals.file); 
    }

    if (modalMode === 'create') {
      await customFetch.post('/admin/news/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post published successfully!');
    } else if (modalMode === 'edit' && selectedPost) {
      const parsedId = typeof selectedPost.id === 'string' ? parseInt(selectedPost.id, 10) : selectedPost.id;
      formData.append('id', String(parsedId));
      
      await customFetch.patch(`/admin/news/${parsedId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post updated successfully!');
    }
    
    fetchPosts();
    handleCloseModal();
  } catch (err: any) {
    console.error('Update failed response:', err.response?.data || err);
    showError(err);
  } finally {
    setSubmitting(false);
  }
}}
            >
              {({ values, handleChange, handleBlur, touched, errors, isSubmitting, handleSubmit, setFieldValue }) => (
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

                    {/* Raw File Upload Button */}
                    <Box>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUploadIcon />}
                        sx={{ color: gold, borderColor: gold, py: 1.5, width: '100%' }}
                      >
                        Upload Feature Image
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => {
                            if (e.currentTarget.files && e.currentTarget.files[0]) {
                              setFieldValue('file', e.currentTarget.files[0]);
                            }
                          }}
                        />
                      </Button>
                      
                      {values.file ? (
                        <Typography sx={{ color: '#aaa', mt: 1, fontSize: 13 }}>
                          Selected: {values.file.name}
                        </Typography>
                      ) : selectedPost?.media_url ? (
                        <Typography sx={{ color: '#aaa', mt: 1, fontSize: 13 }}>
                          Current image attached. Upload a new one to replace it.
                        </Typography>
                      ) : null}
                    </Box>

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