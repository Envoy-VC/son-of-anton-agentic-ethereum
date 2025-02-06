'use client';

import {
  Bloom,
  EffectComposer,
  N8AO,
  ToneMapping,
} from '@react-three/postprocessing';

export const Effects = () => {
  return (
    <EffectComposer>
      <N8AO aoRadius={0.15} intensity={4} distanceFalloff={2} />
      <Bloom luminanceThreshold={3.5} intensity={0.85} levels={9} mipmapBlur />
      <ToneMapping />
    </EffectComposer>
  );
};
