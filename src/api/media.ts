// src/api/media.ts

import { customFetch } from "../Axios.ts";

export type ApiMeta = { message: string; code: number; status: string };
export type ApiResponse<T> = { meta: ApiMeta; data: T };

/**
 * Upload a single image via multipart/form-data and return the hosted URL.
 * Backend: POST /img with form key "file"
 * Response: { meta, data: string }
 */
import type { AxiosProgressEvent } from "axios";

export async function uploadTeamImage(
  file: File,
  opts?: { signal?: AbortSignal; onUploadProgress?: (e: AxiosProgressEvent) => void }
): Promise<string> {
  const fd = new FormData();
  fd.append('file', file); // server expects key "file"

  const res = await customFetch.post<ApiResponse<string>>('/img/', fd, {
    signal: opts?.signal,
    // override default 'application/json' so axios sets multipart boundary:
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: opts?.onUploadProgress,
  });

  const url = res.data?.data;
  if (!url) throw new Error('No URL returned from server');
  return url;
}


