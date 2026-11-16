import { http, HttpResponseError } from '@inertiajs/core';
import { onBeforeUnmount, ref } from 'vue';
import { route } from 'ziggy-js';

export function useProtocolRequest() {
    const state = ref({ status: 'idle' });
    let generation = 0;
    let controller = null;

    async function run(source, requestJson) {
        if (state.value.status === 'loading') return;
        const active = ++generation;
        controller = new AbortController();
        state.value = { status: 'loading', requestJson };
        try {
            let response;
            try {
                response = await http.getClient().request({
                    method: 'post',
                    url: route('dapter.data', { source }),
                    data: requestJson,
                    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                    signal: controller.signal,
                });
            } catch (error) {
                if (!(error instanceof HttpResponseError)) throw error;
                response = error.response;
            }
            if (active !== generation) return;
            state.value = {
                status: 'received',
                requestJson,
                httpStatus: response.status,
                responseJson: response.data,
            };
        } catch {
            if (active === generation) state.value = { status: 'failed', requestJson };
        }
    }

    function reset() {
        generation++;
        controller?.abort();
        controller = null;
        state.value = { status: 'idle' };
    }

    onBeforeUnmount(reset);
    return { state, run, reset };
}
