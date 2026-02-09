import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30000,
    ui: true,
    api: {
      port: 51204,
      host: '0.0.0.0'
    },
    fileParallelism: false,
    isolate: true
  },
});
