import { settleDetachedHostUpdates } from '@/testSetup';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import catalog from '@/components/docs/front-awesome/catalog/components.json';

const demos = import.meta.glob('./*/*Demo.vue', { eager: true, import: 'default' });
const pro = catalog.groups
    .flatMap((group) => group.components)
    .filter((item) => item.edition === 'Pro');
const demoFor = (name) => {
    const owner = catalog.groups
        .flatMap((group) => group.components)
        .find((item) => item.implementation.export === name).implementation.demoOwner;
    return Object.entries(demos).find(([path]) => path.endsWith(`/${owner}Demo.vue`))[1];
};
const gated = new Set([
    'Chart',
    'BarChart',
    'BubbleChart',
    'DoughnutChart',
    'LineChart',
    'PieChart',
    'PolarAreaChart',
    'RadarChart',
    'ScatterChart',
    'DataGrid',
    'Video',
    'VideoPlaylist',
]);

enableAutoUnmount(afterEach);

describe('licensed Pro wrapper live examples', () => {
    it('documents every Pro element from the installed licensed manifest', () => {
        const manifest = JSON.parse(
            readFileSync(
                resolve(
                    process.cwd(),
                    'node_modules/@web.awesome.me/webawesome-pro/dist/custom-elements.json',
                ),
                'utf8',
            ),
        );
        const tags = manifest.modules
            .flatMap((module) => module.declarations ?? [])
            .flatMap((declaration) => (declaration.tagName ? [declaration.tagName] : []));
        expect(pro).toHaveLength(17);
        expect(
            catalog.groups
                .flatMap((group) => group.components)
                .filter((item) => item.implementation.state === 'implemented')
                .map((item) => item.tag)
                .sort((left, right) => left.localeCompare(right)),
        ).toEqual(tags.sort((left, right) => left.localeCompare(right)));
        for (const item of pro) {
            expect(tags).toContain(item.tag);
            expect(item.implementation.state).toBe('implemented');
        }
    });

    for (const item of pro) {
        it(`renders the public ${item.name} wrapper with its required context`, async () => {
            const wrapper = mount(demoFor(item.implementation.export));
            if (gated.has(item.implementation.export)) {
                expect(wrapper.find(item.tag).exists()).toBe(false);
                await wrapper.get('wa-button').trigger('click');
            }
            expect(wrapper.find(item.tag).exists()).toBe(true);
            if (gated.has(item.implementation.export)) {
                await wrapper.get('wa-button').trigger('click');
                expect(wrapper.find(item.tag).exists()).toBe(false);
            }
        });
    }

    for (const [name, tag] of [
        ['Combobox', 'wa-combobox'],
        ['DateInput', 'wa-date-input'],
        ['DatePicker', 'wa-date-picker'],
    ]) {
        it(`shows the native ${name} selection`, async () => {
            const wrapper = mount(demoFor(name));
            await settleDetachedHostUpdates(wrapper);
            const control = wrapper.get(tag);
            control.element.value = name === 'Combobox' ? 'front-awesome' : '2026-11-15';
            await control.trigger('input');
            expect(wrapper.get('output').text()).toContain(control.element.value);
        });
    }

    it('lists selected file names locally and clears the selection', async () => {
        const wrapper = mount(demoFor('FileInput'));
        await settleDetachedHostUpdates(wrapper);
        const control = wrapper.get('wa-file-input');
        control.element.files = [new File(['Example'], 'example.txt', { type: 'text/plain' })];
        await control.trigger('change');
        expect(wrapper.get('output').text()).toBe('example.txt');
        await wrapper.get('wa-button').trigger('click');
        expect(wrapper.get('output').text()).toBe('No files selected');
    });

    for (const name of ['Video', 'VideoPlaylist']) {
        it(`does not autoplay ${name} and reports media failure`, async () => {
            const wrapper = mount(demoFor(name));
            await flushPromises();
            await wrapper.get('wa-button').trigger('click');
            const video = wrapper.get('wa-video');
            expect(video.attributes('preload')).toBe('none');
            expect(video.attributes('autoplay')).toBeUndefined();
            await video.trigger('error');
            expect(wrapper.get('[role="alert"]').text()).toContain('Media unavailable');
            await wrapper.get('wa-button').trigger('click');
            expect(wrapper.find('[role="alert"]').exists()).toBe(false);
        });
    }
});
