/* eslint-env node */
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
    },
    build: {
        rollupOptions: {
            output: {
                assetFileNames: 'assets/[name]-[hash][extname]'
            }
        },
        emptyOutDir: true,
        minify: false
    },
    // Конфигурация для SPA роутинга
    preview: {
        port: 5173,
        host: '0.0.0.0',
    }
})
