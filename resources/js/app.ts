import '../css/app.css';
import '@artisan-toolbox/front-awesome/web-awesome-tailwind';
import { createInertiaApp } from '@inertiajs/vue3';
import { createMosaicast } from '@artisan-toolbox/mosaicast';
import { initializeTheme } from '@/composables/useAppearance';
import DocsLayout from '@/layouts/DocsLayout.vue';
import { initializeFlashToast } from '@/lib/flashToast';
import { demoEcho } from '@/components/demo/mosaicast/inertia-delivery/broadcast';
import { ZiggyVue } from 'ziggy-js';

void createInertiaApp<{ mosaicastChannelPrefix: string }>({
    serverHead: true,
    layout: (name) => (name.startsWith('docs/') ? DocsLayout : null),
    withApp: (app, { page }) => {
        app.use(ZiggyVue);
        app.use(
            createMosaicast({
                echo: demoEcho,
                channelPrefix: page.props.mosaicastChannelPrefix,
            }),
        );
        app.directive('focus', {
            mounted: (el: HTMLElement, shouldFocus) => {
                if (shouldFocus.value !== false) {
                    el.focus();
                }
            },
        });
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();

initializeFlashToast();
