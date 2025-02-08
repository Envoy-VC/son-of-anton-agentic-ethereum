'use server';

import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import {
  phonesToMorphTargets,
  pollyVisemesToMorphTargets,
} from '~/data/avatar';
import { env } from '~/env';
import type { LipSyncData } from '~/types';

const client = new PollyClient({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
  },
});

export const generateVisemes = async (text: string) => {
  if (env.NODE_ENV === 'development') {
    const res = await fetch('http://localhost:8080/api/generate-visemes', {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = (await res.json()) as {
      audio: string;
      visemes: {
        mouthCues: {
          value: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'X';
          start: number;
          end: number;
        }[];
      };
    };

    const lipSyncData = data.visemes.mouthCues.map((mouthCue) => ({
      start: mouthCue.start,
      end: mouthCue.end,
      type: 'visemes',
      value: phonesToMorphTargets[mouthCue.value],
    }));

    return {
      audio: data.audio,
      visemes: lipSyncData as LipSyncData,
    };
  }
  return await synthesizeSpeechWithPolly(text);
};

async function synthesizeSpeechWithPolly(text: string) {
  const audioCommand = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: 'Matthew',
    TextType: 'text',
  });
  const visemeCommand = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: 'json',
    VoiceId: 'Matthew',
    TextType: 'text',
    SpeechMarkTypes: ['viseme'],
  });
  const data = await client.send(audioCommand);
  const visemeData = await client.send(visemeCommand);

  if (!data.AudioStream || !visemeData.AudioStream) {
    throw new Error('No audio stream found');
  }

  const buff = await data.AudioStream.transformToByteArray();
  const audio = `data:audio/mp3;base64,${Buffer.from(buff).toString('base64')}`;

  const str = await visemeData.AudioStream.transformToString();
  const json = JSON.parse(`[${str}]`.replaceAll('}\n{', '},\n{')) as {
    time: number;
    type: 'visemes';
    value: string;
  }[];

  const lipSyncData = json.map((mouthCue, index) => ({
    start: (json[index - 1]?.time ?? 0) / 1000,
    end: mouthCue.time / 1000,
    value:
      pollyVisemesToMorphTargets[
        mouthCue.value as keyof typeof pollyVisemesToMorphTargets
      ],
  }));
  console.log({
    text,
    audio,
    lipSyncData,
  });
  return {
    audio,
    visemes: lipSyncData as LipSyncData,
  };
}
