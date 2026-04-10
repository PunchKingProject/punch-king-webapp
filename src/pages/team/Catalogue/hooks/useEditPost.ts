// hooks/useUpdatePost.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { editTeamPost } from '../api/catalogue.api.ts';

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editTeamPost,
    onSuccess: (updatedPost) => {
      // Update the specific post in the cache directly so the
      // catalogue list reflects the change without a full refetch
      queryClient.setQueryData(['team-post', updatedPost.id], updatedPost);

      // Invalidate the list so the feed shows the updated title/caption
      queryClient.invalidateQueries({ queryKey: ['team-posts'] });
      queryClient.invalidateQueries({ queryKey: ['all-posts'] });

      toast.success('Post updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update post. Please try again.');
    },
  });
}