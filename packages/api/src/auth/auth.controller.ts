import {
  Controller,
  Body,
  Post,
  Res,
  Get,
  Req,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PostExchangeDto } from './dto/post-exchange.dto';
import { Request, Response } from 'express';

const CO_KEY_ACCESS_TOKEN = 'access_token';
const CO_KEY_HAS_ACCESS_TOKEN = 'has_access_token';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async postLogin() {
    return this.authService.createLoginUrl();
  }

  @Post('exchange')
  async postExchange(
    @Body() { currentUrl, codeVerifier, state }: PostExchangeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = await this.authService.exchangeCodeForTokens(
      currentUrl,
      codeVerifier,
      state,
    );

    res.cookie(CO_KEY_ACCESS_TOKEN, jwt, { httpOnly: true });
    res.cookie(CO_KEY_HAS_ACCESS_TOKEN, true);
  }

  @Get('me')
  async getMe(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { access_token } = req.cookies;

    if (!access_token) {
      throw new BadRequestException('No authentication token present.');
    }

    try {
      const {
        sub: id,
        name: displayName,
        preferred_username: username,
        email,
      } = this.authService.verifyJwt(access_token);

      return { id, displayName, username, email };
    } catch (error) {
      res.clearCookie(CO_KEY_ACCESS_TOKEN);
      res.clearCookie(CO_KEY_HAS_ACCESS_TOKEN);

      throw new ForbiddenException('Login token could not be verified.');
    }
  }

  @Post('logout-init')
  async postLogoutInit() {
    return this.authService.createLogoutUrl();
  }

  @Post('logout-success')
  async postLogoutSuccess(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(CO_KEY_ACCESS_TOKEN);
    res.clearCookie(CO_KEY_HAS_ACCESS_TOKEN);
  }
}
