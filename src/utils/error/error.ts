// utils/error.ts
import type { AxiosError } from 'axios';

export function getErrorMessage(err: unknown): string {
  if ((err as AxiosError)?.isAxiosError) {
    const ax = err as AxiosError<{ error?: string; message?: string }>;
    return (
      ax.response?.data?.error ||
      ax.response?.data?.message ||
      ax.message ||
      'Something went wrong'
    );
  }
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Something went wrong';
}
