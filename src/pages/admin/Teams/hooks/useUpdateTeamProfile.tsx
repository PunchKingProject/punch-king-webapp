import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTeamProfile } from '../api/teams.api.ts';
import type { UpdateTeamPayload } from '../api/teams.types.ts';

export function useUpdateTeamProfile(teamId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateTeamPayload) => updateTeamProfile(teamId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        // refetch the team profile after update
        queryKey: ['team-profile', teamId],
      });
    },
  });
}
