import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  StreamableFile,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { PostCheckoutSessionDto } from './dto/post-checkout-session.dto';
import { createReadStream } from 'fs';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.fetchAllProducts();
  }

  @Get('product/:productId')
  getProductById(@Param('productId') productId: string) {
    return this.productsService.fetchProductById(productId);
  }

  @Post('checkout-session')
  async postCheckoutSession(@Body() { priceId }: PostCheckoutSessionDto) {
    return {
      redirectUrl: await this.productsService.createCheckoutSession(priceId),
    };
  }

  @Get('checkout-session/:sessionId/result')
  async getCheckoutSession(@Param('sessionId') sessionId: string) {
    const products = await this.productsService.fetchCheckoutResult(sessionId);

    if (!products) {
      throw new NotFoundException(
        'Checkout session result does not exist. Please complete your checkout or start a new session.',
      );
    }

    return { products };
  }

  @Get('checkout-session/:sessionId/download/:productId')
  async getCharacterSheet(
    @Param('sessionId') sessionId: string,
    @Param('productId') productId: string,
  ) {
    const path = await this.productsService.fetchAssetFilePath(
      sessionId,
      productId,
    );

    if (!path) {
      throw new UnauthorizedException(
        'Not authorized to download assets from this checkout session. Please complete your checkout and ensure you are logged into the correct account.',
      );
    }

    const readStream = createReadStream(path);

    return new StreamableFile(readStream);
  }
}
