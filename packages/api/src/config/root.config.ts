import { RequiredConfigValueError } from './required-config-value.error';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      WEB_DOMAIN?: string;
      STRIPE_SECRET_KEY?: string;
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

export const getConfiguration = () => {
  return {
    port: Number.parseInt(getOptionalValue('PORT', '3000'), 10),
    webDomain: getRequiredValue('WEB_DOMAIN'),
    stripe: {
      secretKey: getRequiredValue('STRIPE_SECRET_KEY'),
    },
  };
};

export type Configuration = ReturnType<typeof getConfiguration>;
