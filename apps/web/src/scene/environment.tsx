'use client';

import { Environment as ThreeEnvironment } from '@react-three/drei';

export const Environment = () => {
  return <ThreeEnvironment preset='forest' background blur={1} />;
};
