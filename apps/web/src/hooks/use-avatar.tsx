import { useAvatarStore } from '~/stores';
import type { MessageWithAudio } from '~/types';

export const useAvatar = () => {
  const store = useAvatarStore();

  const startSequence = async (message: MessageWithAudio): Promise<void> => {
    return new Promise((resolve) => {
      const a = new Audio(message.audio);
      store.setFacialExpression(message.facialExpression);
      store.setVisemes(message.visemes);
      store.setAnimation(message.animation);

      a.play();
      store.setAudio(a);

      a.onended = () => {
        store.onMessagePlayed();
        store.setFacialExpression('default');
        store.setVisemes(null);
        store.setAnimation('standing-animation');
        resolve();
      };
    });
  };

  return { store, startSequence };
};

export default useAvatar;
