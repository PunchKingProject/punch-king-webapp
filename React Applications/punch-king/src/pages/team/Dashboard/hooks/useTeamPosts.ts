import { useQuery } from "@tanstack/react-query";
import type { TeamPost } from "../api/dashboard.types";
import { getTeamPosts } from "../api/dashboard.api";

export function useTeamPosts() {
  return useQuery<TeamPost[]>({
    queryKey: ['team-posts'],
    queryFn: getTeamPosts,
    staleTime: 60_000,
  });
}
