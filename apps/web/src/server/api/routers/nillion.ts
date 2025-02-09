import { z } from 'zod';

import { NillionECDSA } from '@anton-stack/nillion-viem-account';
import { createSignerFromKey } from '@nillion/client-vms';
import { secp256k1 } from '@noble/curves/secp256k1';
import { type SignableMessage, toHex } from 'viem';

const Hex = z.string().regex(/^0x[a-fA-F0-9]+$/, 'Invalid hex format');

const SignableMessageSchema = z.union([
  z.string(),
  z.object({
    raw: z.union([Hex, z.instanceof(Uint8Array)]),
  }),
]);

import { privateKeyToAccount } from 'viem/accounts';
import { env } from '~/env';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const nillionRouter = createTRPCRouter({
  createPrivateKey: publicProcedure
    .input(z.object({ alias: z.string().optional(), seed: z.string() }))
    .mutation(async ({ input }) => {
      const { seed } = input;
      const signer = await createSignerFromKey(env.NILLION_PK);
      const ecdsa = new NillionECDSA({
        chainUrl: env.NILLION_CHAIN_ID,
        bootnodeUrl: env.NILLION_BOOTNODE_URL,
        seed,
        signer,
      });

      const privateKey: Uint8Array = secp256k1.utils.randomPrivateKey();
      const publicKey: Uint8Array = secp256k1.getPublicKey(privateKey);
      const address = privateKeyToAccount(toHex(privateKey)).address;
      const storeId = await ecdsa.storePrivateKey({ privateKey });
      return {
        storeId,
        publicKey: toHex(publicKey),
        privateKey: toHex(privateKey),
        address,
      };
    }),
  signMessage: publicProcedure
    .input(
      z.object({
        message: SignableMessageSchema,
        privateKeyStoreId: z.string(),
        seed: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { message, privateKeyStoreId, seed } = input;
      const signer = await createSignerFromKey(env.NILLION_PK);
      const ecdsa = new NillionECDSA({
        chainUrl: env.NILLION_CHAIN_ID,
        bootnodeUrl: env.NILLION_BOOTNODE_URL,
        seed,
        signer,
      });

      await ecdsa.initialize();
      const signature = await ecdsa.signMessage({
        privateKeyStoreId,
        message: message as SignableMessage,
      });
      return { signature };
    }),
});
