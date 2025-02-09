import {} from '@langchain/core/messages';
import type { Hex } from 'viem';
import { z } from 'zod';
import { generateVoiceMessage, getGoatResponse } from '~/lib/ai';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const chatRouter = createTRPCRouter({
  chat: publicProcedure
    .input(
      z.object({
        message: z.string(),
        privateKeyStoreId: z.string(),
        seed: z.string(),
        address: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { message, seed, privateKeyStoreId, address } = input;
      const res = await getGoatResponse(
        {
          seed,
          privateKeyStoreId,
          address: address as Hex,
        },
        message
      );

      return res;
    }),

  voiceChat: publicProcedure
    .input(
      z.object({
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { message } = input;
      const res = await generateVoiceMessage(message);
      return res;
    }),
});
