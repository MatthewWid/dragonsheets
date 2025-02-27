import { api } from "../lib/ky";

export type PostLogoutInitResponse = {
	logoutUrl: string;
};

export const postLogoutInit = () =>
	api.post<PostLogoutInitResponse>("auth/logout-init").json();
