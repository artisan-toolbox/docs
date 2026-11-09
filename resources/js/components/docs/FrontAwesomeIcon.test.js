import { compileScript, parse } from '@vue/compiler-sfc';
import { mount } from '@vue/test-utils';
import { expect, it } from 'vite-plus/test';
import Icon from '../../pages/docs/front-awesome/Icon.vue';

it('provides executable Setup examples and native icon guidance without extra setup', async () => {
    const navigation = (prefix) => [
        {
            slug: 'front-awesome/installation',
            href: `${prefix}/front-awesome/installation`,
            children: [],
        },
    ];
    const wrapper = mount(Icon, {
        props: {
            navigation: navigation('/docs'),
            page: {
                title: 'Render icons with Web Awesome',
                description: 'Use native attributes and typed events.',
                package: {
                    title: 'Front Awesome',
                    documentedVersion: '1.x-dev',
                    stability: 'Work in progress',
                },
            },
        },
    });
    const examples = wrapper.findAll('pre code.language-vue').map((code) => code.text());

    expect(wrapper.get('h1').text()).toBe('Render icons with Web Awesome');
    expect(examples).toHaveLength(3);
    for (const [index, example] of examples.entries()) {
        const { descriptor, errors } = parse(example);
        expect(errors).toEqual([]);
        expect(descriptor.scriptSetup.lang).toBeUndefined();
        expect(() =>
            compileScript(descriptor, {
                id: `icon-example-${index}`,
                inlineTemplate: true,
            }),
        ).not.toThrow();
        expect(descriptor.scriptSetup.content).toContain(
            '@artisan-toolbox/front-awesome/components',
        );
    }
    expect(examples[0]).toContain('name="house" label="Home"');
    expect(examples[1]).toContain('canvas="auto"');
    expect(examples[1]).toContain('animation="spin"');
    expect(examples[2]).toContain('src="/icons/add.svg"');
    expect(examples[2]).toContain("IconProps['onWaLoad']");
    expect(examples[2]).toContain("IconProps['onWaError']");
    expect(examples[2]).toContain('@wa-load="onLoad" @wa-error="onError"');
    expect(wrapper.get('pre code.language-html').text()).toContain('viewBox="0 0 16 16"');
    expect(wrapper.text()).toContain('The toast plugin is not required.');
    expect(wrapper.text()).toContain('Older published previews may not include it.');
    expect(wrapper.text()).toContain(
        'Icon adds no default classes, theme, color, size, spacing, or stylesheet.',
    );
    expect(wrapper.text()).toContain('spriteSheet: true');
    expect(wrapper.text()).toContain('original native Event');
    expect(wrapper.text()).toContain('HTMLAttributes');
    expect(wrapper.text()).toContain('deprecated in favor of canvas="auto"');
    expect(wrapper.find('wa-icon').exists()).toBe(false);
    await wrapper.setProps({ navigation: navigation('/reference') });
    expect(wrapper.get('a[href="/reference/front-awesome/installation"]').text()).toBe(
        'Installation',
    );
    wrapper.unmount();
});
