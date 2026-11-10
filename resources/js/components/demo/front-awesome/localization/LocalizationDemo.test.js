import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { createFrontAwesome } from '@artisan-toolbox/front-awesome';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { createLocalization } from '@artisan-toolbox/front-awesome/localization';
import LocalizationDemo from './LocalizationDemo.vue';
import { settleDetachedHostUpdates } from '@/testSetup';

const originalLanguage = document.documentElement.getAttribute('lang');
const wrappers = [];
const titles = { en: 'Print documents', es: 'Imprimir documentos', 'pt-BR': 'Imprimir documentos' };
const catalog = {
    version: 1,
    fallbackLocale: 'en',
    locales: Object.fromEntries(
        [
            ['en', 'en', 'English'],
            ['es', 'es', 'Español'],
            ['pt-BR', 'pt_BR', 'Português (Brasil)'],
        ].map(([locale, sourceLocale, label]) => [
            locale,
            { sourceLocale, label, messages: { 'front-awesome::printing.title': titles[locale] } },
        ]),
    ),
};

function mountDemo() {
    const localization = createLocalization(catalog, {
        numberFormats: Object.fromEntries(
            [
                ['en', 'USD'],
                ['es', 'EUR'],
                ['pt-BR', 'BRL'],
            ].map(([locale, currency]) => [locale, { money: { style: 'currency', currency } }]),
        ),
        datetimeFormats: Object.fromEntries(
            ['en', 'es', 'pt-BR'].map((locale) => [
                locale,
                { short: { dateStyle: 'short', timeZone: 'UTC' } },
            ]),
        ),
    });
    const wrapper = mount(LocalizationDemo, {
        global: { plugins: [createFrontAwesome({ localization })] },
    });
    wrappers.push(wrapper);
    return wrapper;
}

afterEach(async () => {
    for (const wrapper of wrappers.splice(0)) {
        await settleDetachedHostUpdates(wrapper);
        wrapper.unmount();
    }
    if (originalLanguage === null) document.documentElement.removeAttribute('lang');
    else document.documentElement.setAttribute('lang', originalLanguage);
    vi.restoreAllMocks();
});

describe('Laravel-source localization demonstration', () => {
    it('follows HTML and changes translated output and Intl formats through public controls', async () => {
        document.documentElement.lang = 'en';
        const wrapper = mountDemo();
        await flushPromises();
        expect(wrapper.get('[data-demo-locale]').text()).toBe('en');
        expect(wrapper.get('[data-demo-message]').text()).toBe('Print documents');
        expect(wrapper.get('[data-demo-number]').text()).toBe(
            new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(1234.5),
        );
        const choice = wrapper
            .findAllComponents(Button)
            .find((button) => button.text() === 'Português (Brasil)');
        choice.vm.$emit('click');
        await flushPromises();
        expect(document.documentElement.lang).toBe('pt-BR');
        expect(wrapper.get('[data-demo-locale]').text()).toBe('pt-BR');
        expect(wrapper.get('[data-demo-message]').text()).toBe('Imprimir documentos');
        expect(wrapper.get('[data-demo-number]').text()).toBe(
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(1234.5),
        );
        expect(wrapper.get('[data-demo-date]').text()).toBe(
            new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone: 'UTC' }).format(
                new Date('2026-11-10T12:00:00Z'),
            ),
        );
        expect(wrapper.text()).toContain('documentation article stays in English');
        document.documentElement.lang = 'es';
        await flushPromises();
        expect(wrapper.get('[data-demo-locale]').text()).toBe('es');
        expect(wrapper.get('[data-demo-number]').text()).toBe(
            new Intl.NumberFormat('es', { style: 'currency', currency: 'EUR' }).format(1234.5),
        );
    });

    it('keeps the confirmed language when the reader leaves the page', async () => {
        document.documentElement.lang = 'es';
        const wrapper = mountDemo();
        await flushPromises();
        wrapper
            .findAllComponents(Button)
            .find((button) => button.text() === 'English')
            .vm.$emit('click');
        await flushPromises();
        expect(document.documentElement.lang).toBe('en');
        await settleDetachedHostUpdates(wrapper);
        wrapper.unmount();
        wrappers.splice(wrappers.indexOf(wrapper), 1);
        expect(document.documentElement.lang).toBe('en');
    });
});
