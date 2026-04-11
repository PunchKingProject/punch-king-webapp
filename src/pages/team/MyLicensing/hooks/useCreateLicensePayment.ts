import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {CreateLicensePaymentRequest, CreateLicenseResponse} from "../api/mylicensing.types.ts";
import { createLicensePayment } from "../api/mylicensing.api.ts";


export function useCreateLicensePayment() {
  const qc = useQueryClient();

  return useMutation<CreateLicenseResponse, Error, CreateLicensePaymentRequest>({
    mutationFn: async (body): Promise<CreateLicenseResponse> => {
      return await createLicensePayment(body);
    },
    onSuccess: () => {
      // refresh anything relevant if you track balances/lists
      qc.invalidateQueries({ queryKey: ['license-payment-history'] });
      qc.invalidateQueries({ queryKey: ['user-stats'] });
    },
  });
}