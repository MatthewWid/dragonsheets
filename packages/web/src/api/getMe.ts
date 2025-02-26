import { api } from "../lib/ky";
import { User } from "../types/User";

export type GetMeResponse = User;

export const getMe = () => api.get<GetMeResponse>("auth/me").json();
