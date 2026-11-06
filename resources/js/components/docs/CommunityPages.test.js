import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import GettingStarted from '../../pages/docs/getting-started/Index.vue';
import ChoosePackage from '../../pages/docs/getting-started/ChoosePackage.vue';
import Project from '../../pages/docs/project/Index.vue';
import DocumentationPolicy from '../../pages/docs/project/DocumentationPolicy.vue';
import Versioning from '../../pages/docs/project/Versioning.vue';
import fixtures from './fixtures/community-pages.json';

const components = {
    'getting-started': GettingStarted,
    'getting-started/choose-a-package': ChoosePackage,
    'project/documentation-policy': DocumentationPolicy,
    'project/versioning': Versioning,
};
const slugs = [
    '',
    'getting-started',
    'getting-started/choose-a-package',
    'project/documentation-policy',
    'project/versioning',
    'qztray',
    'maintainer/deployment/pm2',
];
const navigation = (prefix = '/docs') =>
    slugs.map((slug) => ({
        slug,
        href: prefix + (slug ? '/' + slug : ''),
        children: [],
    }));
const normalize = (value) => value.replace(/\s+/g, ' ').trim();
const packageEntry = (id, title, href) => ({
    id,
    title,
    href,
    summary: 'The selected package summary.',
    version: '1.x',
    stability: 'Stable',
    migrated: true,
    artwork: { icon: '/icon.svg' },
});
const render = (fixture) =>
    mount(components[fixture.slug], {
        props: {
            page: {
                title: fixture.title,
                description: 'Community documentation.',
            },
            navigation: navigation(),
            packages: [],
        },
    });

for (const fixture of fixtures) {
    describe(fixture.title, () => {
        it('preserves every source paragraph, list item, heading, code example, and destination', () => {
            const wrapper = render(fixture);
            const content = wrapper.get('[data-document-content]');

            expect(wrapper.get('h1').text()).toBe(fixture.title);
            expect(
                content.findAll('h2,h3,h4,h5,h6').map((heading) => ({
                    level: Number(heading.element.tagName.slice(1)),
                    id: heading.attributes('id'),
                    text: heading.text(),
                })),
            ).toEqual(fixture.headings);
            expect(
                content.findAll('pre code').map((code) => code.text()),
            ).toEqual(fixture.examples.map((example) => example.code));
            expect(
                content
                    .findAll('pre code')
                    .map((code) =>
                        code
                            .classes()
                            .find((name) => name.startsWith('language-')),
                    ),
            ).toEqual(
                fixture.examples.map(
                    (example) => `language-${example.language}`,
                ),
            );
            expect(
                content
                    .findAll('p')
                    .filter(
                        (paragraph) =>
                            !paragraph.attributes('role') &&
                            !paragraph.element.closest('figure'),
                    )
                    .map((paragraph) => normalize(paragraph.text())),
            ).toEqual(fixture.paragraphs.map(normalize));
            expect(
                content.findAll('li').map((item) => normalize(item.text())),
            ).toEqual(fixture.listItems.map(normalize));
            expect(
                content.findAll('a').map((link) => link.attributes('href')),
            ).toEqual(fixture.links.map((link) => link.href));
            for (const anchor of fixture.anchors)
                expect(content.find(`[id="${String(anchor)}"]`).exists()).toBe(
                    true,
                );
            wrapper.unmount();
        });

        it('uses updated route props for every internal guide destination', async () => {
            const wrapper = render(fixture);

            await wrapper.setProps({ navigation: navigation('/reference') });

            expect(
                wrapper
                    .get('[data-document-content]')
                    .findAll('a')
                    .map((link) => link.attributes('href')),
            ).toEqual(
                fixture.links.map((link) =>
                    Object.hasOwn(link, 'slug')
                        ? '/reference' +
                          (link.slug ? '/' + link.slug : '') +
                          link.hash
                        : link.href,
                ),
            );
            wrapper.unmount();
        });
    });
}

it('renders the server package catalog in the chooser and updates it after navigation', async () => {
    const wrapper = mount(ChoosePackage, {
        props: {
            page: { title: 'Choose a Package', description: 'Select a tool.' },
            navigation: navigation(),
            packages: [packageEntry('first', 'First package', '/docs/first')],
        },
    });

    expect(wrapper.get('[data-package-catalog]').text()).toContain(
        'First package',
    );
    expect(wrapper.get('[data-package-catalog] a').attributes('href')).toBe(
        '/docs/first',
    );
    await wrapper.setProps({
        packages: [
            packageEntry('second', 'Second package', '/reference/second'),
        ],
    });

    expect(wrapper.get('[data-package-catalog]').text()).toContain(
        'Second package',
    );
    expect(wrapper.get('[data-package-catalog]').text()).not.toContain(
        'First package',
    );
    expect(wrapper.get('[data-package-catalog] a').attributes('href')).toBe(
        '/reference/second',
    );
    wrapper.unmount();
});

it('links the project overview to ownership, versioning, getting started, and the package catalog', async () => {
    const wrapper = mount(Project, {
        props: {
            page: {
                title: 'About the project',
                description: 'Contribution guidance.',
            },
            navigation: navigation(),
        },
    });

    expect(wrapper.get('h1').text()).toBe('About the project');
    expect(
        wrapper.findAll('h2').map((heading) => heading.attributes('id')),
    ).toEqual(['documentation', 'releases']);
    expect(
        wrapper
            .findAll('[data-document-content] a')
            .map((link) => link.attributes('href')),
    ).toEqual([
        '/docs/project/documentation-policy',
        '/docs/project/versioning',
        '/docs/getting-started',
        '/docs',
    ]);
    await wrapper.setProps({ navigation: navigation('/reference') });
    expect(
        wrapper
            .findAll('[data-document-content] a')
            .map((link) => link.attributes('href')),
    ).toEqual([
        '/reference/project/documentation-policy',
        '/reference/project/versioning',
        '/reference/getting-started',
        '/reference',
    ]);
    wrapper.unmount();
});
