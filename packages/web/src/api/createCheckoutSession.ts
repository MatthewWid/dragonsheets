import { api } from "../lib/ky";

export type CreateCheckoutSessionRequest = {
	priceId: string;
};

export type CreateCheckoutSessionResponse = {
	redirectUrl: string;
};

export const createCheckoutSession = ({
	priceId,
}: CreateCheckoutSessionRequest) =>
	api
		.post<CreateCheckoutSessionResponse>("products/checkout-session", {
			json: { priceId },
		})
		.json();
