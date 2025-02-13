import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './config/root.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose', 'fatal'],
  });

  const configService = app.get(ConfigService<Configuration, true>);

  const port = configService.get<Configuration['port']>('port');

  await app.listen(port);
}

bootstrap();
