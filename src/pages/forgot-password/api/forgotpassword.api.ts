import { customFetch } from "../../../Axios";

export type ForgotPasswordPayload = {
    email:string;
}

export type ForgotPasswordResponse = {
  meta: { message: string; code: number; status: string };
  data: string;
};

export const forgotPassword = async(payload: ForgotPasswordPayload) => {
    const { data } = await customFetch.post('/user/forgot-password', payload);

    return data
}

export type ResetPasswordPayload = {
  password: string;
  token: string;
};

export type ResetPasswordResponse = {
  meta: { message: string; code: number; status: string };
  data: string;
};


export const resetPassword = async (payload: ResetPasswordPayload) => {
  const { data } = await customFetch.post<ResetPasswordResponse>(
    '/user/reset-password',
    payload
  );
  return data;
};