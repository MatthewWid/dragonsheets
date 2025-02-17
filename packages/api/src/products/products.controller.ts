import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PostCheckoutSessionDto } from './dto/post-checkout-session.dto';
import { Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('checkout-session')
  async postCheckoutSession(
    @Body() { priceId }: PostCheckoutSessionDto,
    @Res() res: Response,
  ) {
    res.redirect(await this.productsService.createCheckoutSession(priceId));
  }
}
