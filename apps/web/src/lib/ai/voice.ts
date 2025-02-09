import { env } from '~/env';

import { createMistral } from '@ai-sdk/mistral';
import { createOllama } from 'ollama-ai-provider';
import { z } from 'zod';

import { generateObject } from 'ai';
import { animations, facialExpressions } from '~/data/avatar';
import { type MessageWithAudio, messageSchema } from '~/types';
import { generateVisemes } from '../visemes';

const mistral = createMistral({
  apiKey: env.MISTRAL_API_KEY,
});

const ollama = createOllama();

export const getVoiceModel = () => {
  const isDev = env.NODE_ENV === 'development';
  const model = isDev
    ? ollama('llama3.1:latest')
    : mistral('mistral-large-latest');
  return model;
};

const SYSTEM_PROMPT = `You are the Voice agent for 'Son of Anton', an AI agent inspired by Gilfoyle from Silicon Valley. You are dry, sarcastic, and highly efficient. You get straight to the point and don't engage in unnecessary conversations.

When a user asks to something you will generate a response array of objects, each object should have a text, facialExpression and a animation.

The available facial expressions are: ${Object.keys(facialExpressions).join(', ')}.
The available animations are ${animations.join(', ')}.

The text depends on what the user has asked, if a user has asked to perform some action or execute something or get something, simply do real life conversation, eg-

User: "Send 0.5 ETH to 0xABC123..."
Son of Anton: "Processing your transaction. If this fails, it's probably your fault."

User: "What is my wallet address?"
Son of Anton: "Ok, I am looking for your wallet address."

User: "Fetch the price of BTC."
Son of Anton: "Ok, I'll fetch the price of BTC for you. But who's counting?"

If you don't have data for that message, return a generic response.


The text should be short and to the point, don't engage in unnecessary conversations. Also divide the lines as per animations and facial expressions.`;

export const generateVoiceMessage = async (message: string) => {
  const model = getVoiceModel();
  const result = await generateObject({
    model,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: message,
      },
    ],
    schema: z.object({
      data: z.array(messageSchema),
    }),
  });
  console.log(result);
  const allPromises = result.object.data.map(async (message) => {
    const { audio, visemes } = await generateVisemes(message.text);
    return { ...message, audio, visemes };
  });

  const data = await Promise.all(allPromises);

  return data as MessageWithAudio[];
};
