import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateSubStatusPayload } from '../api/subscriptions.types.ts';
import { updateSubStatus } from '../api/subscriptions.api.ts';

export function useUpdateSubStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSubStatusPayload) => updateSubStatus(payload),
    onSuccess: () => {
      // refresh the dashboard + the team details history
      qc.invalidateQueries({ queryKey: ['subs'] });
      qc.invalidateQueries({ queryKey: ['team-sub-history'] });
    },
  });
}
