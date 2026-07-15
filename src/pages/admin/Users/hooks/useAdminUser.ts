import { useQuery } from "@tanstack/react-query";
import { fetchAdminUser } from "../api/users.api";
import type { AdminManagedUser } from "../api/users.types";

export function useAdminUser(userId: number) {
  return useQuery<AdminManagedUser>({
    queryKey: ["admin-user", userId],
    queryFn: () => fetchAdminUser(userId),
    enabled: userId > 0,
    staleTime: 60_000,
  });
}