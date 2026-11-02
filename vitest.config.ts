import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // Cold imports of the large reviewed catalogs can exceed Vitest's 5s
    // default under full-suite concurrency; application timeouts are unchanged.
    testTimeout: 15_000,
    // Source-validation suites repeatedly hash large committed evidence files
    // and spawn Python validators. Avoid overlapping those disk/CPU-heavy jobs.
    maxWorkers: 1,
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
});
