import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oidc from 'openid-client';
import { verify, JwtPayload } from 'jsonwebtoken';
import { Configuration } from 'src/config/root.config';

@Injectable()
export class AuthService implements OnModuleInit {
  private oidcConfig: oidc.Configuration;
  private idpPublicCert: string;

  constructor(private configService: ConfigService<Configuration, true>) {}

  async onModuleInit() {
    const nodeEnv = this.configService.get<Configuration['env']>('env');

    const authConfig = this.configService.get<Configuration['auth']>('auth');

    this.oidcConfig = await oidc.discovery(
      new URL(`${authConfig.oidcIdpUrl}/.well-known/openid-configuration`),
      authConfig.oidcClientId,
      authConfig.oidcClientSecret,
      undefined,
      nodeEnv === 'development'
        ? { execute: [oidc.allowInsecureRequests] }
        : undefined,
    );

    if (!this.oidcConfig.serverMetadata().jwks_uri) {
      throw new Error(
        'No JSON Web Key Set URI found. Cannot fetch public key certificate.',
      );
    }

    const jwksResponse = await fetch(
      this.oidcConfig.serverMetadata().jwks_uri as string,
    );

    const jwksJson = (await jwksResponse.json()) as {
      keys: { alg: string; x5c: string[] }[];
    };

    const rsa256Jwks = jwksJson.keys?.find(({ alg }) => alg === 'RS256');

    if (!rsa256Jwks) {
      throw new Error('Could not find RSA256 JWKS.');
    }

    const rsa256Key = rsa256Jwks?.x5c[0];

    if (!rsa256Key) {
      throw new Error(
        'Could not find corresponding certificate for RSA256 JWKS.',
      );
    }

    this.idpPublicCert = `-----BEGIN CERTIFICATE-----\n${rsa256Key}\n-----END CERTIFICATE-----\n`;
  }

  async createLoginUrl() {
    const webDomain =
      this.configService.get<Configuration['webDomain']>('webDomain');

    const code_verifier = oidc.randomPKCECodeVerifier();

    const code_challenge = await oidc.calculatePKCECodeChallenge(code_verifier);

    const state = oidc.randomState();

    const parameters = new URLSearchParams({
      redirect_uri: `${webDomain}/auth/login-success`,
      scope: 'openid',
      code_challenge,
      code_challenge_method: 'S256',
      state,
    });

    return {
      loginUrl: oidc
        .buildAuthorizationUrl(this.oidcConfig, parameters)
        .toString(),
      codeVerifier: code_verifier,
      state,
    };
  }

  async exchangeCodeForTokens(
    currentUrl: string,
    codeVerifier: string,
    expectedState: string,
  ) {
    const exchangeResponse = await oidc.authorizationCodeGrant(
      this.oidcConfig,
      new URL(currentUrl),
      {
        pkceCodeVerifier: codeVerifier,
        expectedState,
      },
    );

    // Store access and refresh tokens associated with user ID (JWT->sub)

    return exchangeResponse.id_token as string;
  }

  verifyJwt(jwt: string) {
    return verify(jwt, this.idpPublicCert, {
      algorithms: ['RS256'],
    }) as JwtPayload & {
      name: string;
      preferred_username: string;
      email: string;
    };
  }

  createLogoutUrl() {
    const webDomain =
      this.configService.get<Configuration['webDomain']>('webDomain');

    const parameters = new URLSearchParams({
      post_logout_redirect_uri: `${webDomain}/auth/logout-success`,
      state: oidc.randomState(),
    });

    return oidc.buildEndSessionUrl(this.oidcConfig, parameters).toString();
  }
}
