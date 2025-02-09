import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    CDP_API_KEY_NAME: z.string(),
    CDP_API_KEY_PRIVATE_KEY: z.string(),
    PRIVATE_KEY: z.string(),
    MISTRAL_API_KEY: z.string(),
    NILLION_CHAIN_ID: z.string(),
    NILLION_BOOTNODE_URL: z.string(),
    NILLION_PK: z.string(),
    NILLION_SEED: z.string(),
    AWS_ACCESS_KEY: z.string(),
    AWS_SECRET_KEY: z.string(),
    '0X_API_KEY': z.string(),
    COINGECKO_API_KEY: z.string(),
    '1INCH_API_KEY': z.string(),
    OPENSEA_API_KEY: z.string(),
    ALCHEMY_API_KEY: z.string(),
  },
  client: {},
  experimental__runtimeEnv: {},
  // eslint-disable-next-line no-undef -- we know that process is defined
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
  emptyStringAsUndefined: true,
});
