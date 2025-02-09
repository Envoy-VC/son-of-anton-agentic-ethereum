import { createToolParameters } from '@goat-sdk/core';

import { z } from 'zod';

export class SignMessageParameters extends createToolParameters(
  z.object({
    message: z.string(),
  })
) {}

export class NoParams extends createToolParameters(z.object({})) {}

export class SendEthereumParameters extends createToolParameters(
  z.object({
    to: z.string(),
    amount: z.number(),
  })
) {}
