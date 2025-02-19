import { join } from 'path';
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

  convertStripeProductToProduct({
    id,
    name,
    description,
    default_price,
    images,
  }: Stripe.Product): Product {
    const { id: priceId, unit_amount: priceValue = -1 } =
      default_price as Stripe.Price & { unit_amount: number };

    return {
      id,
      name,
      description: description ?? '',
      priceId,
      priceValue,
      imageUrl:
        images?.[0] ??
        this.configService.get<Configuration['productDefaultImageUrl']>(
          'productDefaultImageUrl',
        ),
    };
  }

  async fetchAllProducts(): Promise<Product[]> {
    const products = await this.stripe.products.list({
      expand: ['data.default_price'],
    });

    return products.data.map(this.convertStripeProductToProduct);
  }

  async fetchProductById(productId: string): Promise<Product> {
    const product = await this.stripe.products.retrieve(productId, {
      expand: ['default_price'],
    });

    return this.convertStripeProductToProduct(product);
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
    });

    return session.url!;
  }

  async fetchCheckoutResult(sessionId: string): Promise<Product[] | null> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    if (session.payment_status !== 'paid') {
      return null;
    }

    const productIds = session.line_items!.data.map(
      ({ price }) => price?.product,
    ) as string[];

    const products = await this.stripe.products.list({
      ids: productIds,
      expand: ['data.default_price'],
    });

    return products.data.map(this.convertStripeProductToProduct);
  }

  async fetchAssetFilePath(
    sessionId: string,
    productId: string,
  ): Promise<string | null> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    if (session.payment_status !== 'paid') {
      return null;
    }

    if (
      !session.line_items!.data.some(
        (lineItem) => lineItem.price?.product === productId,
      )
    ) {
      return null;
    }

    const productIdToAssetPath = this.configService.get<
      Configuration['productIdToAssetPath']
    >('productIdToAssetPath');

    const fileName = productIdToAssetPath[productId];

    if (!fileName) {
      return null;
    }

    const env = this.configService.get<Configuration['env']>('env');

    const filePath = join(
      process.cwd(),
      env === 'development' ? 'src' : 'dist',
      'assets',
      fileName,
    );

    return filePath;
  }
}
