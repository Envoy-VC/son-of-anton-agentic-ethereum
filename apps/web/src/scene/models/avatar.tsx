'use client';

import { useAnimations, useGLTF } from '@react-three/drei';
import type { AvatarModel } from '~/types';

import { type GroupProps, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import {
  facialExpressions,
  headTargets,
  leftEyeTargets,
  phonesToMorphTargets,
  rightEyeTargets,
  teethTargets,
} from '~/data/avatar';

import type { Group } from 'three';

import * as THREE from 'three';
import { useAvatar } from '~/hooks';

export const Avatar = (props: GroupProps) => {
  const { nodes, materials } = useGLTF('/models/avatar.glb') as AvatarModel;
  const { animations } = useGLTF('/models/animations.glb');

  const { store } = useAvatar();

  // biome-ignore lint/style/noNonNullAssertion: safe as we preload
  const avatarRef = useRef<Group>(null!);

  const { actions, mixer } = useAnimations(animations, avatarRef);

  useEffect(() => {
    if (!actions || !avatarRef.current) {
      return;
    }

    mixer.stopAllAction();
    const currentAction = actions[store.animation];

    if (currentAction) {
      currentAction.reset().fadeIn(1).play();
    }

    return () => {
      currentAction?.fadeOut(0.5);
    };
  }, [store.animation, actions, mixer]);

  const lerpMorphTarget = (target: string, value: number, speed = 0.1) => {
    for (const child of Object.values(nodes)) {
      if (
        child instanceof THREE.SkinnedMesh &&
        child.morphTargetDictionary &&
        child.morphTargetInfluences
      ) {
        const index = child.morphTargetDictionary[target];
        if (
          index === undefined ||
          child.morphTargetInfluences[index] === undefined
        ) {
          return;
        }
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );
      }
    }
  };

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
  useFrame(() => {
    if (store.currentMessage && store.audio && store.visemes) {
      const currentAudioTime = store.audio.currentTime;
      for (const mouthCue of store.visemes) {
        if (
          currentAudioTime >= mouthCue.start &&
          currentAudioTime <= mouthCue.end
        ) {
          store.addMorphTarget(mouthCue.value);
          lerpMorphTarget(mouthCue.value, 1, 0.2);
          break;
        }
        store.removeMorphTarget(mouthCue.value);
      }
    }

    for (const value of Object.values(phonesToMorphTargets)) {
      if (store.activeMorphTargets.has(value)) {
        return;
      }
      lerpMorphTarget(value, 0, 0.1);
    }
  });

  useFrame(() => {
    for (const key of Object.keys(
      nodes.EyeLeft.morphTargetDictionary as object
    )) {
      const mapping = facialExpressions[store.facialExpression];
      if (mapping?.[key]) {
        lerpMorphTarget(key, mapping[key], 0.1);
      } else {
        lerpMorphTarget(key, 0, 0.1);
      }
    }

    lerpMorphTarget(
      'eyeBlinkLeft',
      store.blinkNow || store.winkNow === 'left' ? 1 : 0,
      0.5
    );
    lerpMorphTarget(
      'eyeBlinkRight',
      store.blinkNow || store.winkNow === 'right' ? 1 : 0,
      0.5
    );
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(
        () => {
          store.blink(true);
          setTimeout(() => {
            store.blink(false);
            nextBlink();
          }, 300);
        },
        THREE.MathUtils.randInt(2000, 5000)
      );
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

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
useGLTF.preload('/models/animations.glb');
