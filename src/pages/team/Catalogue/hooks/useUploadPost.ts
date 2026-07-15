import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTeamPost } from '../api/catalogue.api';
import type { CreatePostPayload, TeamPost } from '../api/catalogue.types';

export function useUploadPost() {
  const queryClient = useQueryClient();

  return useMutation<TeamPost, Error, CreatePostPayload>({
    mutationFn: createTeamPost,

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
    },
  });
}