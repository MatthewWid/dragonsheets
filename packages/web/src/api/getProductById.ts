import { api } from "../lib/ky";
import { Product } from "../types/Product";

export type GetProductByIdRequest = {
	productId: string;
};

export type GetProductByIdResponse = Product;

export const getProductById = ({ productId }: GetProductByIdRequest) =>
	api.get<GetProductByIdResponse>(`products/${productId}`).json();
