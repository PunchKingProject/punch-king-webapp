import type { AxiosProgressEvent } from 'axios';
import { customFetch } from '../Axios.ts';

export type ApiMeta = {
  message: string;
  code: number;
  status: string;
};

export type ApiResponse<T> = {
  meta: ApiMeta;
  data: T;
};

const MAX_MEDIA_SIZE_BYTES = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/ogg',
];

function validateMediaFile(file: File): void {
  const allowedTypes = [
    ...ALLOWED_IMAGE_TYPES,
    ...ALLOWED_VIDEO_TYPES,
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      'Unsupported file type. Upload JPG, PNG, WEBP, GIF, MP4, WEBM, MOV or OGG.'
    );
  }

  if (file.size > MAX_MEDIA_SIZE_BYTES) {
    throw new Error(
      'The selected media exceeds the maximum permitted size of 10MB.'
    );
  }

  if (file.size <= 0) {
    throw new Error('The selected file is empty.');
  }
}

export async function uploadTeamImage(
  file: File,
  opts?: {
    signal?: AbortSignal;
    onUploadProgress?: (
      event: AxiosProgressEvent
    ) => void;
  }
): Promise<string> {
  validateMediaFile(file);

  const formData = new FormData();
  formData.append('file', file);

  const response =
    await customFetch.post<ApiResponse<string>>(
      '/img/?type=post',
      formData,
      {
        signal: opts?.signal,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress:
          opts?.onUploadProgress,
      }
    );

  const url = response.data?.data;

  if (!url) {
    throw new Error(
      'The server did not return an uploaded media URL.'
    );
  }

  return url;
}

export {
  MAX_MEDIA_SIZE_BYTES,
  validateMediaFile,
};