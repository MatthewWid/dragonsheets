import { Stripe } from 'stripe';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/root.config';

@Injectable()
export class PaymentsService {
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
}
