import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import history from 'connect-history-api-fallback';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({
    open: true, // отчёт автоматически откроется в браузере
    gzipSize: true,
    brotliSize: true
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    historyApiFallback: true,
  },
  configureServer: ({ middlewares }) => {
    middlewares.use(
      history({
        disableDotRule: true,
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
      })
    );
  }
})
