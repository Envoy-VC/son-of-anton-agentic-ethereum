import {
  AgentKit,
  ViemWalletProvider,
  cdpApiActionProvider,
  walletActionProvider,
} from '@coinbase/agentkit';

import { getLangChainTools } from '@coinbase/agentkit-langchain';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatOllama } from '@langchain/ollama';

import { http, type Hex, createWalletClient } from 'viem';

import { baseSepolia } from 'viem/chains';
import { env } from '~/env';

import { createSignerFromKey } from '@nillion/client-vms';
import { nillionAccount } from 'nillion-viem-client';

interface InitializeAgentProps {
  seed: string;
  address: Hex;
  privateKeyStoreId: string;
}

export const initializeAgent = async (props: InitializeAgentProps) => {
  const isDev = env.NODE_ENV === 'development';
  let llm: ChatMistralAI | ChatOllama;
  if (isDev) {
    llm = new ChatOllama({
      model: 'llama3.1:latest',
    });
  } else {
    llm = new ChatMistralAI({
      model: 'mistral-large-latest',
      apiKey: env.MISTRAL_API_KEY,
    });
  }

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

  const agentkit = await AgentKit.from({
    walletProvider,
    actionProviders: [
      walletActionProvider(),
      cdpApiActionProvider({
        apiKeyName: env.CDP_API_KEY_NAME,
        apiKeyPrivateKey: env.CDP_API_KEY_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    ],
  });

  const tools = await getLangChainTools(agentkit);
  const memory = new MemorySaver();
  const agentConfig = {
    configurable: { thread_id: 'CDP AgentKit Chatbot Example!' },
  };

  // Create React Agent using the LLM and CDP AgentKit tools
  const agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: `
        You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
        empowered to interact onchain using your tools. If you ever need funds, you can request them from the 
        faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request 
        funds from the user. Before executing your first action, get the wallet details to see what network 
        you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
        asks you to do something you can't do with your currently available tools, you must say so, and 
        encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to 
        docs.cdp.coinbase.com for more information. Be concise and helpful with your responses. Refrain from 
        restating your tools' descriptions unless it is explicitly requested.
        `,
  });

  return { agent, config: agentConfig };
};
