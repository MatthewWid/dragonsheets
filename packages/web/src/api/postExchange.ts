import { api } from "../lib/ky";
import { User } from "../types/User";

export type PostExchangeRequest = {
	codeVerifier: string;
	state: string;
	currentUrl: string;
};

export type PostExchangeResponse = User;

export const postExchange = (request: PostExchangeRequest) =>
	api
		.post<PostExchangeResponse>("auth/exchange", {
			json: request,
		})
		.json();
