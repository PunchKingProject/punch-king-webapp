import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { deleteTeamPost } from '../api/catalogue.api';
import type { DeletePostPayload } from '../api/catalogue.types';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeletePostPayload>({
    mutationFn: deleteTeamPost,

    onSuccess: async () => {
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

      toast.success('Post deleted successfully.');
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to delete post.');
    },
  });
}