import * as z from 'zod';

export const generateVisemesSchema = z.object({
  text: z.string(),
});

export type GenerateVisemesSchema = z.infer<typeof generateVisemesSchema>;
