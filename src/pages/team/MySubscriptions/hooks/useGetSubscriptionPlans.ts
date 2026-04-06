import type {SubscriptionPlansPayload} from "../api/mysubscriptions.types.ts";
import {getSubscriptionPlans} from "../api/mysubscriptions.api.ts";
import {useQuery} from "@tanstack/react-query";

export function useGetSubscriptionPlans() {
  return useQuery<SubscriptionPlansPayload[], Error>({
    queryKey: ['sponsorship-rates'],
    queryFn: getSubscriptionPlans,
    // Optional: Keep the rates in cache for 24 hours as they don't change often
    staleTime: 1000 * 60 * 60 * 24,
  });
}