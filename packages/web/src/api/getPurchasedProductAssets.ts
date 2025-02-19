import { api } from "../lib/ky";

export type GetPurchasedProductAssetsRequest = {
	sessionId: string;
	productId: string;
};

export type GetPurchasedProductAssetsResponse = Blob;

export const getPurchasedProductAssets = ({
	sessionId,
	productId,
}: GetPurchasedProductAssetsRequest) =>
	api
		.get<GetPurchasedProductAssetsRequest>(
			`products/checkout-session/${sessionId}/download/${productId}`
		)
		.blob();
