// src/pages/user/FeedView/desktop/DesktopFeedViewPage.tsx
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  TextField,
  IconButton,
  Divider,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useCreateComment, usePost } from './hooks/usePost';
import CommentThread from './components/DesktopCommentThread';
import type { CommentRow } from './api/dashboard.types';

const cardSx = {
  background: '#1A1A1A',
  border: '1px solid #3B3B3B',
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  borderRadius: '12px',
};

export default function DesktopFeedViewPage() {
  const { postId } = useParams();
  const id = useMemo(() => Number(postId), [postId]);
  const navigate = useNavigate();

  const { data, isLoading } = usePost(id);
  const { mutateAsync: addComment, isPending } = useCreateComment(id);

  const [newComment, setNewComment] = useState('');
//   const [replyFor, setReplyFor] = useState<number | null>(null);
//   const [replyText, setReplyText] = useState('');

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await addComment({ post_id: id, content: newComment.trim() });
    setNewComment('');
  };

//   const handleReply = async (parentId: number) => {
//     if (!replyText.trim()) return;
//     await addComment({
//       post_id: id,
//       parent_comment_id: parentId,
//       content: replyText.trim(),
//     });
//     setReplyText('');
//     setReplyFor(null);
//   };

  return (
    <Box sx={{ p: '1.56em 6.98em' }}>
      {/* Back */}
      <Button
        variant='outlined'
        onClick={() => {
          navigate(-1);

          console.log('back');
        }}
        size='small'
        sx={{
          borderColor: '#EFAF00',
          color: '#EFAF00',
          textTransform: 'none',
          mb: 2,
          position: 'relative',
          zIndex: 10, // <- make sure it's above content
          pointerEvents: 'auto', // <- just in case a parent disabled events
        }}
        startIcon={<ArrowBackIosNewIcon fontSize='small' />}
      >
        Back
      </Button>

      <Typography variant='h5' sx={{ color: '#fff', fontWeight: 900, mb: 2 }}>
        FEED VIEW
      </Typography>

      {isLoading || !data ? (
        <Typography sx={{ color: '#9a9a9a' }}>Loading…</Typography>
      ) : (
        <>
          {/* Header meta */}
          <Typography sx={{ color: '#EFAF00', fontWeight: 700 }}>
            TEAM NAME:&nbsp;
            <span style={{ color: '#fff' }}>{data.team_name || '—'}</span>
          </Typography>
          <Typography sx={{ color: '#EFAF00', fontWeight: 700, mb: 2 }}>
            POSITION:&nbsp;<span style={{ color: '#fff' }}>—</span>
          </Typography>

          {/* Sponsor + share row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Button
              variant='contained'
              sx={{
                bgcolor: '#EFAF00',
                color: '#000',
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: '10px',
              }}
              onClick={() =>
                navigate(`/user/feeds/${postId}/sponsorship`, {
                  state: {
                    postId: id,
                    teamName: data.team_name,
                    teamPosition: ' - ', // if/when you have it
                    mediaUrl: data.file_url,
                    sponsors: data.sponsors,
                    contributors: data.sponsorships,
                  },
                })
              }
            >
              Sponsor
            </Button>
            <IconButton sx={{ color: '#EFAF00' }}>
              <ShareOutlinedIcon />
            </IconButton>
          </Box>

          {/* Media */}
          <Card sx={{ ...cardSx, p: 2, mb: 2 }}>
            {data.file_url ? (
              <CardMedia
                component='img'
                image={data.file_url}
                alt={data.title}
                sx={{ maxHeight: 420, objectFit: 'contain', borderRadius: 2 }}
              />
            ) : (
              <Box sx={{ height: 320, bgcolor: '#2a2a2a', borderRadius: 2 }} />
            )}
          </Card>

          {/* Caption */}
          <Box sx={{ color: '#C9C9C9', mb: 2 }}>
            <Typography sx={{ color: '#A2A2A2', fontSize: 12, mb: 1 }}>
              {dayjs(data.created_at).format('M/D/YYYY h:mma')}
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', color: '#FFF' }}>
              {data.caption}
            </Typography>
          </Box>

          {/* Comments */}
          <Typography
            variant='h6'
            sx={{ color: '#fff', fontWeight: 900, mb: 1 }}
          >
            Comments
          </Typography>

          <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
            {(data.comments?.length ?? 0) === 0 ? (
              <Typography sx={{ color: '#9a9a9a' }}>
                No comments yet.
              </Typography>
            ) : (
              <CommentThread
                comments={data.comments as CommentRow[]}
                onReply={async (parentId, text) => {
                  await addComment({
                    post_id: id,
                    parent_comment_id: parentId,
                    content: text,
                  });
                }}
                isPosting={isPending}
              />
            )}
          </Box>

          <Divider sx={{ borderColor: '#3B3B3B', mb: 2 }} />

          {/* Add new comment */}
          <Typography sx={{ color: '#fff', fontWeight: 900, mb: 1 }}>
            Add your comment
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder='Write a comment…'
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: '#1A1A1A',
                  color: '#EDEDED',
                  borderRadius: '12px',
                },
              }}
            />
            <Button
              onClick={handleAddComment}
              disabled={isPending || !newComment.trim()}
              variant='contained'
              sx={{
                bgcolor: '#EFAF00',
                color: '#000',
                textTransform: 'none',
                fontWeight: 700,
                height: 40,
              }}
            >
              Post
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
