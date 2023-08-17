import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      rollupTypes: true,
      async afterBuild() {
        // This is to satisfy typechecker here
        // https://arethetypeswrong.github.io/
        // but seems ugly, types should be emitted per build?
        const src = path.resolve(__dirname, 'dist/vue-portable-text.d.ts');
        const mts = path.resolve(__dirname, 'dist/vue-portable-text.d.mts');
        await fs.copyFile(src, mts, () => {});
        const cts = path.resolve(__dirname, 'dist/vue-portable-text.d.cts');
        await fs.copyFile(src, cts, () => {});
      },
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'vue-portable-text',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') {
          return `vue-portable-text.mjs`;
        }
        if (format === 'cjs') {
          return `vue-portable-text.cjs`;
        }
        return `vue-portable-text.${format}.js`;
      },
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  test: {
    environment: 'happy-dom',
  },
});
