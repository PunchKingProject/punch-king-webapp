import { useQuery } from "@tanstack/react-query";
import type { SponsorRelatedStats, SponsorRelatedStatsParams } from "../api/mySponsorship.types";
import { getSponsorRelatedStats } from "../api/mySponsorship.api";

export function useSponsorRelatedStats(params: SponsorRelatedStatsParams) {
  return useQuery<SponsorRelatedStats, Error>({
    queryKey: [
      'sponsor-related-stats',
      params.sponsor_id,
      params.start_date,
      params.end_date,
    ],
    queryFn: () => getSponsorRelatedStats(params),
    enabled: !!params?.sponsor_id && !!params?.start_date && !!params?.end_date,
  });
}
