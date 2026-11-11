import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { compileScript, parse } from '@vue/compiler-sfc';
import { mount } from '@vue/test-utils';
import { expect, it } from 'vite-plus/test';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import Media from '../../pages/docs/front-awesome/web-awesome/components/Media.vue';

it('provides executable Setup examples and native icon guidance without extra setup', async () => {
    const navigation = (prefix) => [
        {
            slug: 'front-awesome/installation',
            href: `${prefix}/front-awesome/installation`,
            children: [],
        },
    ];
    const page = mount(Media, {
        props: {
            navigation: navigation('/docs'),
            page: {
                title: 'Media',
                description: 'Use native attributes and typed events.',
                package: {
                    title: 'Front Awesome',
                    documentedVersion: '1.x-dev',
                    stability: 'Work in progress',
                },
            },
        },
        global: { stubs: { ComponentCatalog: true, CatalogContext: true } },
    });
    const wrapper = page.get('[data-component-reference="icon"]');
    const frames = wrapper.findAllComponents(DemoFrame);
    expect(frames).toHaveLength(3);
    const examples = frames.flatMap((frame) => frame.props('sources').map((source) => source.code));
    expect(page.findAll('[data-catalog-demo="Icon"]')).toHaveLength(1);

    expect(page.get('h1').text()).toBe('Media');
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
    expect(examples[1]).toContain("['auto', 'fixed', 'square', 'roomy']");
    expect(examples[1]).toContain("spinning ? 'spin' : undefined");
    expect(examples[2]).toContain("'icon-add' : 'icon-missing'");
    expect(examples[2]).toContain('/examples/front-awesome/');
    expect(examples[2]).toContain("IconProps['onWaLoad']");
    expect(examples[2]).toContain("IconProps['onWaError']");
    expect(examples[2]).toContain('@wa-load="onLoad"');
    expect(examples[2]).toContain('@wa-error="onError"');
    expect(wrapper.get('pre code.language-html').text()).toContain('viewBox="0 0 16 16"');
    expect(wrapper.get('pre code.language-html').text()).toBe(
        readFileSync(
            resolve(process.cwd(), 'public/examples/front-awesome/icon-add.svg'),
            'utf8',
        ).trim(),
    );
    expect(wrapper.text()).toContain('The toast plugin is not required.');
    expect(wrapper.text()).toContain('Front Awesome 1.0.0-alpha.2 exports components/Icon.vue.');
    expect(wrapper.text()).toContain(
        'Icon adds no default classes, theme, color, size, spacing, or stylesheet.',
    );
    expect(wrapper.text()).toContain('spriteSheet: true');
    expect(wrapper.text()).toContain('original native Event');
    expect(wrapper.text()).toContain('HTMLAttributes');
    expect(wrapper.text()).toContain('deprecated in favor of canvas="auto"');
    expect(wrapper.find('wa-icon').exists()).toBe(false);
    await frames[0].get('[data-demo-viewport] wa-button').trigger('click');
    expect(wrapper.findAll('wa-icon')).toHaveLength(2);
    await frames[1].get('[data-demo-viewport] wa-button').trigger('click');
    expect(frames[1].findAll('wa-icon').length).toBeGreaterThan(2);
    await frames[2].get('[data-demo-viewport] wa-button').trigger('click');
    const icon = frames[2].get('wa-icon');
    await icon.trigger('wa-load');
    expect(frames[2].get('[data-demo-viewport] output').text()).toBe('Icon loaded.');
    await frames[2].findAll('[data-demo-viewport] wa-button')[1].trigger('click');
    await icon.trigger('wa-error');
    expect(frames[2].get('[data-demo-viewport] output').text()).toBe('Icon failed to load.');
    await frames[2].findAll('[data-demo-viewport] wa-button')[2].trigger('click');
    expect(frames[2].find('wa-icon').exists()).toBe(false);
    await page.setProps({ navigation: navigation('/reference') });
    expect(wrapper.get('a[href="/reference/front-awesome/installation"]').text()).toBe(
        'Installation',
    );
    page.unmount();
});
