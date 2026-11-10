import { computed, shallowRef } from 'vue';
import { vi } from 'vite-plus/test';

export function preferencesFixture(initial = {}) {
    const confirmed = shallowRef({ appearance: 'system', resolvedAppearance: 'light', ...initial });
    const pending = shallowRef(false);
    const error = shallowRef();
    const service = {
        appearance: computed(() => confirmed.value.appearance),
        resolvedAppearance: computed(() => confirmed.value.resolvedAppearance),
        pending: computed(() => pending.value),
        error: computed(() => error.value),
        setAppearance: vi.fn(),
    };

    return {
        service,
        confirm(values) {
            confirmed.value = { ...confirmed.value, ...values };
        },
        setPending(value) {
            pending.value = value;
        },
        setError(value) {
            error.value = value;
        },
    };
}
