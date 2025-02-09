import type * as THREE from 'three';
import type { GLTF } from 'three-stdlib';
import { z } from 'zod';
import { animations } from '~/data/avatar';

export type AvatarModel = GLTF & {
  nodes: {
    EyeLeft: THREE.SkinnedMesh;
    EyeRight: THREE.SkinnedMesh;
    Wolf3D_Head: THREE.SkinnedMesh;
    Wolf3D_Teeth: THREE.SkinnedMesh;
    Wolf3D_Hair: THREE.SkinnedMesh;
    Wolf3D_Body: THREE.SkinnedMesh;
    Wolf3D_Outfit_Bottom: THREE.SkinnedMesh;
    Wolf3D_Outfit_Footwear: THREE.SkinnedMesh;
    Wolf3D_Outfit_Top: THREE.SkinnedMesh;
    Hips: THREE.Bone;
  };
  materials: {
    Wolf3D_Eye: THREE.MeshStandardMaterial;
    Wolf3D_Skin: THREE.MeshStandardMaterial;
    Wolf3D_Teeth: THREE.MeshStandardMaterial;
    Wolf3D_Hair: THREE.MeshStandardMaterial;
    Wolf3D_Body: THREE.MeshStandardMaterial;
    Wolf3D_Outfit_Bottom: THREE.MeshStandardMaterial;
    Wolf3D_Outfit_Footwear: THREE.MeshStandardMaterial;
    Wolf3D_Outfit_Top: THREE.MeshStandardMaterial;
  };
};

export const messageSchema = z.object({
  text: z.string().describe('The text to speak'),
  facialExpression: z.string().describe('The facial expression to use'),
  animation: z
    .string()
    .describe(
      `The animation to play. The available animations are: ${animations.join(', ')}`
    ),
});

export const mouthCueSchema = z.object({
  start: z.number().describe('The start time of the mouth cue'),
  end: z.number().describe('The end time of the mouth cue'),
  value: z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'X']),
});

export type Message = z.infer<typeof messageSchema>;
export type MouthCue = z.infer<typeof mouthCueSchema>;

export type LipSyncData = {
  start: number;
  end: number;
  type: 'visemes';
  value: string;
}[];

export type MessageWithAudio = Message & {
  audio: string;
  visemes: LipSyncData;
};
