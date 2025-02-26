import { constants } from './constants.config';
import { RequiredConfigValueError } from './required-config-value.error';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string;
      PORT?: string;
      WEB_DOMAIN?: string;
      STRIPE_SECRET_KEY?: string;
      PRODUCT_DEFAULT_IMAGE_URL?: string;
      AUTH_OIDC_IDP_URL?: string;
      AUTH_OIDC_CLIENT_ID?: string;
      AUTH_OIDC_CLIENT_SECRET?: string;
    }
  }
}

const getOptionalValue = (key: string, defaultValue: string) =>
  process.env[key] || defaultValue;

const getRequiredValue = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new RequiredConfigValueError(key);
  }

  return value;
};

export const getConfiguration = () => ({
  ...constants,
  env: getOptionalValue('NODE_ENV', 'development') as
    | 'development'
    | 'production',
  port: Number.parseInt(getOptionalValue('PORT', '3000'), 10),
  webDomain: getRequiredValue('WEB_DOMAIN'),
  productDefaultImageUrl: getRequiredValue('PRODUCT_DEFAULT_IMAGE_URL'),
  stripe: {
    secretKey: getRequiredValue('STRIPE_SECRET_KEY'),
  },
  auth: {
    oidcIdpUrl: getRequiredValue('AUTH_OIDC_IDP_URL').replace(/\/$/, ''),
    oidcClientId: getRequiredValue('AUTH_OIDC_CLIENT_ID'),
    oidcClientSecret: getRequiredValue('AUTH_OIDC_CLIENT_SECRET'),
  },
});

export type Configuration = ReturnType<typeof getConfiguration>;
