import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blockUser } from "../api/users.api";
import type { AdminActionPayload } from "../api/users.types";

export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: number;
      payload: AdminActionPayload;
    }) => blockUser(userId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user-dashboard-table"],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-profile", variables.userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-dashboard-stats"],
      });
    },
  });
}