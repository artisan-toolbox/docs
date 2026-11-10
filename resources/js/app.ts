import '../css/app.css';
import '@artisan-toolbox/front-awesome/web-awesome-tailwind';
import { createInertiaApp } from '@inertiajs/vue3';
import { createMosaicast } from '@artisan-toolbox/mosaicast';
import { createLocalization } from '@artisan-toolbox/front-awesome/localization';
import { createPreferences } from '@artisan-toolbox/front-awesome';
import translations from './generated/front-awesome-translations.json';
import DocsLayout from '@/layouts/DocsLayout.vue';
import { initializeFlashToast } from '@/lib/flashToast';
import { demoEcho } from '@/components/demo/mosaicast/inertia-delivery/broadcast';
import { ZiggyVue } from 'ziggy-js';

void createInertiaApp<{ mosaicastChannelPrefix: string }>({
    serverHead: true,
    layout: (name) => (name.startsWith('docs/') ? DocsLayout : null),
    withApp: (app, { page }) => {
        app.use(ZiggyVue);
        app.use(createPreferences(page.props.preferences));
        app.use(
            createLocalization(translations, {
                numberFormats: {
                    en: { money: { style: 'currency', currency: 'USD' } },
                    es: { money: { style: 'currency', currency: 'EUR' } },
                    'pt-BR': { money: { style: 'currency', currency: 'BRL' } },
                },
                datetimeFormats: {
                    en: { short: { dateStyle: 'short', timeZone: 'UTC' } },
                    es: { short: { dateStyle: 'short', timeZone: 'UTC' } },
                    'pt-BR': { short: { dateStyle: 'short', timeZone: 'UTC' } },
                },
            }),
        );
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

initializeFlashToast();
