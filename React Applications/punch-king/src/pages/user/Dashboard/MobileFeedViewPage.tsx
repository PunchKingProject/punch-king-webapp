import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import {
    Box,
    Button,
    Card,
    CardMedia,
    Divider,
    IconButton,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import * as React from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import type { CommentRow } from './api/dashboard.types';
import { useCreateComment, usePost } from './hooks/usePost';

// ⬅️ adjust this path if your hooks live elsewhere

const gold = '#EFAF00';
const cardSx = {
  background: '#1A1A1A',
  border: '1px solid #3B3B3B',
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  borderRadius: '12px',
};

function MobileCommentNode({
  comment,
  depth,
  onReply,
  isPosting,
}: {
  comment: CommentRow;
  depth: number;
  onReply: (parentId: number, text: string) => Promise<void> | void;
  isPosting?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const canReply = depth === 0; // mobile parity with desktop: only top-level

  const submit = async () => {
    const val = text.trim();
    if (!val) return;
    await onReply(comment.id, val);
    setText('');
    setOpen(false);
  };

  return (
    <Box sx={{ ml: depth ? 1.5 : 0 }}>
      <Box sx={{ p: 1.25, ...cardSx }}>
        <Typography
          sx={{ color: gold, fontWeight: 700, mb: 0.5, fontSize: 13 }}
        >
          {comment.commenter || 'Anonymous'}
          <span
            style={{
              color: '#A2A2A2',
              fontWeight: 400,
              marginLeft: 8,
              fontSize: 12,
            }}
          >
            {dayjs(comment.created_at).format('D/M/YYYY h:mma')}
          </span>
        </Typography>

        <Typography
          sx={{ color: '#EDEDED', whiteSpace: 'pre-wrap', fontSize: 13 }}
        >
          {comment.content}
        </Typography>

        <Box sx={{ mt: 1 }}>
          {canReply ? (
            open ? (
              <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                <TextField
                  size='small'
                  fullWidth
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder='Write a reply…'
                  sx={{
                    '& .MuiInputBase-root': {
                      bgcolor: '#1A1A1A',
                      color: '#EDEDED',
                      borderRadius: '10px',
                    },
                  }}
                />
                <Button
                  onClick={submit}
                  disabled={isPosting || !text.trim()}
                  variant='contained'
                  sx={{
                    bgcolor: gold,
                    color: '#000',
                    textTransform: 'none',
                    fontWeight: 700,
                    height: 34,
                  }}
                >
                  Reply
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false);
                    setText('');
                  }}
                  variant='text'
                  sx={{
                    color: gold,
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 0,
                    minWidth: 0,
                  }}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Button
                onClick={() => setOpen(true)}
                variant='text'
                sx={{
                  color: gold,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 0,
                  minWidth: 0,
                }}
              >
                Reply
              </Button>
            )
          ) : null}
        </Box>
      </Box>

      {(comment.replies ?? []).map((child) => (
        <MobileCommentNode
          key={child.id}
          comment={child}
          depth={depth + 1}
          onReply={onReply}
          isPosting={isPosting}
        />
      ))}
    </Box>
  );
}

export default function MobileFeedViewPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const id = React.useMemo(() => Number(postId), [postId]);

  const { data, isLoading } = usePost(id);
  const { mutateAsync: addComment, isPending } = useCreateComment(id);

  const [newComment, setNewComment] = React.useState('');

  const handleAddComment = async () => {
    const val = newComment.trim();
    if (!val) return;
    await addComment({ post_id: id, content: val });
    setNewComment('');
  };

  return (
    <Box sx={{ px: 2, py: 2 }}>
      {/* Back */}
      <Button
        onClick={() => navigate(-1)}
        size='small'
        startIcon={<ArrowBackIosNewIcon fontSize='small' />}
        sx={{
          color: gold,
          textTransform: 'none',
          fontWeight: 700,
          px: 0,
          '&:hover': { background: 'transparent' },
        }}
      >
        Back
      </Button>

      {/* Breadcrumb */}
      <Box
        component='nav'
        aria-label='breadcrumb'
        sx={{ mt: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Link
          component={RouterLink}
          to='/user' // or ROUTES.USER_DASHBOARD if you have it
          underline='none'
          sx={{
            color: '#A2A2A2',
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 0.2,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          USER DASHBOARD
        </Link>
        <Typography sx={{ mx: 0.75, color: '#A2A2A2' }}>/</Typography>
        <Link
          component={RouterLink}
          to='/user/feeds' // adjust if you have a feeds list route
          underline='none'
          sx={{
            color: '#A2A2A2',
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 0.2,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          FEEDS
        </Link>
        <Typography sx={{ mx: 0.75, color: '#A2A2A2' }}>/</Typography>
        <Typography
          sx={{
            color: '#FFFCF4',
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: 0.2,
          }}
        >
          FEED VIEW
        </Typography>
      </Box>

      <Typography sx={{ color: '#fff', fontWeight: 900, mt: 2, mb: 1 }}>
        FEED VIEW
      </Typography>

      {isLoading || !data ? (
        <Typography sx={{ color: '#9a9a9a' }}>Loading…</Typography>
      ) : (
        <>
          {/* Team name + position */}
          <Typography sx={{ color: gold, fontWeight: 700, fontSize: 13 }}>
            Team name:&nbsp;
            <span style={{ color: '#fff' }}>{data.team_name || '—'}</span>
          </Typography>
          <Typography
            sx={{ color: gold, fontWeight: 700, fontSize: 13, mb: 1.5 }}
          >
            Position:&nbsp;<span style={{ color: '#fff' }}>—</span>
          </Typography>

          {/* Sponsor + Share */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
            <Button
              variant='contained'
              sx={{
                bgcolor: gold,
                color: '#000',
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: '10px',
                height: 40,
              }}
              onClick={() =>
                navigate(`/user/feeds/${postId}/sponsorship`, {
                  state: {
                    postId: id,
                    teamName: data.team_name,
                    teamPosition: '—',
                    mediaUrl: data.file_url,
                    sponsors: data.sponsors,
                    contributors: data.sponsorships,
                  },
                })
              }
            >
              Sponsor
            </Button>
            <IconButton sx={{ color: gold }}>
              <ShareOutlinedIcon />
            </IconButton>
          </Box>

          {/* Media */}
          <Card sx={{ ...cardSx, p: 1.25, mb: 1.5 }}>
            {data.file_url ? (
              <CardMedia
                component='img'
                image={data.file_url}
                alt={data.title}
                sx={{ maxHeight: 260, objectFit: 'contain', borderRadius: 2 }}
              />
            ) : (
              <Box sx={{ height: 220, bgcolor: '#2a2a2a', borderRadius: 2 }} />
            )}
          </Card>

          {/* Caption + date */}
          <Box sx={{ color: '#C9C9C9', mb: 2 }}>
            <Typography sx={{ color: '#A2A2A2', fontSize: 12, mb: 0.75 }}>
              {dayjs(data.created_at).format('D/M/YYYY h:mma')}
            </Typography>
            <Typography
              sx={{ whiteSpace: 'pre-wrap', color: '#FFF', fontSize: 13 }}
            >
              {data.caption}
            </Typography>
          </Box>

          {/* Comments */}
          <Typography sx={{ color: '#fff', fontWeight: 900, mb: 1 }}>
            Comments
          </Typography>

          <Box sx={{ display: 'grid', gap: 1.25, mb: 2 }}>
            {(data.comments?.length ?? 0) === 0 ? (
              <Typography sx={{ color: '#9a9a9a', fontSize: 13 }}>
                No comments yet.
              </Typography>
            ) : (
              (data.comments as CommentRow[]).map((c) => (
                <MobileCommentNode
                  key={c.id}
                  comment={c}
                  depth={0}
                  onReply={async (parentId, text) => {
                    await addComment({
                      post_id: id,
                      parent_comment_id: parentId,
                      content: text,
                    });
                  }}
                  isPosting={isPending}
                />
              ))
            )}
          </Box>

          <Divider sx={{ borderColor: '#3B3B3B', mb: 1.5 }} />

          {/* Add comment */}
          <Typography sx={{ color: '#fff', fontWeight: 900, mb: 0.75 }}>
            Add your comment
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
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
                bgcolor: gold,
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
