// hooks/useDeletePost.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {deleteTeamPost} from "../api/catalogue.api.ts";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeamPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-posts'] });
      queryClient.invalidateQueries({ queryKey: ['post-stats'] });
      queryClient.invalidateQueries({ queryKey: ['all-posts'] });
      toast.success('Post deleted successfully.');
    },
    onError: () => {
      toast.error('Failed to delete post. Please try again.');
    },
  });
}