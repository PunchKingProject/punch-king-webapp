import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchUserProfile } from "../api/users.api";
import type { UpdateUserPayload } from "../api/users.types";


export function useUpdateUserProfile(sponsor_id: number) {
    const qc = useQueryClient()

    return useMutation({
      mutationFn: (payload: UpdateUserPayload) =>
        patchUserProfile(sponsor_id, payload),
      onSuccess: () => {
        // // Update cached profile immediately
        // qc.setQueryData<UserProfile>(['user-profile', sponsor_id], updated);

        // Invalidate adjacent data on the user details page that depends on this user
        qc.invalidateQueries({ queryKey: ['user-details-stats', sponsor_id] });
        qc.invalidateQueries({
          queryKey: ['user-purchase-history', sponsor_id],
        });
        qc.invalidateQueries({ queryKey: ['user-vote-history', sponsor_id] });
      }
    });
}