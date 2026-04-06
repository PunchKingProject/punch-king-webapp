import { useQuery } from "@tanstack/react-query";
import { getSponsorRelatedList } from "../api/mySponsorship.api.ts";
import type { SponsorRelatedParams, SponsorRelatedPayload } from "../api/mySponsorship.types.ts";


export function useSponsorRelatedList(params: SponsorRelatedParams) {
  return useQuery<SponsorRelatedPayload, Error>({
    queryKey: ['sponsor-related-list', params],
    queryFn: () => getSponsorRelatedList(params),
  });
}
