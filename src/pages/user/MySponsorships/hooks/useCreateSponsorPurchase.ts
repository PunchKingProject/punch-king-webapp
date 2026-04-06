// src/pages/user/MySponsorships/hooks/useCreateSponsorPurchase.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSponsorPurchase } from '../api/mysponsorships.api.ts';
import type {CreateSponsorPurchaseRequest, CreateSponsorPurchaseResponse} from "../api/mysponsorships.types.ts";

export function useCreateSponsorPurchase() {
  const qc = useQueryClient();

  return useMutation<CreateSponsorPurchaseResponse, Error, CreateSponsorPurchaseRequest>({
    mutationFn: async (body) => {
      // The API function now returns the { data: "http..." } object
      return await createSponsorPurchase(body);
    },
    onSuccess: () => {
      // Invalidate queries to ensure UI is fresh when user returns from Flutterwave
      qc.invalidateQueries({ queryKey: ['user-stats'] });
      qc.invalidateQueries({ queryKey: ['purchase-history'] });
    },
  });
}