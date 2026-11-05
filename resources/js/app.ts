import { createInertiaApp } from '@inertiajs/vue3';
import { initializeTheme } from '@/composables/useAppearance';
import DocsLayout from '@/layouts/DocsLayout.vue';
import { initializeFlashToast } from '@/lib/flashToast';

void createInertiaApp({
    serverHead: true,
    layout: (name) => (name.startsWith('docs/') ? DocsLayout : null),
    withApp: (app) => {
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
