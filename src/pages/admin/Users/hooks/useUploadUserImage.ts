import { useUploadTeamImage } from "../../../../hooks/useUploadTeamImage";

/**
 * mutateAsync(file: File) => Promise<string> (public URL)
 */
export function useUploadUserImage() {
  return useUploadTeamImage();
}
