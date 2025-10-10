import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../api/users.api";
import { type UserProfile } from "../api/users.types";



export function useUserProfile(sponsor_id: number) {

    return useQuery<UserProfile>({
      queryKey: ['user-profile', sponsor_id],
      queryFn: () => fetchUserProfile(sponsor_id),
      enabled: Number.isFinite(sponsor_id) && sponsor_id > 0,
      staleTime: 60_000
    });
}