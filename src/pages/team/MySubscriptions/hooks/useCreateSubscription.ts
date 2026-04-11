import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSubscription } from '../api/mysubscriptions.api';
import type { CreateSubBody } from '../api/mysubscriptions.types';

type Args = {
  type: 'annual' | 'semi-annual';
  payment_amount: number;
  payment_slip: string; // uploaded URL
};

const todayUTC00 = () => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
};

export function useCreateSubscription() {
  const qc = useQueryClient();

  return useMutation<void, Error, Args>({
    mutationFn: async ({ type, payment_amount, payment_slip }) => {
      const body: CreateSubBody= {
        type,
        payment_date: todayUTC00(),
        payment_amount,
        payment_slip,
        // hard-coded source bank info
        source_bank_name: 'FCMB',
        source_bank_account_name: 'Akinbulejo James',
        source_bank_account_number: '2002010825',
      };
      await createSubscription(body);
    },
    onSuccess: () => {
      // refresh any dashboards/history that rely on subs
      qc.invalidateQueries({ queryKey: ['team-sub-payments'] });
      qc.invalidateQueries({ queryKey: ['team-sub-active-inactive'] });
      qc.invalidateQueries({ queryKey: ['team-sub-stats'] });
    },
  });
}
