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

    res.cookie('access_token', jwt, { httpOnly: true });
    res.cookie('has_access_token', true);
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
      res.clearCookie('access_token');
      res.clearCookie('has_access_token');

      throw new ForbiddenException('Login token could not be verified.');
    }
  }

  @Post('logout')
  async postLogout() {
    return this.authService.createLogoutUrl();
  }
}
