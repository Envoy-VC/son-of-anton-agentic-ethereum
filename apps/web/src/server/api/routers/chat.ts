import {
  HumanMessage,
  mapChatMessagesToStoredMessages,
} from '@langchain/core/messages';
import type { Hex } from 'viem';
import { z } from 'zod';
import { initializeAgent } from '~/lib/agentkit';
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
      const { agent, config } = await initializeAgent({
        seed,
        privateKeyStoreId,
        address: address as Hex,
      });
      const res = await agent.invoke(
        {
          messages: [new HumanMessage(message)],
        },
        config
      );
      const serialized = mapChatMessagesToStoredMessages(res.messages);
      return {
        messages: serialized,
        structuredResponse: res.structuredResponse,
      };
    }),
});
