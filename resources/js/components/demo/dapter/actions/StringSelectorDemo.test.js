import { http, HttpNetworkError } from '@inertiajs/core';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vite-plus/test';
import StringSelectorDemo from './StringSelectorDemo.vue';
import protocol from './wire-v2.json';

const values = [
    { value: '{draft}', url: 'https://atb.test/inspect?ticket=alpha' },
    { value: 'part/', url: 'https://atb.test/inspect?ticket=bravo' },
    { value: '..', url: 'https://atb.test/inspect?ticket=charlie' },
    { value: '%2F', url: 'https://atb.test/inspect?ticket=delta' },
    { value: ' key ', url: 'https://atb.test/inspect?ticket=echo' },
];
const listingUrl = 'https://atb.test/dapter/data/Dapter.StringActionCatalog';
const originalClient = http.getClient();
const request = vi.fn();

function response(data) {
    return { status: 200, headers: {}, data: JSON.stringify(data) };
}

function listing(targets = values) {
    const wire = structuredClone(protocol);
    wire.data = values.map(({ value }) => ({ id: value }));
    wire.requested.paging.per_page = values.length;
    wire.state.paging.per_page = values.length;
    Object.assign(wire.paging, {
        total: values.length,
        filtered: values.length,
        per_page: values.length,
    });
    Object.assign(wire.capabilities.paging, {
        per_page: values.length,
        per_page_options: [values.length],
    });
    wire.actions = {
        inspect: {
            method: 'post',
            transports: ['http'],
            target: { input: 'recordId', valueType: 'string', values: targets },
        },
    };
    return response(wire);
}

function button(wrapper, label) {
    return wrapper.findAllComponents(Button).find((item) => item.text() === label);
}

async function settle() {
    await flushPromises();
    await vi.dynamicImportSettled();
    await flushPromises();
}

enableAutoUnmount(afterEach);
beforeEach(() => {
    request.mockReset();
    http.setClient({ request });
    vi.stubGlobal('Ziggy', {
        url: 'https://atb.test',
        port: null,
        defaults: {},
        routes: { 'dapter.data': { uri: 'dapter/data/{source}', methods: ['POST'] } },
    });
});
afterEach(() => {
    http.setClient(originalClient);
    vi.unstubAllGlobals();
});

it('sends the advertised URL and exact string payload for each reader selection', async () => {
    const wrapper = mount(StringSelectorDemo);
    await settle();
    expect(request).not.toHaveBeenCalled();
    const read = Promise.withResolvers();
    request.mockReturnValueOnce(read.promise);
    await button(wrapper, 'Load string records').trigger('click');
    await settle();
    expect(wrapper.get('[role="status"]').text()).toBe('Loading string records.');
    expect(request.mock.calls[0][0].url).toBe(listingUrl);
    read.resolve(listing());
    await settle();

    for (const { value, url } of values) {
        const write = Promise.withResolvers();
        request.mockReturnValueOnce(write.promise);
        await button(wrapper, `Inspect ${JSON.stringify(value)}`).trigger('click');
        await settle();
        const sent = request.mock.lastCall[0];
        expect(sent).toMatchObject({
            method: 'post',
            url,
            headers: { 'X-Dapter-Action': '1', 'X-Dapter-Transport': 'http' },
        });
        if (value.trim() !== value) {
            expect(sent.data).toBeInstanceOf(FormData);
            expect(sent.data.get('recordId')).toBe(value);
            expect(sent.data.get('attachment').name).toBe('inspection.txt');
        } else {
            expect(typeof sent.data === 'string' ? JSON.parse(sent.data) : sent.data).toEqual({
                recordId: value,
            });
        }
        expect(wrapper.get('[role="status"]').text()).toBe('Inspecting the selected record.');
        expect(wrapper.findAllComponents(Button).every((item) => item.props('disabled'))).toBe(
            true,
        );
        expect(wrapper.find('[data-string-selector-result]').exists()).toBe(false);
        write.resolve(response({ selected: value }));
        await settle();
        expect(wrapper.get('[data-string-selector-result]').element.textContent).toBe(value);
    }
    expect(request).toHaveBeenCalledTimes(6);
});

it('only shows authorized controls and clears an earlier confirmation when inspection fails', async () => {
    request.mockResolvedValueOnce(listing(values.slice(0, 1)));
    const wrapper = mount(StringSelectorDemo);
    await button(wrapper, 'Load string records').trigger('click');
    await settle();
    expect(wrapper.findAllComponents(Button).map((item) => item.text())).toEqual([
        'Inspect "{draft}"',
    ]);
    request.mockResolvedValueOnce(response({ selected: 'server-confirmed' }));
    await button(wrapper, 'Inspect "{draft}"').trigger('click');
    await settle();
    expect(wrapper.get('[data-string-selector-result]').text()).toBe('server-confirmed');
    request.mockRejectedValueOnce(new HttpNetworkError('Lost response'));
    await button(wrapper, 'Inspect "{draft}"').trigger('click');
    await settle();
    expect(wrapper.get('[role="alert"]').text()).toBe('The inspection returned failed.');
    expect(wrapper.find('[data-string-selector-result]').exists()).toBe(false);
    expect(request).toHaveBeenCalledTimes(3);
});

it('shows a listing error before offering any record actions', async () => {
    request.mockRejectedValueOnce(new HttpNetworkError('Listing unavailable'));
    const wrapper = mount(StringSelectorDemo);
    await button(wrapper, 'Load string records').trigger('click');
    await settle();
    expect(wrapper.get('[role="alert"]').text()).not.toBe('');
    expect(wrapper.findAllComponents(Button)).toHaveLength(0);
    expect(request).toHaveBeenCalledTimes(1);
});
