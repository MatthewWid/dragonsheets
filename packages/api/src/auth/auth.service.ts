import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oidc from 'openid-client';
import { Configuration } from 'src/config/root.config';

@Injectable()
export class AuthService implements OnModuleInit {
  oidcConfig: oidc.Configuration;
  loginUrl: string;

  constructor(private configService: ConfigService<Configuration, true>) {}

  async onModuleInit() {
    const nodeEnv = this.configService.get<Configuration['env']>('env');

    const webDomain =
      this.configService.get<Configuration['webDomain']>('webDomain');

    const authConfig = this.configService.get<Configuration['auth']>('auth');

    this.oidcConfig = await oidc.discovery(
      new URL(authConfig.oidcConfigUrl),
      authConfig.oidcClientId,
      undefined,
      undefined,
      nodeEnv === 'development'
        ? { execute: [oidc.allowInsecureRequests] }
        : undefined,
    );

    const code_verifier = oidc.randomPKCECodeVerifier();

    const code_challenge = await oidc.calculatePKCECodeChallenge(code_verifier);

    const parameters = new URLSearchParams({
      redirect_uri: `${webDomain}/auth/login-success`,
      scope: 'openid',
      code_challenge,
      code_challenge_method: 'S256',
    });

    if (!this.oidcConfig.serverMetadata().supportsPKCE()) {
      parameters.append('state', oidc.randomState());
    }

    this.loginUrl = oidc
      .buildAuthorizationUrl(this.oidcConfig, parameters)
      .toString();
  }

  getLoginUrl() {
    return this.loginUrl;
  }
}
