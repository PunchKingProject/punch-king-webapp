import { useQuery } from "@tanstack/react-query";
import { getSponsorRelatedList } from "../api/mySponsorship.api";
import type { SponsorRelatedParams, SponsorRelatedPayload } from "../api/mySponsorship.types";


export function useSponsorRelatedList(params: SponsorRelatedParams) {
  return useQuery<SponsorRelatedPayload, Error>({
    queryKey: ['sponsor-related-list', params],
    queryFn: () => getSponsorRelatedList(params),
  });
}
