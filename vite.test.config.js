import { frontAwesome } from '@artisan-toolbox/front-awesome/vite';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { configDefaults, defineConfig } from 'vite-plus';

export default defineConfig({
    plugins: [
        frontAwesome({ webAwesome: 'core' }),
        vue({
            template: {
                transformAssetUrls: { base: null, includeAbsolute: false },
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
        },
    },
    test: {
        env: {
            VITE_REVERB_APP_KEY: '',
            VITE_REVERB_HOST: '',
        },
        setupFiles: ['resources/js/testSetup.js'],
        environment: 'happy-dom',
        include: ['resources/js/**/*.test.js', 'scripts/**/*.test.mjs'],
        exclude: [...configDefaults.exclude, '**/*.workspace.test.mjs'],
    },
});
