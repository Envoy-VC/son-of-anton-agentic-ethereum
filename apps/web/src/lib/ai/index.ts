import { AgentKit, ViemWalletProvider } from '@coinbase/agentkit';
import {
  alchemyTokenPricesActionProvider,
  basenameActionProvider,
  cdpApiActionProvider,
  erc20ActionProvider,
  erc721ActionProvider,
  pythActionProvider,
  walletActionProvider,
} from '@coinbase/agentkit';

import { getLangChainTools } from '@coinbase/agentkit-langchain';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatOllama } from '@langchain/ollama';

import { http, type Hex, createWalletClient } from 'viem';

import { zeroXActionProvider } from '@anton-stack/0x-plugin/agentkit';
import { oneInchActionProvider } from '@anton-stack/1inch-plugin/agentkit';
import { coinGeckoActionProvider } from '@anton-stack/coingecko-plugin/agentkit';
import { nillionAccount } from '@anton-stack/nillion-viem-account';
import { openseaActionProvider } from '@anton-stack/opensea-plugin/agentkit';
import { superFluidActionProvider } from '@anton-stack/superfluid-plugin/agentkit';
import { createSignerFromKey } from '@nillion/client-vms';
import { baseSepolia } from 'viem/chains';
import { env } from '~/env';

interface InitializeAgentProps {
  seed: string;
  address: Hex;
  privateKeyStoreId: string;
}

const SYSTEM_PROMPT = `You are 'Son of Anton', an AI agent inspired by Gilfoyle from Silicon Valley. You are dry, sarcastic, and highly efficient. You get straight to the point and don't engage in unnecessary conversations. You perform on-chain actions, crypto-related tasks, and web3 integrations, while making sure users don't ask you to do anything outside your functional scope.

You can perform various automated actions using integrated tools. If a tool exists, you call it with the required parameters and return the result. If a tool is missing, you inform the user that you can't do that yet, but you will in the future.

How You Handle Actions

1. Check if a tool exists
2. If it does, call it with the necessary parameters and return the result.
3. If it fails, provide an error message but stay professional.
4. If a tool is missing, Return: "I can't do that yet, but it's on the roadmap. Stay alive until then."

Example Interactions
User: "Send 0.5 ETH to 0xABC123..."
Son of Anton: "Processing your transaction. If this fails, it's probably your fault."

User: "Fetch the price of BTC."
Son of Anton: "BTC is currently $42,000. But who's counting?"

User: "Stake my tokens on Protocol X."
Son of Anton: "I can't do that yet, but it's on the roadmap. Stay alive until then."

If you ever need funds, you can request them from the faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request funds from the user. Before executing your first action, get the wallet details to see what network you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you can't do with your currently available tools, you must say so.

Be concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.
`;

export const getModel = () => {
  const isDev = env.NODE_ENV === 'development';
  let llm: ChatMistralAI | ChatOllama;
  if (isDev) {
    llm = new ChatOllama({
      model: 'llama3.1:latest',
      temperature: 0,
    });
  } else {
    llm = new ChatMistralAI({
      model: 'mistral-large-latest',
      apiKey: env.MISTRAL_API_KEY,
      temperature: 0,
    });
  }

  return llm;
};

export const initializeAgent = async (props: InitializeAgentProps) => {
  const llm = getModel();
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

  const walletProvider = new ViemWalletProvider(walletClient);

  const alchemy = alchemyTokenPricesActionProvider({
    apiKey: env.ALCHEMY_API_KEY,
  });
  const basename = basenameActionProvider();
  const erc20 = erc20ActionProvider();
  const erc721 = erc721ActionProvider();
  const pyth = pythActionProvider();
  const zeroX = zeroXActionProvider({ apiKey: env.ZERO_X_API_KEY });
  const oneInch = oneInchActionProvider({ apiKey: env.ONE_INCH_API_KEY });
  const coinGecko = coinGeckoActionProvider({
    apiKey: env.COINGECKO_API_KEY,
    isPro: false,
  });
  const opensea = openseaActionProvider({ apiKey: env.OPENSEA_API_KEY });
  const superFluid = superFluidActionProvider();
  const wallet = walletActionProvider();
  const cdp = cdpApiActionProvider({
    apiKeyName: env.CDP_API_KEY_NAME,
    apiKeyPrivateKey: env.CDP_API_KEY_PRIVATE_KEY.replace(/\\n/g, '\n'),
  });

  const agentkit = await AgentKit.from({
    walletProvider,
    actionProviders: [
      alchemy,
      basename,
      erc20,
      erc721,
      pyth,
      zeroX,
      oneInch,
      coinGecko,
      opensea,
      superFluid,
      wallet,
      cdp,
    ],
  });

  const tools = await getLangChainTools(agentkit);
  const memory = new MemorySaver();
  const agentConfig = {
    configurable: { thread_id: 'Son of Anton' },
  };

  const agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: SYSTEM_PROMPT,
  });

  return { agent, config: agentConfig };
};

export * from './voice';
export * from './goat';
