import { Stripe } from 'stripe';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/root.config';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  private stripe: Stripe;

  constructor(private configService: ConfigService<Configuration, true>) {
    const stripeConfig = configService.get<Configuration['stripe']>('stripe');

    this.stripe = new Stripe(stripeConfig.secretKey);
  }

  /**
   * @returns URL of checkout page to redirect customer to
   */
  async createCheckoutSession(priceId: string): Promise<string> {
    const webDomain =
      this.configService.get<Configuration['webDomain']>('webDomain');

    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${webDomain}/success?checkout_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${webDomain}/cancel`,
    });

    return session.url!;
  }

  async fetchAllProducts(): Promise<Product[]> {
    const productDefaultImageUrl = this.configService.get<
      Configuration['productDefaultImageUrl']
    >('productDefaultImageUrl');

    const products = await this.stripe.products.list({
      expand: ['data.default_price'],
    });

    return products.data.map(
      ({ id, name, description, default_price, images: [imageUrl] }) => ({
        id,
        name,
        description: description ?? '',
        price: (default_price as Stripe.Price).unit_amount ?? -1,
        imageUrl: imageUrl ?? productDefaultImageUrl,
      }),
    );
  }

  async fetchProductById(productId: string): Promise<Product> {
    const productDefaultImageUrl = this.configService.get<
      Configuration['productDefaultImageUrl']
    >('productDefaultImageUrl');

    const {
      id,
      name,
      description,
      default_price,
      images: [imageUrl],
    } = await this.stripe.products.retrieve(productId, {
      expand: ['default_price'],
    });

    return {
      id,
      name,
      description: description ?? '',
      price: (default_price as Stripe.Price).unit_amount ?? -1,
      imageUrl: imageUrl ?? productDefaultImageUrl,
    };
  }
}
