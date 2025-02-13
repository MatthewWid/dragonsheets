import { AppModule } from './app.module';
import { Configuration } from './config/root.config';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose', 'fatal'],
  });

  const configService = app.get(ConfigService<Configuration, true>);

  const port = configService.get<Configuration['port']>('port');

  await app.listen(port);
}

bootstrap();
