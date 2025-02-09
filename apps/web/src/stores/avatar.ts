import type { LipSyncData, MessageWithAudio } from '~/types';

import { create } from 'zustand';

export interface AvatarStore {
  activeMorphTargets: Set<string>;
  facialExpression: string;
  blinkNow: boolean;
  winkNow: 'left' | 'right' | false;
  audio: HTMLAudioElement | null;
  visemes: LipSyncData | null;
  messages: MessageWithAudio[];
  currentMessage: MessageWithAudio | null;
  animation: string;
  onMessagePlayed: () => void;
  setMessages: (messages: MessageWithAudio[]) => void;
  setCurrentMessage: (message: MessageWithAudio | null) => void;
  blink: (state: boolean) => void;
  wink: (side: 'left' | 'right' | false) => void;
  addMorphTarget: (name: string) => void;
  removeMorphTarget: (name: string) => void;
  setFacialExpression: (name: string) => void;
  setAudio: (audio: HTMLAudioElement) => void;
  setVisemes: (visemes: LipSyncData | null) => void;
  setAnimation: (animation: string) => void;
}

export const useAvatarStore = create<AvatarStore>((set, get) => ({
  visemes: null,
  facialExpression: 'smile',
  animation: 'standing-animation',
  messages: [],
  currentMessage: null,
  setUpMode: false,
  blinkNow: false,
  winkNow: false,
  activeMorphTargets: new Set(),
  audio: null,
  blink: (newState) => set({ blinkNow: newState }),
  wink: (side) => set({ winkNow: side }),
  addMorphTarget: (name) => {
    set((state) => {
      state.activeMorphTargets.add(name);
      return { activeMorphTargets: new Set(state.activeMorphTargets) };
    });
  },
  removeMorphTarget: (name) => {
    set((state) => {
      state.activeMorphTargets.delete(name);
      return { activeMorphTargets: new Set(state.activeMorphTargets) };
    });
  },
  setAudio: (audio) => set({ audio }),
  setFacialExpression: (expression) => set({ facialExpression: expression }),
  setVisemes: (visemes) => set({ visemes }),
  onMessagePlayed: () => {
    const newMessages = get().messages.slice(1);
    set({ messages: newMessages });
  },
  setMessages: (messages) => set({ messages }),
  setCurrentMessage: (currentMessage) => set({ currentMessage }),
  setAnimation: (animation) => set({ animation }),
}));
