import type {SubscriptionPlansPayload} from "../api/mysubscriptions.types.ts";
import {getSubscriptionPlans} from "../api/mysubscriptions.api.ts";
import {useQuery} from "@tanstack/react-query";

export function useGetSubscriptionPlans() {
  return useQuery<SubscriptionPlansPayload[], Error>({
    queryKey: ['team-subscription-plans'], 
    queryFn: getSubscriptionPlans,
    staleTime: 1000 * 60 * 60 * 24, 
  });
}