import { settleDetachedHostUpdates } from '@/testSetup';
import { compileScript, parse } from '@vue/compiler-sfc';
import { mount } from '@vue/test-utils';
import { expect, it } from 'vite-plus/test';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import Forms from '../../pages/docs/front-awesome/web-awesome/components/Forms.vue';

const navigation = (prefix = '/docs') => [
    {
        slug: 'front-awesome/installation',
        href: `${prefix}/front-awesome/installation`,
        children: [],
    },
];
function render() {
    return mount(Forms, {
        props: {
            navigation: navigation(),
            page: {
                title: 'Forms',
                description: 'Use a Vue model or an Inertia form.',
                package: {
                    title: 'Front Awesome',
                    documentedVersion: '1.x-dev',
                    stability: 'Work in progress',
                },
            },
        },
        global: { stubs: { ComponentCatalog: true, CatalogContext: true } },
    });
}
const live = (frame) => frame.get('[data-demo-viewport]');
const button = (frame, text) =>
    live(frame)
        .findAll('wa-button')
        .find((control) => control.text() === text);
const output = (frame) => live(frame).get('output').text();
async function value(control, next, event = 'input') {
    Object.defineProperty(control.element, 'value', {
        configurable: true,
        writable: true,
        value: next,
    });
    await control.trigger(event);
}

it('teaches all shared form modes through complete live sources in canonical Forms', async () => {
    const wrapper = render();
    const section = wrapper.get('section[aria-labelledby="input"]');
    const frames = section.findAllComponents(DemoFrame);
    expect(frames).toHaveLength(6);
    expect(wrapper.findAll('[data-catalog-demo="Input"]')).toHaveLength(1);
    expect(wrapper.text()).toContain('Shared form binding');
    for (const id of [
        'use-v-model',
        'bind-an-inertia-form',
        'display-server-errors',
        'keep-web-awesome-behavior',
        'binding-contract',
        'reuse-the-bridge',
    ])
        expect(wrapper.findAll(`[id="${id}"]`)).toHaveLength(1);
    const examples = frames.flatMap((frame) => frame.props('sources').map((source) => source.code));
    for (const [index, example] of examples.entries()) {
        const { descriptor, errors } = parse(example);
        expect(errors).toEqual([]);
        expect(descriptor.scriptSetup.lang).toBeUndefined();
        expect(() =>
            compileScript(descriptor, { id: `forms-example-${index}`, inlineTemplate: true }),
        ).not.toThrow();
        expect(descriptor.scriptSetup.content).toContain('@artisan-toolbox/front-awesome');
    }
    expect(examples[0]).toContain('v-model="name"');
    expect(examples[1]).toContain('field="users.0.email"');
    expect(examples[1]).toContain('form.setError(');
    expect(examples[1]).not.toContain('v-model');
    expect(examples[5]).toContain('useFormBridge(props,');
    expect(examples[5]).toContain('defineComponent');
    expect(section.text()).toContain('toast plugin is optional');
    expect(section.text()).toContain('may be absent from published alpha releases');
    expect(section.text()).toContain('do not call setCustomValidity()');
    expect(section.text()).toContain(
        'Combining v-model with an Inertia form binding throws an error',
    );
    expect(section.text()).toContain(
        'Input keeps its original strict contract and requires a binding',
    );
    expect(section.text()).toContain('field-name');
    expect(section.text()).toContain('InputAttributes');
    await wrapper.setProps({ navigation: navigation('/reference') });
    expect(section.get('a[href="/reference/front-awesome/installation"]').text()).toBe(
        'Installation',
    );
    wrapper.unmount();
});

it('updates nested fields, server errors, reset, manual validation, and custom bridge controls', async () => {
    const wrapper = render();
    await settleDetachedHostUpdates(wrapper);
    const frames = wrapper.get('section[aria-labelledby="input"]').findAllComponents(DemoFrame);
    const inertia = frames[1];
    const email = live(inertia).get('wa-input');
    await value(email, 'reader@example.com');
    expect(output(inertia)).toContain('Email: reader@example.com');
    await button(inertia, "Use Grace's email").trigger('click');
    expect(email.element.value).toBe('grace@example.com');
    await button(inertia, 'Simulate server errors').trigger('click');
    expect(live(inertia).text()).toContain('Email is already taken.');
    expect(live(inertia).text()).toContain('Choose at least three stars.');
    expect(email.attributes('aria-invalid')).toBe('true');
    await value(email, 'updated@example.com');
    expect(live(inertia).text()).toContain('Email is already taken.');
    await button(inertia, 'Clear server errors').trigger('click');
    expect(live(inertia).text()).not.toContain('Email is already taken.');
    expect(email.attributes('aria-invalid')).toBeUndefined();
    await button(inertia, 'Reset form values').trigger('click');
    expect(email.element.value).toBe('ada@example.com');
    expect(output(inertia)).toContain('Subscribed: false. Score: 2. Volume: 25.');

    const calendar = frames[3];
    const dateInput = live(calendar).get('wa-date-input');
    const datePicker = live(calendar).get('wa-date-picker');
    await button(calendar, 'Use February 20').trigger('click');
    expect(dateInput.element.value).toBe('2026-02-20');
    await value(datePicker, '2026-02-21');
    expect(dateInput.element.value).toBe('2026-02-21');
    expect(output(calendar)).toBe('Delivery date: 2026-02-21.');
    await button(calendar, 'Reset date').trigger('click');
    expect(dateInput.element.value).toBe('2026-01-15');

    const manual = frames[4];
    await button(manual, 'Validate local values').trigger('click');
    expect(live(manual).text()).toContain('Enter a display name.');
    expect(live(manual).text()).toContain('You can change this value without submitting.');
    await value(live(manual).get('wa-input'), 'Lin');
    expect(live(manual).text()).not.toContain('Enter a display name.');
    expect(output(manual)).toContain('Name: Lin.');
    await button(manual, 'Reset local validation').trigger('click');
    expect(live(manual).text()).not.toContain('You can change this value without submitting.');
    expect(output(manual)).toContain('Name: empty. Enabled: false. Rating: 0.');

    const bridge = frames[5];
    const fields = live(bridge).findAll('input');
    await fields[0].setValue('Katherine');
    await fields[1].setValue('Dorothy');
    expect(output(bridge)).toBe('Model: Katherine. Form: Dorothy.');
    await button(bridge, 'Update both custom fields').trigger('click');
    expect(fields.map((field) => field.element.value)).toEqual(['Lin', 'Margaret']);
    await button(bridge, 'Simulate custom field error').trigger('click');
    expect(live(bridge).text()).toContain('This nickname is already taken.');
    expect(fields[1].attributes('aria-invalid')).toBe('true');
    await button(bridge, 'Clear custom field error').trigger('click');
    expect(live(bridge).text()).not.toContain('This nickname is already taken.');
    expect(fields[1].attributes('aria-invalid')).toBeUndefined();
    wrapper.unmount();
});
