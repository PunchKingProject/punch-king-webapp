import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchAdminUser } from "../api/users.api";
import type { UpdateUserPayload } from "../api/users.types";

export function useAdminUpdateUser(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) =>
      patchAdminUser(userId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-user", userId],
      });
    },
  });
}