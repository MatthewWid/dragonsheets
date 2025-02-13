import { Body, Controller, Post, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PostCheckoutSessionDto } from './dto/post-checkout-session.dto';
import { Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout-session')
  async postCheckoutSession(
    @Body() { priceId }: PostCheckoutSessionDto,
    @Res() res: Response,
  ) {
    res.redirect(await this.paymentsService.createCheckoutSession(priceId));
  }
}
