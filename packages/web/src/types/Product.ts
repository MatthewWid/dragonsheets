export interface Product {
	id: string;
	name: string;
	description: string;
	priceId: string;
	/** Price in cents */
	priceValue: number;
	imageUrl: string;
}
