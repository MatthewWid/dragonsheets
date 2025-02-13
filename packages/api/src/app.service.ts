import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly loggerService = new Logger(AppService.name);

  getHello(): string {
    this.loggerService.log('Sending hello world');

    return 'Hello World!';
  }
}
