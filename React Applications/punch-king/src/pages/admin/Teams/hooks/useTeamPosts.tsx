import { useQuery } from "@tanstack/react-query";
import { getTeamPosts } from "../api/teams.api";
import type { TeamPost } from "../api/teams.types";



export function useTeamPosts(teamId: number) {
  return useQuery({
    queryKey: ['teamPosts', teamId],
    queryFn: () => getTeamPosts(teamId),
    staleTime: 60_000,
    select: (rows) => rows as TeamPost[],
  });
}