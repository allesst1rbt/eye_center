import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';


export default defineConfig({
    base: '/',
    plugins: [
        laravel({
            input: [
              'resources/css/app.css',
              'resources/ts/app.tsx'
            ],
            refresh: true,
        }),
        react()
      ],
      server: {
        host: '0.0.0.0',
        hmr: {
            host: 'localhost'
        },
        watch: {
            usePolling: true
        }
      },
});
