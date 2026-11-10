import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { nextTick } from 'vue';
import { preferencesFixture } from '../../../../tests/Fixtures/preferences';
import BrandLogo from './BrandLogo.vue';

const context = vi.hoisted(() => ({ fixture: undefined }));
vi.mock('@artisan-toolbox/front-awesome', async (importOriginal) => ({
    ...(await importOriginal()),
    usePreferences: () => context.fixture.service,
}));

enableAutoUnmount(afterEach);
beforeEach(() => {
    context.fixture = preferencesFixture();
    document.documentElement.classList.remove('dark');
});
afterEach(() => {
    vi.restoreAllMocks();
});

describe('BrandLogo', () => {
    it.each(['dark', 'light'])(
        'uses the server prepaint %s mode before mounting and the same confirmed mode afterward',
        async (expected) => {
            document.documentElement.classList.toggle('dark', expected === 'dark');
            context.fixture.confirm({ resolvedAppearance: expected });
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
            for (const [source] of sourceAssignments.mock.calls)
                expect(source).toContain(`logo-${expected}-`);
        },
    );

    it('updates the same image when the package confirms a new resolved appearance', async () => {
        const wrapper = mount(BrandLogo, { props: { sizes: '160px' } });
        await nextTick();
        const image = wrapper.get('img').element;
        context.fixture.service.setAppearance('dark');
        await nextTick();
        expect(image.src).toContain('logo-light-');
        context.fixture.confirm({ appearance: 'dark', resolvedAppearance: 'dark' });
        await nextTick();
        expect(image.src).toContain('logo-dark-');
        context.fixture.confirm({ appearance: 'system', resolvedAppearance: 'light' });
        await nextTick();
        expect(image.src).toContain('logo-light-');
        expect(wrapper.findAll('img')).toHaveLength(1);
        expect(wrapper.get('img').element).toBe(image);
        expect(wrapper.get('img').attributes('sizes')).toBe('160px');
    });
});
