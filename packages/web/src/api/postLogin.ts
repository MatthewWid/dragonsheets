import { api } from "../lib/ky";

export type PostLoginResponse = {
	loginUrl: string;
	codeVerifier: string;
	state: string;
};

export const postLogin = () => api.post<PostLoginResponse>("auth/login").json();
