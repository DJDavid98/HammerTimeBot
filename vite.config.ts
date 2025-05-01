import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: './utils/vitest-setup.ts',
    environment: 'jsdom',
    dir: 'src',
    coverage: {
      reporter: ['lcov', 'text'],
    },
    sequence: {
      shuffle: true,
    },
  },
});
