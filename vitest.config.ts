import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // lets you use "describe", "it", "expect" without imports
    environment: 'node',
    setupFiles: [],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
