import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/4-4-6-2-pwa-app/' : '/',
  plugins: [react()],
});
