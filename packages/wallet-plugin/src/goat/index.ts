import { type Chain, PluginBase, Tool } from '@goat-sdk/core';
import type { ViemEVMWalletClient } from '@goat-sdk/wallet-viem';
import { parseEther } from 'viem';
// biome-ignore lint/style/useImportType: <explanation>
import { SendEthereumParameters } from '~/common';

class WalletHelpersService {
  @Tool({
    description: 'Send Ethereum to a address',
    name: 'sendEth',
  })
  async sendEth(
    walletClient: ViemEVMWalletClient,
    parameters: SendEthereumParameters
  ) {
    const parsed = parseEther(parameters.amount.toString());
    const res = await walletClient.sendTransaction({
      to: parameters.to,
      value: parsed,
    });

    return res.hash;
  }
}

export class WalletHelpersPlugin extends PluginBase<ViemEVMWalletClient> {
  constructor() {
    super('WalletPlugin', [new WalletHelpersService()]);
  }

  supportsChain = (_chain: Chain) => true;
}

export const walletHelpersPlugin = () => new WalletHelpersPlugin();
