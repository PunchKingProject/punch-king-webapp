// utils/onError.ts
import type { UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { showError } from './toastError.ts';

// Wraps your custom onError so it always shows a toast first
export function withErrorToast<
  TData = unknown,
  TVariables = void,
  TError extends AxiosError = AxiosError,
  TContext = unknown
>(custom?: UseMutationOptions<TData, TError, TVariables, TContext>['onError']) {
  return (err: TError, vars: TVariables, ctx: TContext) => {
    showError(err);
    custom?.(err, vars, ctx); // run your extra logic
  };
}
