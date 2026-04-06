import { Box, Button, TextField, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import type { CommentRow } from '../api/dashboard.types.ts';

const cardSx = {
  background: '#1A1A1A',
  border: '1px solid #3B3B3B',
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  borderRadius: '12px',
};

type NodeProps = {
  comment: CommentRow;
  depth: number;
  onReply: (parentId: number, text: string) => Promise<void> | void;
  isPosting?: boolean;
};

function CommentNode({ comment, depth, onReply, isPosting }: NodeProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const submit = async () => {
    if (depth > 0) return; // hard guard: API forbids reply-to-reply

    const val = text.trim();
    if (!val) return;
    await onReply(comment.id, val);
    setText('');
    setOpen(false);
  };

  const canReply = depth === 0; // ✅ only top-level comments can be replied to

  return (
    <Box sx={{ ml: depth ? 2 : 0 }}>
      <Box sx={{ p: 2, ...cardSx }}>
        <Typography sx={{ color: '#EFAF00', fontWeight: 700, mb: 0.5 }}>
          {comment.commenter || 'Anonymous'}
          <span style={{ color: '#A2A2A2', fontWeight: 400, marginLeft: 8 }}>
            {dayjs(comment.created_at).format('M/D/YYYY h:mma')}
          </span>
        </Typography>

        <Typography sx={{ color: '#EDEDED', whiteSpace: 'pre-wrap' }}>
          {comment.content}
        </Typography>

        <Box sx={{ mt: 1.25 }}>
          { canReply ? (open ? (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
                  },
                }}
              />
              <Button
                onClick={submit}
                disabled={isPosting || !text.trim()}
                variant='contained'
                sx={{
                  bgcolor: '#EFAF00',
                  color: '#000',
                  textTransform: 'none',
                  fontWeight: 700,
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
                  color: '#EFAF00',
                  textTransform: 'none',
                  fontWeight: 700,
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
                color: '#EFAF00',
                textTransform: 'none',
                fontWeight: 700,
                px: 0,
                minWidth: 0,
              }}
            >
              Reply
            </Button>
          )) : (
            // optional: show disabled hint on nested comments
            <Tooltip title="Only top-level comments can be replied to">
              <span>
                <Button
                  variant='text'
                  disabled
                  sx={{ color: '#7a6a2e', textTransform: 'none', fontWeight: 700, px: 0, minWidth: 0 }}
                >
                  Reply
                </Button>
              </span>
            </Tooltip>
          )}
        </Box>
      </Box>

      {(comment.replies ?? []).map((child) => (
        <CommentNode
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

type CommentThreadProps = {
  comments: CommentRow[];
  onReply: (parentId: number, text: string) => Promise<void> | void;
  isPosting?: boolean;
};

export default function CommentThread({
  comments,
  onReply,
  isPosting,
}: CommentThreadProps) {
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {comments.map((c) => (
        <CommentNode
          key={c.id}
          comment={c}
          depth={0}
          onReply={onReply}
          isPosting={isPosting}
        />
      ))}
    </Box>
  );
}
