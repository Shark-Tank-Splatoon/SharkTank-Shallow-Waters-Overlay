import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

const dashboardDir = resolve(process.cwd(), 'dashboard');

export default defineConfig({
    root: dashboardDir,
    base: './',
    plugins: [vue()],
    build: {
        outDir: resolve(dashboardDir, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: resolve(dashboardDir, 'sharktankdashboard.html')
        }
    }
});