import {
  type Chain,
  PluginBase,
  Tool,
  type WalletClientBase,
} from '@goat-sdk/core';
// biome-ignore lint/style/useImportType: <explanation>
import { GetWalletAddressParameters, SignMessageParameters } from '~/common';

class WalletHelpersService {
  @Tool({
    description: 'Sign a message',
    name: 'signMessage',
  })
  async signMessage(
    walletClient: WalletClientBase,
    parameters: SignMessageParameters
  ) {
    const signed = await walletClient.signMessage(parameters.message);
    return signed.signature;
  }

  @Tool({
    description: 'Get Wallet Address',
    name: 'getWalletAddress',
  })
  getWalletAddress(
    walletClient: WalletClientBase,
    _parameters: GetWalletAddressParameters
  ) {
    return walletClient.getAddress();
  }
}

export class WalletHelpersPlugin extends PluginBase<WalletClientBase> {
  constructor() {
    super('WalletPlugin', [new WalletHelpersService()]);
  }

  supportsChain = (_chain: Chain) => true;
}

export const walletHelpersPlugin = () => new WalletHelpersPlugin();
