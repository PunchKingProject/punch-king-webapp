import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSubscription } from '../api/mysubscriptions.api.ts';
import type {CreateSubBody, CreateSubscriptionResponse} from '../api/mysubscriptions.types.ts';

// const todayUTC00 = () => {
//   const d = new Date();
//   d.setUTCHours(0, 0, 0, 0);
//   return d.toISOString();
// };

export function useCreateSubscription() {
  const qc = useQueryClient();

  return useMutation<CreateSubscriptionResponse, Error, CreateSubBody>({
    mutationFn: async (body): Promise<CreateSubscriptionResponse> => {
      return await createSubscription(body);
    },
    onSuccess: () => {
      // refresh any dashboards/history that rely on subs
      qc.invalidateQueries({ queryKey: ['team-sub-payments'] });
      qc.invalidateQueries({ queryKey: ['team-sub-active-inactive'] });
      qc.invalidateQueries({ queryKey: ['team-sub-stats'] });
    },
  });
}
