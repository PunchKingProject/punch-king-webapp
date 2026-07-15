import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { editTeamPost } from '../api/catalogue.api';
import type {
  EditPostPayload,
  TeamPost,
} from '../api/catalogue.types';

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation<TeamPost, Error, EditPostPayload>({
    mutationFn: editTeamPost,

    onSuccess: async (updatedPost) => {
      // Update the single post cache
      queryClient.setQueryData(
        ['team-post', updatedPost.id],
        updatedPost
      );

      // Refresh every list that may contain this post
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['team-posts'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['post-stats'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['public-posts'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['weight-class-posts'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['dashboard-posts'],
        }),
      ]);

      toast.success('Post updated successfully.');
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to update post.');
    },
  });
}