import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreatePostPayload } from "../api/catalogue.types.ts";
import { createTeamPost } from "../api/catalogue.api.ts";

export function useUploadPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreatePostPayload) => createTeamPost(p),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['team-posts'] }),
        qc.invalidateQueries({ queryKey: ['post-stats'] }),
      ]);
    },
  });
}
