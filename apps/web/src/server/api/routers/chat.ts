import {
  HumanMessage,
  mapChatMessagesToStoredMessages,
} from '@langchain/core/messages';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
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
      const template = `Return a JSON object with a single key named "answer" that answers the following array of messages: {messages}. Do not wrap the JSON output in markdown blocks.`;
      const prompt = ChatPromptTemplate.fromTemplate(template);
      const jsonParser = new JsonOutputParser();
      const chain = prompt.pipe(agent).pipe(jsonParser);

      const res = await agent.invoke(
        {
          messages: [new HumanMessage(message)],
        },
        config
      );

      return {
        messages: mapChatMessagesToStoredMessages(res.messages),
        structuredResponse: res.structuredResponse,
      };
    }),
});
