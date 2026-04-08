import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateLicenseStatusPayload } from "../api/licensing.types";
import { updateLicenseStatus } from "../api/licensing.api";

export function useUpdateLicenseStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: UpdateLicenseStatusPayload) => updateLicenseStatus(p),
    onSuccess: async () => {
      // refresh history list + any cards if needed
      await qc.invalidateQueries({ queryKey: ['team-license-history'] });
      await qc.invalidateQueries({ queryKey: ['license'] });
    },
  });
}
