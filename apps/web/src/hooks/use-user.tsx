import { useLocalStorage } from 'usehooks-ts';
import type { Hex } from 'viem';

interface NillionKey {
  alias?: string;
  storeId: string;
  publicKey: Hex;
  seed: string;
}

export const useUser = () => {
  const [key, setKey] = useLocalStorage<NillionKey | null>(
    'nillion-keys',
    null
  );

  const getUserKey = () => {
    if (!key) {
      throw new Error('Key not found');
    }
    return key;
  };

  const storeUserKey = (_key: NillionKey) => {
    setKey(_key);
    return _key;
  };

  return { getUserKey, storeUserKey };
};
