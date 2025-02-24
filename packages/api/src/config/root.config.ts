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
      AUTH_OIDC_CONFIG_URL?: string;
      AUTH_OIDC_CLIENT_ID?: string;
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
  stripe: {
    secretKey: getRequiredValue('STRIPE_SECRET_KEY'),
  },
  productDefaultImageUrl: getRequiredValue('PRODUCT_DEFAULT_IMAGE_URL'),
  auth: {
    oidcConfigUrl: getRequiredValue('AUTH_OIDC_CONFIG_URL'),
    oidcClientId: getRequiredValue('AUTH_OIDC_CLIENT_ID'),
  },
});

export type Configuration = ReturnType<typeof getConfiguration>;
