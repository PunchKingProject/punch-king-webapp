
import { customFetch } from "../../../Axios"

export type VerifyUserPayload = {
  email: string;
  name: string;
  role: 'sponsor' | 'team';
};

export type VerifyUserResponse = {
  meta: { message: string; code: number; status: string };
  data: string;
};



export const verifyUser = async (payload: VerifyUserPayload) => {
  const { data } = await customFetch.post<VerifyUserResponse>('/user/verify',payload);

  return data
};

export type CreateUserPayload = {
token: string;
password: string;
};

export const createUser = async(payload: CreateUserPayload) => {
    const { data } = await customFetch.post('/user/',payload)
    return data
}


export type UpdateUserPayload = {
  phone_number?: string;
  address?: string;
  country?: string;
  state?: string;
  dob?: string; // e.g. "1997-30-01" (use the format your API expects)
  gender?: string;
  bio?: string;
  coach_1?: string;
  coach_2?: string;
  profile_picture?: string;
  license_number?: string;
};

// If your backend expects PUT, switch post -> put.
export async function updateUser(payload: UpdateUserPayload) {
  const { data } = await customFetch.patch('/user/update', payload);
  return data;
}


type LoginPayload = { name: string; password: string };
type LoginResponse = {
  meta: { message: string; code: number; status: string };
  data: string; // JWT
};

export async function loginUser(payload: LoginPayload) {
  const { data } = await customFetch.post<LoginResponse>(
    '/user/login',
    payload
  );
  return data; // { meta, data: "<jwt>" }
}