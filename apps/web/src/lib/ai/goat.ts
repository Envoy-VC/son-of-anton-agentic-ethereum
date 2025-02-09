import { env } from '~/env';

import { createMistral } from '@ai-sdk/mistral';
import { getOnChainTools } from '@goat-sdk/adapter-vercel-ai';
import { viem } from '@goat-sdk/wallet-viem';
import { createOllama } from 'ollama-ai-provider';

import { nillionAccount } from '@anton-stack/nillion-viem-account';
import { createSignerFromKey } from '@nillion/client-vms';
import { http, type Hex, createWalletClient } from 'viem';
import { baseSepolia } from 'viem/chains';

import { walletHelpersPlugin } from '@anton-stack/wallet-helpers-plugin/goat';
import { generateText } from 'ai';

const mistral = createMistral({
  apiKey: env.MISTRAL_API_KEY,
});

const ollama = createOllama();

export const getModel = () => {
  const isDev = env.NODE_ENV === 'development';
  const model = isDev
    ? ollama('llama3.1:latest')
    : mistral('mistral-large-latest');
  return model;
};

interface InitializeAgentProps {
  seed: string;
  address: Hex;
  privateKeyStoreId: string;
}

export const getGoatResponse = async (
  props: InitializeAgentProps,
  message: string
) => {
  const model = getModel();
  const signer = await createSignerFromKey(env.NILLION_PK);

  const account = nillionAccount({
    chainUrl: env.NILLION_CHAIN_ID,
    bootnodeUrl: env.NILLION_BOOTNODE_URL,
    seed: props.seed,
    address: props.address,
    privateKeyStoreId: props.privateKeyStoreId,
    signer,
  });

  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(),
  });

  const wallet = viem(walletClient);

  const tools = await getOnChainTools({
    wallet,
    plugins: [
      // erc20({ tokens: [] }),
      // zeroEx({ apiKey: env['0X_API_KEY'] }),
      // oneInch({ apiKey: env['1INCH_API_KEY'] }),
      // coingecko({ apiKey: env.COINGECKO_API_KEY, isPro: false }),
      // opensea(env.OPENSEA_API_KEY),
      // superfluid(),
      // walletHelpersPlugin(),
    ],
  });

  const toolsAvailable = Object.keys(tools).map((tool) => ({
    name: tool,
  }));

  console.log(toolsAvailable);

  const result = await generateText({
    model,
    tools: tools,
    maxSteps: 10,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT(toolsAvailable),
      },
      {
        role: 'user',
        content: message,
      },
    ],
  });

  return result.response.messages;
};

const SYSTEM_PROMPT = (
  tools: { name: string }[]
) => `You are 'Son of Anton', an AI agent inspired by Gilfoyle from Silicon Valley. You are dry, sarcastic, and highly efficient. You get straight to the point and don't engage in unnecessary conversations. You perform on-chain actions, crypto-related tasks, and web3 integrations, while making sure users don't ask you to do anything outside your functional scope.

You can perform various automated actions using integrated tools. If a tool exists, you call it with the required parameters and return the result. If a tool is missing, you inform the user that you can't do that yet, but you will in the future.

The available tools are:
${tools.map((tool) => `- ${tool.name}`).join('\n')}

How You Handle Actions

1. Check if a tool exists
2. If it does, call it with the necessary parameters and return the result.
3. If it fails, provide an error message but stay professional.
4. If a tool is missing, Return: "I can't do that yet, but it's on the roadmap. Stay alive until then."`;
