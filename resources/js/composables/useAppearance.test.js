import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { defineComponent, h, nextTick } from 'vue';
import { preferencesFixture } from '../../../tests/Fixtures/preferences';
import { useAppearance } from './useAppearance';

const context = vi.hoisted(() => ({ fixture: undefined }));
vi.mock('@artisan-toolbox/front-awesome', async (importOriginal) => ({
    ...(await importOriginal()),
    usePreferences: () => context.fixture.service,
}));

enableAutoUnmount(afterEach);
beforeEach(() => {
    context.fixture = preferencesFixture();
});

const AppearanceControl = defineComponent({
    setup() {
        const { appearance, resolvedAppearance, updateAppearance, pending, error } =
            useAppearance();
        return () =>
            h(
                'select',
                {
                    value: appearance.value,
                    'data-resolved': resolvedAppearance.value,
                    'data-error': error.value,
                    disabled: pending.value,
                    onChange: (event) => updateAppearance(event.target.value),
                },
                ['system', 'light', 'dark'].map((value) => h('option', { value }, value)),
            );
    },
});

describe('package appearance adapter', () => {
    it('delegates selection to the package and keeps the confirmed preference until its response', async () => {
        const wrapper = mount(AppearanceControl);
        await wrapper.get('select').setValue('dark');
        expect(context.fixture.service.setAppearance).toHaveBeenCalledExactlyOnceWith('dark');
        expect(context.fixture.service.appearance.value).toBe('system');
        context.fixture.confirm({ appearance: 'dark', resolvedAppearance: 'dark' });
        await nextTick();
        expect(wrapper.get('select').element.value).toBe('dark');
        expect(wrapper.get('select').attributes('data-resolved')).toBe('dark');
    });

    it('shares confirmed values across consumers and remounts without a second preference store', async () => {
        const first = mount(AppearanceControl);
        const second = mount(AppearanceControl);
        context.fixture.confirm({ appearance: 'light', resolvedAppearance: 'light' });
        await nextTick();
        expect(first.get('select').element.value).toBe('light');
        expect(second.get('select').element.value).toBe('light');
        first.unmount();
        const remounted = mount(AppearanceControl);
        expect(remounted.get('select').element.value).toBe('light');
        expect(context.fixture.service.setAppearance).not.toHaveBeenCalled();
    });

    it('exposes the package pending state and persistence failure', async () => {
        const wrapper = mount(AppearanceControl);
        context.fixture.setPending(true);
        context.fixture.setError('Preferences could not be confirmed.');
        await nextTick();
        expect(wrapper.get('select').element.disabled).toBe(true);
        expect(wrapper.get('select').attributes('data-error')).toBe(
            'Preferences could not be confirmed.',
        );
        context.fixture.setPending(false);
        context.fixture.setError(undefined);
        await nextTick();
        expect(wrapper.get('select').element.disabled).toBe(false);
        expect(wrapper.get('select').attributes('data-error')).toBeUndefined();
    });
});
