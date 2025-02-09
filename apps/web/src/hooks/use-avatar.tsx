import { useEffect } from 'react';
import { useAvatarStore } from '~/stores';

export const useAvatar = () => {
  const store = useAvatarStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (store.messages[0]) {
      store.setCurrentMessage(store.messages[0]);
    } else {
      store.setCurrentMessage(null);
    }
  }, [store.messages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const startSequence = () => {
      if (!store.currentMessage) {
        return;
      }
      const a = new Audio(store.currentMessage.audio);
      store.setVisemes(store.currentMessage.visemes);
      a.play();
      store.setAudio(a);
      a.onended = () => {
        store.onMessagePlayed();
        store.setVisemes(null);
      };
    };

    startSequence();
  }, [store.currentMessage]);

  return { store };
};

export default useAvatar;
