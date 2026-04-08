// src/pages/user/Sponsorship/hooks/useVoteForPost.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { voteForPost } from '../api/dashboard.api';
import type { VotePayload, VoteResponse } from '../api/dashboard.types';

export function useVoteForPost() {
  const qc = useQueryClient();

  return useMutation<VoteResponse, AxiosError, VotePayload>({
    mutationFn: voteForPost,
    onSuccess: (_data, vars) => {
      // refresh user stats (balance etc.)
      qc.invalidateQueries({ queryKey: ['user-stats'] });

      // refresh the post detail (sponsor counts on the card)
      qc.invalidateQueries({ queryKey: ['post', vars.post_id] });

      // refresh any infinite/all-posts lists (regardless of limit)
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) && q.queryKey[0] === 'all-posts',
      });
    },
  });
}
