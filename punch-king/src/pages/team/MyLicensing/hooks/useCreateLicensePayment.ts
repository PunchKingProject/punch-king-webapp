import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateArgs } from "../api/mylicensing.types.ts";
import { createLicensePayment } from "../api/mylicensing.api.ts";


export function useCreateLicensePayment() {
  const qc = useQueryClient();

  return useMutation<void, Error, CreateArgs>({
    mutationFn: async ({ payment_amount, payment_slip }) => {
      await createLicensePayment({
        payment_date: new Date().toISOString(), // today
        payment_amount,
        payment_slip,
        // hard-coded source details
        source_bank_name: 'FCMB',
        source_bank_account_name: 'Akinbulejo James',
        source_bank_account_number: '2002010825',
      });
    },
    onSuccess: () => {
      // refresh anything relevant if you track balances/lists
      qc.invalidateQueries({ queryKey: ['license-payment-history'] });
      qc.invalidateQueries({ queryKey: ['user-stats'] });
    },
  });
}