export interface Product {
  id: string;
  name: string;
  description: string;
  /** Price in cents */
  priceValue: number;
  priceId: string;
  imageUrl: string;
}
