import { settleDetachedHostUpdates } from '@/testSetup';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import catalog from '@/components/docs/front-awesome/catalog/components.json';

const demos = import.meta.glob('./*/*Demo.vue');
const original = new Set([
    'Button',
    'ButtonGroup',
    'Input',
    'Page',
    'Tag',
    'Tooltip',
    'Icon',
    'Popover',
]);
const wrappers = catalog.groups.flatMap((group) =>
    group.components
        .filter(
            (item) =>
                item.edition === 'Core' && !item.since && !original.has(item.implementation.export),
        )
        .map((item) => ({ ...item, group: group.id })),
);
const ownerFor = (name) =>
    catalog.groups
        .flatMap((group) => group.components)
        .find((item) => item.implementation.export === name).implementation.demoOwner;
const demoFor = async (name) => {
    name = ownerFor(name);
    const entry = Object.entries(demos).find(([path]) => path.endsWith(`/${name}Demo.vue`));
    return (await entry[1]()).default;
};

enableAutoUnmount(afterEach);

describe('Core wrapper live examples', () => {
    for (const item of catalog.groups
        .flatMap((group) => group.components)
        .filter((component) => component.edition === 'Core' && !component.since)) {
        it(`renders the real ${item.name} public wrapper in its live example`, async () => {
            const wrapper = mount(await demoFor(item.implementation.export));
            if (
                [
                    'wa-spinner',
                    'wa-animated-image',
                    'wa-zoomable-frame',
                    'wa-include',
                    'wa-toast-item',
                    'wa-icon',
                ].includes(item.tag)
            ) {
                await wrapper.get('wa-button').trigger('click');
            }
            expect(wrapper.find(item.tag).exists()).toBe(true);
        });
    }

    it('provides an executable public import for every newly implemented Core component', () => {
        expect(wrappers).toHaveLength(65);
        for (const item of wrappers) {
            const name = item.implementation.demoOwner;
            expect(Object.keys(demos).some((path) => path.endsWith(`/${name}Demo.vue`))).toBe(true);
            const source = readFileSync(
                resolve(
                    process.cwd(),
                    `resources/js/components/demo/front-awesome/${item.group}/${name}Demo.vue`,
                ),
                'utf8',
            );
            expect(source).toContain("from '@artisan-toolbox/front-awesome/components/WebAwesome'");
            expect(source).toContain(`<${name}`);
            expect(source).toContain(`<${item.implementation.export}`);
        }
    });

    for (const name of [
        'KnownDate',
        'NumberInput',
        'OtpInput',
        'Rating',
        'Slider',
        'TagInput',
        'Textarea',
        'TimeInput',
        'ColorPicker',
    ]) {
        it(`shows ${name} native input values and restores the initial value`, async () => {
            const wrapper = mount(await demoFor(name));
            await settleDetachedHostUpdates(wrapper);
            const output = wrapper.get('output').text();
            const control = wrapper
                .findAll('*')
                .find((node) => node.element.tagName.startsWith('WA-'));
            const value = {
                KnownDate: '2026-11-15',
                NumberInput: '3',
                OtpInput: '123456',
                Rating: 4,
                Slider: 5,
                TagInput: ['example'],
                Textarea: 'Updated notes.',
                TimeInput: '10:30',
                ColorPicker: '#ff0000',
            }[name];
            if (name === 'OtpInput') {
                Object.defineProperty(control.element, 'value', {
                    configurable: true,
                    writable: true,
                    value,
                });
            } else {
                control.element.value = value;
            }
            await control.trigger(['Rating', 'TagInput'].includes(name) ? 'change' : 'input');
            expect(wrapper.get('output').text()).toContain(
                name === 'TagInput' ? 'example' : String(value),
            );
            await wrapper.get('wa-button').trigger('click');
            expect(wrapper.get('output').text()).toBe(output);
        });
    }

    for (const name of ['Checkbox', 'Switch']) {
        it(`reads ${name} checked state from its native change event`, async () => {
            const wrapper = mount(await demoFor(name));
            await settleDetachedHostUpdates(wrapper);
            const control = wrapper.get(name === 'Checkbox' ? 'wa-checkbox' : 'wa-switch');
            control.element.checked = true;
            await control.trigger('change');
            expect(wrapper.get('output').text()).toBe('Enabled: true');
            await wrapper.get('wa-button').trigger('click');
            expect(wrapper.get('output').text()).toBe('Enabled: false');
        });
    }

    for (const [name, tag, targetLabel] of [
        ['Popover', 'wa-popover', 'Component details'],
        ['Tooltip', 'wa-tooltip', 'Save help'],
    ]) {
        it(`keeps ${name} linked to its public Button target and native methods`, async () => {
            const wrapper = mount(await demoFor(name));
            await settleDetachedHostUpdates(wrapper);
            const buttons = wrapper.findAll('wa-button');
            const target = buttons.find((button) => button.text() === targetLabel);
            const control = wrapper.get(tag);
            await flushPromises();
            expect(target.attributes('id')).toBeTruthy();
            expect(control.element.for).toBe(target.attributes('id'));
            let visible = false;
            control.element.show = () => {
                visible = true;
            };
            control.element.hide = () => {
                visible = false;
            };
            await buttons[1].trigger('click');
            expect(visible).toBe(true);
            await buttons[2].trigger('click');
            expect(visible).toBe(false);
        });
    }

    it('starts and pauses the visible Skeleton effects after reader action', async () => {
        const wrapper = mount(await demoFor('Skeleton'));
        const effects = () =>
            wrapper.findAll('wa-skeleton').map((control) => control.element.effect);
        await flushPromises();
        expect(effects()).toEqual(['none', 'none', 'none']);
        expect(wrapper.get('output').text()).toBe('Animations paused.');
        await wrapper.get('wa-button').trigger('click');
        expect(effects()).toEqual(['none', 'pulse', 'sheen']);
        expect(wrapper.get('output').text()).toBe('Pulse and sheen animations running.');
        await wrapper.get('wa-button').trigger('click');
        expect(effects()).toEqual(['none', 'none', 'none']);
    });

    it('uses the Page navigation-toggle slot for an independently nested preview', async () => {
        const wrapper = mount(await demoFor('Page'));
        expect(wrapper.get('wa-button[slot="navigation-toggle"]').text()).toBe('Menu');
        expect(wrapper.get('wa-page').attributes('mobile-breakpoint')).toBe('600px');
    });

    it('keeps the Rating hit target out of the stretching flex row', async () => {
        const wrapper = mount(await demoFor('Rating'));
        const rating = wrapper.get('wa-rating').element;
        const cell = rating.closest('.min-w-0');
        expect(cell.tagName).toBe('DIV');
        expect(cell.className).toBe('min-w-0');
        expect(cell.parentElement).toBe(wrapper.element);
        expect(cell.querySelectorAll('wa-rating')).toHaveLength(1);
        expect(cell.classList.contains('flex')).toBe(false);
        expect(wrapper.classes()).toContain('flex-col');
        expect(wrapper.find('style').exists()).toBe(false);
    });

    it('keeps checkbox group choices independent', async () => {
        const wrapper = mount(await demoFor('CheckboxGroup'));
        await settleDetachedHostUpdates(wrapper);
        const controls = wrapper.findAll('wa-checkbox');
        controls[0].element.checked = true;
        await controls[0].trigger('change');
        expect(wrapper.get('output').text()).toBe('Email: true. Dashboard: false.');
    });

    for (const [name, tag] of [
        ['Select', 'wa-select'],
        ['RadioGroup', 'wa-radio-group'],
    ]) {
        it(`reflects the selected value from ${name}`, async () => {
            const wrapper = mount(await demoFor(name));
            await settleDetachedHostUpdates(wrapper);
            const control = wrapper.get(tag);
            const value = name === 'Select' ? 'front-awesome' : 'preview';
            control.element.value = value;
            await control.trigger('input');
            expect(wrapper.get('output').text()).toContain(value);
        });
    }

    for (const [name, tag] of [
        ['Spinner', 'wa-spinner'],
        ['AnimatedImage', 'wa-animated-image'],
        ['ZoomableFrame', 'wa-zoomable-frame'],
        ['Include', 'wa-include'],
        ['ToastItem', 'wa-toast-item'],
    ]) {
        it(`waits for a reader action before starting ${name} and supports reset`, async () => {
            const wrapper = mount(await demoFor(name));
            await flushPromises();
            expect(wrapper.find(tag).exists()).toBe(false);
            await wrapper.get('wa-button').trigger('click');
            expect(wrapper.find(tag).exists()).toBe(true);
            await wrapper.get('wa-button').trigger('click');
            expect(wrapper.find(tag).exists()).toBe(false);
        });
    }

    it('handles include failures as visible recoverable status', async () => {
        const wrapper = mount(await demoFor('Include'));
        await wrapper.get('wa-button').trigger('click');
        await wrapper.get('wa-include').trigger('wa-error');
        expect(wrapper.get('output').text()).toContain('Content unavailable');
    });

    for (const [name, tag, property, event, nativeValue, buttonLabel, expected] of [
        ['Pagination', 'wa-pagination', 'page', 'wa-page-change', 3, 'Go to page five', 5],
        ['TabGroup', 'wa-tab-group', 'active', 'wa-tab-show', 'install', 'Open Usage tab', 'usage'],
        [
            'Stepper',
            'wa-stepper',
            'active',
            'wa-step-change',
            'configure',
            'Go to Verify step',
            'verify',
        ],
    ]) {
        it(`keeps ${name} named state synchronized in both directions`, async () => {
            const wrapper = mount(await demoFor(name));
            await settleDetachedHostUpdates(wrapper);
            const control = wrapper.get(tag);
            control.element[property] = nativeValue;
            await control.trigger(event);
            expect(wrapper.get('output').text()).toContain(String(nativeValue));
            await wrapper
                .findAll('wa-button')
                .find((button) => button.text() === buttonLabel)
                .trigger('click');
            expect(control.element[property]).toBe(expected);
            expect(wrapper.get('output').text()).toContain(String(expected));
        });
    }

    for (const [name, tag, event] of [
        ['IntersectionObserver', 'wa-intersection-observer', 'wa-intersect'],
        ['MutationObserver', 'wa-mutation-observer', 'wa-mutation'],
        ['ResizeObserver', 'wa-resize-observer', 'wa-resize'],
    ]) {
        it(`enables ${name} only after a reader action and displays native events`, async () => {
            const wrapper = mount(await demoFor(name));
            await flushPromises();
            expect(wrapper.get(tag).attributes('disabled')).toBeDefined();
            await wrapper.get('wa-button').trigger('click');
            expect(wrapper.get(tag).attributes('disabled')).toBeUndefined();
            await wrapper.get(tag).trigger(event);
            expect(wrapper.get('output').text()).toContain('1');
        });
    }

    it('calls the native Toast API on demand and reports failures', async () => {
        const wrapper = mount(await demoFor('Toast'));
        const calls = [];
        wrapper.get('wa-toast').element.create = async (...args) => calls.push(args);
        expect(calls).toEqual([]);
        await wrapper.get('wa-button').trigger('click');
        expect(calls[0]).toEqual(['Draft saved.', { variant: 'success', duration: 5000 }]);
        expect(wrapper.get('output').text()).toBe('Notification created');
        wrapper.get('wa-toast').element.create = async () => {
            throw new Error('unavailable');
        };
        await wrapper.get('wa-button').trigger('click');
        expect(wrapper.get('output').text()).toContain('Notification unavailable');
    });
});
