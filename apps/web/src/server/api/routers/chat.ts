import {
  HumanMessage,
  mapChatMessagesToStoredMessages,
} from '@langchain/core/messages';
import { z } from 'zod';
import { initializeAgent } from '~/lib/agentkit';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const chatRouter = createTRPCRouter({
  chat: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const { agent, config } = await initializeAgent();
      const res = await agent.invoke(
        {
          messages: [new HumanMessage(input.text)],
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
