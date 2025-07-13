import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import tsConfigPaths from 'vite-tsconfig-paths';

// ❌ ปิด vite-plugin-electron ระหว่าง dev เพื่อไม่ให้เปิดซ้ำ
export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths(),
    // ❗ Uncomment when building for production only:
    // electron({
    //   main: {
    //     entry: 'electron/main.ts',
    //   },
    //   preload: {
    //     input: path.join(__dirname, 'electron/preload.ts'),
    //   },
    // }),
  ],
});
