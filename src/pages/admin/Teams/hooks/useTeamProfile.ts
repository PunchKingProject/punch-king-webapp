import { useQuery } from "@tanstack/react-query";
import { getTeamProfile } from "../api/teams.api";
import type { TeamProfile } from "../api/teams.types";



export function useTeamProfile(teamId: number) {
  return useQuery<TeamProfile>({
    queryKey: ['team-profile', teamId],
    queryFn: () => getTeamProfile(teamId),
    enabled: Number.isFinite(teamId) && teamId > 0,
    staleTime: 60_000,
  });
}



