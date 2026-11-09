import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { defineComponent, h, nextTick } from 'vue';
import { initializeTheme, updateTheme, useAppearance } from './useAppearance';

enableAutoUnmount(afterEach);
let systemDark;
let systemChange;

const AppearanceControl = defineComponent({
    setup() {
        const { appearance, resolvedAppearance, updateAppearance } = useAppearance();
        return () =>
            h(
                'select',
                {
                    value: appearance.value,
                    'data-resolved': resolvedAppearance.value,
                    onChange: (event) => updateAppearance(event.target.value),
                },
                ['system', 'light', 'dark'].map((value) => h('option', { value }, value)),
            );
    },
});

beforeEach(() => {
    systemDark = false;
    systemChange = undefined;
    localStorage.clear();
    document.cookie = 'appearance=;path=/;max-age=0';
    document.documentElement.classList.remove('dark', 'wa-dark', 'wa-light');
    vi.stubGlobal('matchMedia', () => ({
        matches: systemDark,
        addEventListener: (event, listener) => {
            if (event === 'change') systemChange = listener;
        },
    }));
});

afterEach(() => vi.unstubAllGlobals());

function expectMode(mode) {
    expect(document.documentElement.classList.contains('dark')).toBe(mode === 'dark');
    expect(document.documentElement.classList.contains('wa-dark')).toBe(mode === 'dark');
    expect(document.documentElement.classList.contains('wa-light')).toBe(mode === 'light');
}

describe('shared appearance controller', () => {
    it('keeps Tailwind and Web Awesome classes synchronized in both directions', () => {
        updateTheme('dark');
        expectMode('dark');
        updateTheme('light');
        expectMode('light');
        systemDark = true;
        updateTheme('system');
        expectMode('dark');
    });

    it('persists the preference for the browser and Blade prepaint and restores the control', async () => {
        const wrapper = mount(AppearanceControl);
        await wrapper.get('select').setValue('dark');
        expect(localStorage.getItem('appearance')).toBe('dark');
        expect(document.cookie).toContain('appearance=dark');
        expectMode('dark');
        wrapper.unmount();
        const restored = mount(AppearanceControl);
        expect(restored.get('select').element.value).toBe('dark');
        expect(restored.get('select').attributes('data-resolved')).toBe('dark');
    });

    it('follows system changes reactively while retaining an explicit user preference', async () => {
        initializeTheme();
        const wrapper = mount(AppearanceControl);
        await nextTick();
        expectMode('light');
        expect(wrapper.get('select').attributes('data-resolved')).toBe('light');
        systemDark = true;
        systemChange();
        await nextTick();
        expectMode('dark');
        expect(wrapper.get('select').attributes('data-resolved')).toBe('dark');
        await wrapper.get('select').setValue('light');
        systemChange();
        await nextTick();
        expectMode('light');
        expect(localStorage.getItem('appearance')).toBe('light');
    });

    it('falls back to system for an invalid stored preference', async () => {
        localStorage.setItem('appearance', 'sepia');
        systemDark = true;
        initializeTheme();
        const wrapper = mount(AppearanceControl);
        await nextTick();
        expect(wrapper.get('select').element.value).toBe('system');
        expectMode('dark');
    });
});
