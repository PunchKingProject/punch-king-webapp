// utils/toastError.ts
import { toast } from 'react-toastify';
import { getErrorMessage } from './error';

export function showError(err: unknown) {
  toast.error(getErrorMessage(err));
}
