'use client';

import { ContactShadows, OrbitControls } from '@react-three/drei';
import { Canvas as ThreeCanvas } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import { Environment } from './environment';
import { Avatar } from './models';

export default function Canvas() {
  return (
    <ThreeCanvas shadows camera={{ position: [0, 0, 4], fov: 40 }}>
      <ambientLight intensity={0.7} />
      <spotLight
        intensity={0.5}
        angle={0.1}
        penumbra={1}
        position={[10, 15, -5]}
        castShadow
      />
      <ContactShadows
        resolution={512}
        position={[0, -0.8, 0]}
        opacity={1}
        scale={10}
        blur={2}
        far={0.8}
      />
      <group position={[0, -1, 2.25]}>
        <Avatar />
      </group>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping={false}
        enableRotate={false}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.25}
      />
      <Perf minimal position='top-right' />
      <Environment />
    </ThreeCanvas>
  );
}
