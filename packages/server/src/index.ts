import { readFileSync } from 'node:fs';
import { serve } from '@hono/node-server';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import say from 'say';

import { callWithRetry, execCommand } from './helpers';
import { generateVisemesSchema } from './schema';

const app = new Hono();
app.use('/api/*', cors());

app.post(
  '/api/generate-visemes',
  zValidator('json', generateVisemesSchema),
  async (c) => {
    const data = c.req.valid('json');
    const id = crypto.randomUUID();
    const file = `./out/${id}.wav`;
    say.export(data.text, 'Jamie (Premium)', 1.05, file);

    let audioData = await callWithRetry(
      () => readFileSync(file, { encoding: 'base64' }),
      100
    );

    audioData = `data:audio/wav;base64,${audioData}`;

    const res = await execCommand(
      `./bin/rhubarb/rhubarb -f json ${file} -r phonetic`
    );

    await execCommand(`rm -rf ${file}`);
    return c.json({
      visemes: JSON.parse(res) as object,
      audio: audioData,
    });
  }
);

const port = 8080;
console.log(`Server is running on http://localhost:${String(port)}`);

serve({
  fetch: app.fetch,
  port,
});
