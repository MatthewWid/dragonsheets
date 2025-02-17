import { api } from "../lib/ky";
import { Product } from "../types/Product";

export type GetAllProductsResponse = Product[];

export const getAllProducts = () =>
	api.get<GetAllProductsResponse>("products").json();
