// src/hooks/useUploadTeamImage.ts
import { useMutation } from '@tanstack/react-query';
import { uploadTeamImage } from '../api/media.ts';

export function useUploadTeamImage() {
  return useMutation({
    mutationFn: (file: File) => uploadTeamImage(file),
  });
}
