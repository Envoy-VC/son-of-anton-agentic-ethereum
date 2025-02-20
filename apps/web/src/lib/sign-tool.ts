import {} from '@goat-sdk/core';
import { createToolParameters } from '@goat-sdk/core';
import { z } from 'zod';

export class SignMessageParameters extends createToolParameters(
  z.object({
    message: z.string(),
  })
) {}
