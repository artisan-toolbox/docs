import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { defineComponent, h, nextTick } from 'vue';
import { initializeTheme, useAppearance } from '@/composables/useAppearance';
import BrandLogo from './BrandLogo.vue';

enableAutoUnmount(afterEach);
let systemDark;
let systemChange;

beforeEach(() => {
    systemDark = false;
    systemChange = undefined;
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'wa-dark', 'wa-light');
    vi.stubGlobal('matchMedia', () => ({
        matches: systemDark,
        addEventListener: (event, listener) => {
            if (event === 'change') systemChange = listener;
        },
    }));
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('BrandLogo', () => {
    it.each([
        ['dark', false, 'dark'],
        ['light', true, 'light'],
        ['system', true, 'dark'],
        ['system', false, 'light'],
    ])(
        'selects %s with a dark system preference of %s before its first paint',
        async (preference, dark, expected) => {
            systemDark = dark;
            localStorage.setItem('appearance', preference);
            initializeTheme();
            const sourceAssignments = vi.spyOn(HTMLImageElement.prototype, 'src', 'set');

            const wrapper = mount(BrandLogo);
            await nextTick();

            expect(wrapper.findAll('img')).toHaveLength(1);
            const image = wrapper.get('img');
            expect(image.attributes('src')).toContain(`logo-${expected}-192.webp`);
            expect(image.attributes('srcset')).toContain(`logo-${expected}-384.webp`);
            expect(image.attributes('srcset')).toContain(`logo-${expected}-576.webp`);
            expect(image.attributes('srcset')).not.toContain(
                `logo-${expected === 'dark' ? 'light' : 'dark'}-`,
            );
            expect(image.attributes()).toMatchObject({
                alt: 'Artisan Toolbox',
                width: '1456',
                height: '500',
                sizes: '(min-width: 640px) 192px, 160px',
            });
            expect(sourceAssignments.mock.calls.length).toBeGreaterThan(0);
            for (const [source] of sourceAssignments.mock.calls) {
                expect(source).toContain(`logo-${expected}-`);
            }
        },
    );

    it('follows system changes and explicit controls without adding another image', async () => {
        initializeTheme();
        const control = mount(
            defineComponent({
                setup() {
                    const { updateAppearance } = useAppearance();
                    return () =>
                        h(
                            'select',
                            {
                                onChange: (event) => updateAppearance(event.target.value),
                            },
                            ['system', 'light', 'dark'].map((value) =>
                                h('option', { value }, value),
                            ),
                        );
                },
            }),
        );
        const wrapper = mount(BrandLogo, { props: { sizes: '160px' } });
        await nextTick();
        const image = wrapper.get('img').element;

        systemDark = true;
        systemChange();
        await nextTick();
        expect(image.src).toContain('logo-dark-');

        await control.get('select').setValue('light');
        expect(image.src).toContain('logo-light-');
        systemChange();
        await nextTick();
        expect(image.src).toContain('logo-light-');
        expect(wrapper.findAll('img')).toHaveLength(1);
        expect(wrapper.get('img').element).toBe(image);
        expect(wrapper.get('img').attributes('sizes')).toBe('160px');
        expect(localStorage.getItem('appearance')).toBe('light');
    });
});
