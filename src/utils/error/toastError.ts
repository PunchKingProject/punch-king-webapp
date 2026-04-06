// utils/toastError.ts
import { toast } from 'react-toastify';
import { getErrorMessage } from './error.ts';

export function showError(err: unknown) {
  toast.error(getErrorMessage(err));
}
