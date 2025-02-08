'use client';

import { useAnimations, useGLTF } from '@react-three/drei';
import type { AvatarModel } from '~/types';

import type { GroupProps } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import {
  headTargets,
  leftEyeTargets,
  rightEyeTargets,
  teethTargets,
} from '~/data/avatar';

import type { Group } from 'three';

export const Avatar = (props: GroupProps) => {
  const { nodes, materials } = useGLTF('/models/avatar.glb') as AvatarModel;
  const { animations } = useGLTF('/models/animations.glb');

  // biome-ignore lint/style/noNonNullAssertion: safe as we preload
  const avatarRef = useRef<Group>(null!);

  const { actions, mixer } = useAnimations(animations, avatarRef);

  useEffect(() => {
    if (actions && avatarRef.current) {
      console.log(actions);
      actions.idle?.reset().fadeIn(1).play();
    }

    return () => actions.idle?.fadeOut(0.5);
  }, [actions]);

  return (
    <group {...props} dispose={null} ref={avatarRef}>
      <group name='Scene'>
        <group name='Armature' userData={{ name: 'Armature' }}>
          <primitive object={nodes.Hips} />
          <skinnedMesh
            name='EyeLeft'
            geometry={nodes.EyeLeft.geometry}
            material={materials.Wolf3D_Eye}
            skeleton={nodes.EyeLeft.skeleton}
            morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
            morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
            userData={{
              targetNames: leftEyeTargets,
              name: 'EyeLeft',
            }}
          />
          <skinnedMesh
            name='EyeRight'
            geometry={nodes.EyeRight.geometry}
            material={materials.Wolf3D_Eye}
            skeleton={nodes.EyeRight.skeleton}
            morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
            morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
            userData={{
              targetNames: rightEyeTargets,
              name: 'EyeRight',
            }}
          />
          <skinnedMesh
            name='Wolf3D_Head'
            geometry={nodes.Wolf3D_Head.geometry}
            material={materials.Wolf3D_Skin}
            skeleton={nodes.Wolf3D_Head.skeleton}
            morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
            morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
            userData={{
              targetNames: headTargets,
              name: 'Wolf3D_Head',
            }}
          />
          <skinnedMesh
            name='Wolf3D_Teeth'
            geometry={nodes.Wolf3D_Teeth.geometry}
            material={materials.Wolf3D_Teeth}
            skeleton={nodes.Wolf3D_Teeth.skeleton}
            morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
            morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
            userData={{
              targetNames: teethTargets,
              name: 'Wolf3D_Teeth',
            }}
          />
          <skinnedMesh
            name='Wolf3D_Hair'
            geometry={nodes.Wolf3D_Hair.geometry}
            material={materials.Wolf3D_Hair}
            skeleton={nodes.Wolf3D_Hair.skeleton}
            userData={{ name: 'Wolf3D_Hair' }}
          />
          <skinnedMesh
            name='Wolf3D_Body'
            geometry={nodes.Wolf3D_Body.geometry}
            material={materials.Wolf3D_Body}
            skeleton={nodes.Wolf3D_Body.skeleton}
            userData={{ name: 'Wolf3D_Body' }}
          />
          <skinnedMesh
            name='Wolf3D_Outfit_Bottom'
            geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
            material={materials.Wolf3D_Outfit_Bottom}
            skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
            userData={{ name: 'Wolf3D_Outfit_Bottom' }}
          />
          <skinnedMesh
            name='Wolf3D_Outfit_Footwear'
            geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
            material={materials.Wolf3D_Outfit_Footwear}
            skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
            userData={{ name: 'Wolf3D_Outfit_Footwear' }}
          />
          <skinnedMesh
            name='Wolf3D_Outfit_Top'
            geometry={nodes.Wolf3D_Outfit_Top.geometry}
            material={materials.Wolf3D_Outfit_Top}
            skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
            userData={{ name: 'Wolf3D_Outfit_Top' }}
          />
        </group>
      </group>
    </group>
  );
};

useGLTF.preload('/models/avatar.glb');
