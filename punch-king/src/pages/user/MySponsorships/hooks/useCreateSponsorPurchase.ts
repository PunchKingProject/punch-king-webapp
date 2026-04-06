// BEFORE
// import { createSponsorshipPurchase } from '../api/mysponsorships.api';

// AFTER
import { createSponsorPurchase } from '../api/mysponsorships.api.ts';

import { useMutation, useQueryClient } from '@tanstack/react-query';

type CreatePurchaseArgs = {
  points: number;
  payment_amount: number;
  payment_slip: string; // URL already uploaded
};

// Hard-code implicit fields here and set today's date
export function useCreateSponsorPurchase() {
  const qc = useQueryClient();

  return useMutation<void, Error, CreatePurchaseArgs>({
    mutationFn: async ({ points, payment_amount, payment_slip }) => {
      await createSponsorPurchase({
        payment_date: new Date().toISOString(), // today
        payment_amount,
        points,
        payment_slip,
        // hard-coded implicit fields
        source_bank_name: 'FCMB',
        source_bank_account_name: 'Akinbulejo Samson',
        source_bank_account_number: '2003010825',
      });
    },
    onSuccess: () => {
      // keep it simple; refresh balances & history
      qc.invalidateQueries({ queryKey: ['user-stats'] });
      qc.invalidateQueries({ queryKey: ['purchase-history'] });
    },
  });
}
