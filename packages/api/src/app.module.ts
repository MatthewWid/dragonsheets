import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { getConfiguration } from './config/root.config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [getConfiguration], isGlobal: true }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
