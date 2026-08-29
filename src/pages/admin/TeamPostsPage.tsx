// src/pages/admin/TeamPostsPage.tsx

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
  InputAdornment,
  TablePagination,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Form, Formik } from 'formik';

import { showError } from '../../../utils/error/toastError.ts';
import { customFetch } from '../../../Axios.ts';
import SideBar from './components/SideBar.tsx';

const gold = '#EFAF00';

interface TeamPost {
  id: string | number;
  title: string;
  content: string;
  category?: string;
  media_url?: string;
  caption?: string;
  file?: string;
  file_url?: string;
  status?: string;
}

export default function TeamPostsPage() {
  const [posts, setPosts] = useState<TeamPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'view'>('view');
  const [selectedPost, setSelectedPost] = useState<TeamPost | null>(null);

  // Search and Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Snackbar Notification State
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchTeamPosts = async () => {
    try {
      setLoading(true);
      // Isolated route to fetch team text/image posts without video interference
      const res = await customFetch.get('/admin/team-posts-manage/');
      const responseData = res.data?.data || res.data;

      const mapBackendToFrontend = (data: any[]) => data.map((p: any) => ({
        ...p,
        id: p.id || p.ID,
        title: p.title || p.Title || '',
        category: p.category || p.Category || 'General',
        content: p.content || p.caption || p.Caption || '',
        media_url: p.file_url || p.media_url || p.file || p.File || '',
        status: (p.status || p.Status || 'pending').toLowerCase()
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
    fetchTeamPosts();
  }, []);

  const handleOpenModal = (mode: 'edit' | 'view', post: TeamPost) => {
    setModalMode(mode);
    setSelectedPost(post);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPost(null);
  };

  const handleApprove = async (id: string | number) => {
    try {
      await customFetch.patch(`/admin/team-posts-manage/${id}/approve`);
      showNotification('Team post approved and made visible on the landing page!');
      fetchTeamPosts();
    } catch (err) {
      showError(err);
    }
  };

  const handleHide = async (id: string | number) => {
    try {
      // Soft-delete / hide action that won't touch any video files
      await customFetch.delete(`/admin/team-posts-manage/${id}`);
      showNotification('Team post hidden successfully!');
      fetchTeamPosts();
    } catch (err) {
      showError(err);
    }
  };

  // --- Filtering & Sorting Logic ---
  const filteredAndSortedPosts = posts
    .filter((p) => {
      const title = p.title ? String(p.title).toLowerCase() : '';
      const category = p.category ? String(p.category).toLowerCase() : '';
      const query = searchQuery ? searchQuery.toLowerCase() : '';

      return title.includes(query) || category.includes(query);
    })
    .sort((a, b) => Number(b.id || 0) - Number(a.id || 0));

  const paginatedPosts = filteredAndSortedPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#000' }}>
      <SideBar />

      <Box sx={{ flex: 1, p: { xs: 2, md: 5 }, width: '100%', height: '100vh', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography sx={{ color: '#fff', fontSize: 32, fontWeight: 900 }}>
            Manage Team Posts
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search team posts by title or category..."
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
          <Table aria-label="team posts table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: gold, fontWeight: 800, borderColor: '#333' }}>ID</TableCell>
                <TableCell sx={{ color: gold, fontWeight: 800, borderColor: '#333' }}>Category</TableCell>
                <TableCell sx={{ color: gold, fontWeight: 800, borderColor: '#333' }}>Title</TableCell>
                <TableCell sx={{ color: gold, fontWeight: 800, borderColor: '#333' }}>Status</TableCell>
                <TableCell sx={{ color: gold, fontWeight: 800, borderColor: '#333' }}>Content Snippet</TableCell>
                <TableCell align="right" sx={{ color: gold, fontWeight: 800, borderColor: '#333' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5, borderColor: '#333' }}>
                    <CircularProgress sx={{ color: gold }} />
                  </TableCell>
                </TableRow>
              ) : paginatedPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: '#888', py: 5, borderColor: '#333' }}>
                    {searchQuery ? 'No team posts match your search.' : 'No team posts found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPosts.map((post) => (
                  <TableRow key={post.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ color: '#eee', borderColor: '#333' }}>{post.id}</TableCell>
                    <TableCell sx={{ color: gold, borderColor: '#333', fontWeight: 600 }}>{post.category || 'General'}</TableCell>
                    <TableCell sx={{ color: '#eee', borderColor: '#333', fontWeight: 600 }}>{post.title}</TableCell>
                    <TableCell sx={{ borderColor: '#333' }}>
                      <Chip 
                        label={post.status} 
                        size="small"
                        sx={{
                          bgcolor: post.status === 'approved' ? 'rgba(76, 175, 80, 0.2)' : post.status === 'hidden' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                          color: post.status === 'approved' ? '#4caf50' : post.status === 'hidden' ? '#f44336' : '#ffc107',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          fontSize: '11px'
                        }} 
                      />
                    </TableCell>
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
                      {post.status !== 'approved' && (
                        <IconButton onClick={() => handleApprove(post.id)} sx={{ color: '#4caf50' }} title="Approve">
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                      {post.status !== 'hidden' && (
                        <IconButton onClick={() => handleHide(post.id)} sx={{ color: '#f44336' }} title="Hide / Unpublish">
                          <VisibilityOffIcon />
                        </IconButton>
                      )}
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
            onPageChange={(_, newPage) => setPage(newPage)}
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

      {/* View / Edit Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box 
          sx={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
            width: '100%', maxWidth: 700, bgcolor: '#1A1A1A', p: 4, borderRadius: 2, 
            border: '1px solid #333', boxShadow: 24, outline: 'none',
            maxHeight: '90vh', overflowY: 'auto'
          }}
        >
          <Typography variant="h6" sx={{ color: gold, fontWeight: 800, mb: 3, textTransform: 'uppercase' }}>
            {modalMode === 'edit' ? 'Edit Team Post' : 'View Team Post'}
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
                {selectedPost.category || 'General'}
              </Typography>
              <Typography sx={{ color: '#fff', fontSize: 22, fontWeight: 700, mt: -2 }}>{selectedPost.title}</Typography>
              <Typography sx={{ color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{selectedPost.content}</Typography>
              <Button variant="outlined" onClick={handleCloseModal} sx={{ mt: 2, color: '#eee', borderColor: '#555' }}>Close</Button>
            </Box>
          ) : (
            <Formik
              enableReinitialize
              initialValues={{ 
                category: selectedPost?.category || 'General', 
                title: selectedPost?.title || '', 
                content: selectedPost?.content || '',
                file: null as File | null, 
              }}
              onSubmit={async (vals, { setSubmitting }) => {
                try {
                  const formData = new FormData();
                  formData.append('category', vals.category);
                  formData.append('title', vals.title);
                  formData.append('caption', vals.content);
                  
                  if (vals.file) {
                    formData.append('file', vals.file); 
                  }

                  if (selectedPost) {
                    await customFetch.patch(`/admin/team-posts-manage/${selectedPost.id}`, formData, {
                      headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    showNotification('Team post updated successfully!');
                  }
                  
                  fetchTeamPosts();
                  handleCloseModal();
                } catch (err: any) {
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
                      fullWidth
                      name="category"
                      label="Category"
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      sx={{ '& .MuiInputBase-root': { bgcolor: '#101010', color: '#eee' } }}
                    />

                    <TextField
                      fullWidth
                      name="title"
                      label="Post Title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.title && errors.title)}
                      helperText={touched.title && (errors.title as string)}
                      sx={{ '& .MuiInputBase-root': { bgcolor: '#101010', color: '#eee' } }}
                    />

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
                      {values.file && (
                        <Typography sx={{ color: '#aaa', mt: 1, fontSize: 13 }}>
                          Selected: {values.file.name}
                        </Typography>
                      )}
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
                        disabled={isSubmitting}
                        sx={{
                          flex: 1, bgcolor: gold, color: '#000', fontWeight: 800, height: 50, borderRadius: '10px',
                          '&:hover': { bgcolor: '#d49b00' }, '&.Mui-disabled': { bgcolor: '#555', color: '#888' }
                        }}
                      >
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                      </Button>
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      </Modal>

      {/* Top-Right Snackbar Toast Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 8 }}
      >
        <Alert 
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%', bgcolor: snackbar.severity === 'success' ? gold : undefined, color: snackbar.severity === 'success' ? '#000' : undefined, fontWeight: 700 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}