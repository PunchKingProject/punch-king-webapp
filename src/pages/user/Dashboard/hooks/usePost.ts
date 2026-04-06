import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, getPostById } from "../api/dashboard.api.ts";
import type { CommentRow, CreateCommentPayload, PostDetail } from "../api/dashboard.types.ts";

function normalize(post: PostDetail): PostDetail {
  const mapReplies = (c: CommentRow): CommentRow => ({
    ...c,
    replies: Array.isArray(c.replies) ? c.replies.map(mapReplies) : [],
  });

  return {
    ...post,
    comments: Array.isArray(post.comments) ? post.comments.map(mapReplies) : [],
  };
}

export function usePost(postId: number) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
    enabled: Number.isFinite(postId),
    // ⬇️ ensure `comments`/`replies` are always arrays
    select: normalize,
  });
}

export function useCreateComment(postId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => createComment(payload),
    onSuccess: () => {
      // refresh the post details incl. comments
      qc.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}