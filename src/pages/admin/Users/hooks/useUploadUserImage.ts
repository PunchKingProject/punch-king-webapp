import { useUploadTeamImage } from "../../../../hooks/useUploadTeamImage.ts";

/**
 * mutateAsync(file: File) => Promise<string> (public URL)
 */
export function useUploadUserImage() {
  return useUploadTeamImage();
}
