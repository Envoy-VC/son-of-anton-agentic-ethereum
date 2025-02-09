import { type Options, defineConfig } from 'tsup';

const commonConfig: Options = {
  sourcemap: 'inline',
  splitting: true,
  clean: true,
  treeshake: true,
  format: ['cjs', 'esm'],
  dts: true,
};

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    outDir: 'dist',
    ...commonConfig,
  },
  {
    entry: ['./src/goat/index.ts'],
    outDir: 'dist/goat',
    ...commonConfig,
  },
]);
