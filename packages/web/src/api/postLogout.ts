import { api } from "../lib/ky";

export type PostLogoutResponse = {
	logoutUrl: string;
};

export const postLogout = () =>
	api.post<PostLogoutResponse>("auth/logout").json();
