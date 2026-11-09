import { compileScript, parse } from '@vue/compiler-sfc';
import { mount } from '@vue/test-utils';
import { expect, it } from 'vite-plus/test';
import Input from '../../pages/docs/front-awesome/Input.vue';

it('provides complete Setup examples for both exclusive input binding modes', async () => {
    const navigation = (prefix) => [
        {
            slug: 'front-awesome/installation',
            href: `${prefix}/front-awesome/installation`,
            children: [],
        },
    ];
    const wrapper = mount(Input, {
        props: {
            navigation: navigation('/docs'),
            page: {
                title: 'Bind input values and form errors',
                description: 'Use a Vue model or an Inertia form.',
                package: {
                    title: 'Front Awesome',
                    documentedVersion: '1.x-dev',
                    stability: 'Work in progress',
                },
            },
        },
    });
    const examples = wrapper.findAll('pre code').map((code) => code.text());

    expect(examples).toHaveLength(3);
    for (const [index, example] of examples.entries()) {
        const { descriptor, errors } = parse(example);
        expect(errors).toEqual([]);
        expect(descriptor.scriptSetup.lang).toBeUndefined();
        expect(() => compileScript(descriptor, { id: `input-example-${index}` })).not.toThrow();
        expect(descriptor.scriptSetup.content).toContain('@artisan-toolbox/front-awesome');
    }
    expect(examples[0]).toContain('v-model="name"');
    expect(examples[1]).toContain('field-name="users.0.email"');
    expect(examples[1]).toContain("form.setError('users.0.email'");
    expect(examples[1]).not.toContain('v-model');
    expect(examples[2]).toContain('useFormBridge(props,');
    expect(wrapper.text()).toContain('The toast plugin is not required.');
    expect(wrapper.text()).toContain('Older published previews may not include it.');
    expect(wrapper.text()).toContain('Server errors do not call setCustomValidity()');
    expect(wrapper.text()).toContain('Both modes together, or neither mode, throw an error.');
    await wrapper.setProps({ navigation: navigation('/reference') });
    expect(wrapper.get('a[href="/reference/front-awesome/installation"]').text()).toBe(
        'Installation',
    );
    wrapper.unmount();
});
