import { api } from "../lib/ky";
import { Product } from "../types/Product";

export type GetCheckoutSessionResultRequest = {
	sessionId: string;
};

export type GetCheckoutSessionResultResponse = {
	products: Product[];
};

export const getCheckoutSessionResult = ({
	sessionId,
}: GetCheckoutSessionResultRequest) =>
	api
		.get<GetCheckoutSessionResultResponse>(
			`products/checkout-session/${sessionId}/result`
		)
		.json();
