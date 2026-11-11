import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import contracts from './fixtures/maintainer-deployment.json';
import Index from '../../pages/docs/maintainer/deployment/Index.vue';
import Deploy from '../../pages/docs/maintainer/deployment/Deploy.vue';
import Unlock from '../../pages/docs/maintainer/deployment/Unlock.vue';
import RepositoryTags from '../../pages/docs/maintainer/deployment/RepositoryTags.vue';
import Pm2 from '../../pages/docs/maintainer/deployment/Pm2.vue';
import Commands from '../../pages/docs/maintainer/Commands.vue';
import Development from '../../pages/docs/maintainer/Development.vue';

const releasedParagraphs = new Map([
    [
        'The grouped Deployer tests, standard-input preservation and Windows input inheritance, isolated APT test environment, and Symfony 8.1.11 security updates described here are previews available on the current 1.x branch after the 1.10.0 release. They are not included in that stable release.',
        'Maintainer 1.11.0 includes the grouped Deployer tests, standard-input preservation and Windows input inheritance, isolated APT test environment, and Symfony 8.1.11 security updates described here.',
    ],
]);

const guides = [
    ['deployment/index', Index],
    ['deployment/deploy', Deploy],
    ['deployment/unlock', Unlock],
    ['deployment/repository-tags', RepositoryTags],
    ['deployment/pm2', Pm2],
    ['commands', Commands],
    ['development', Development],
].map(([source, component]) => ({
    source,
    component,
    document: contracts[source],
}));
const destinations = [
    ...new Set(
        guides.flatMap(({ document }) => document.links.map(({ slug }) => slug).filter(Boolean)),
    ),
];
const normalize = (text) => text.replace(/\s+/g, ' ').trim();
function navigation(prefix = '/docs') {
    return destinations.map((slug) => ({
        slug,
        href: `${prefix}/${slug}`,
        children: [],
    }));
}
function render(guide) {
    return mount(guide.component, {
        props: {
            navigation: navigation(),
            page: {
                title: guide.document.metadata.title,
                description: guide.document.metadata.description,
                package: {
                    title: 'Maintainer',
                    composerName: 'artisan-toolbox/maintainer',
                    documentedVersion: '1.10',
                    installedVersion: '1.10',
                    stability: 'Stable',
                },
            },
        },
    });
}

describe('Maintainer deployment and contributor guides', () => {
    for (const guide of guides) {
        it(`preserves every legacy paragraph, heading, anchor, and copyable example in ${guide.source}`, () => {
            const wrapper = render(guide);
            const { document } = guide;
            expect(wrapper.get('h1').text()).toBe(document.metadata.title);
            expect(wrapper.find('dl').exists()).toBe(false);
            expect(wrapper.get('[aria-label="Package details"]').text()).toContain('Maintainer');
            expect(wrapper.get('[aria-label="Package details"]').text()).toContain(
                'Documented version 1.10',
            );
            expect(wrapper.get('[aria-label="Package details"]').text()).toContain('Stable');
            expect(
                wrapper.findAll('h2, h3').map((heading) => ({
                    level: Number(heading.element.tagName.slice(1)),
                    id: heading.attributes('id'),
                    text: heading.text(),
                })),
            ).toEqual(document.headings);
            for (const anchor of document.anchors)
                expect(wrapper.get(`[id="${anchor}"]`).exists()).toBe(true);
            expect(wrapper.findAll('pre code').map((code) => code.text())).toEqual(
                document.examples.map(({ code }) => code),
            );
            expect(
                wrapper
                    .findAll('pre code')
                    .map((code) => code.classes().find((name) => name.startsWith('language-'))),
            ).toEqual(document.examples.map(({ language }) => `language-${language}`));
            expect(
                wrapper
                    .findAll('wa-button[aria-label^="Copy "]')
                    .every((button) => button.attributes('aria-label').startsWith('Copy ')),
            ).toBe(true);
            expect(wrapper.findAll('wa-button[aria-label^="Copy "]')).toHaveLength(
                document.examples.length,
            );
            const text = normalize(wrapper.text());
            for (const paragraph of document.paragraphs)
                expect(text).toContain(normalize(releasedParagraphs.get(paragraph) ?? paragraph));
        });
        if (guide.document.links.length > 0) {
            it(`resolves every source link from navigation and reacts to updated routes in ${guide.source}`, async () => {
                const wrapper = render(guide);
                const expected = guide.document.links.map(({ href }) => href);
                expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual(
                    expected,
                );
                await wrapper.setProps({
                    navigation: navigation('/reference'),
                });
                expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual(
                    expected.map((href) => href.replace(/^\/docs\//, '/reference/')),
                );
                expect(
                    wrapper
                        .findAll('a')
                        .some((link) => link.attributes('href').startsWith('/packages/')),
                ).toBe(false);
            });
        }
    }
    it('identifies released workflows and reserves the source preview for task search', () => {
        for (const guide of guides.filter(
            ({ source }) => source !== 'deployment/repository-tags',
        )) {
            const text = normalize(render(guide).text());
            expect(text).toContain('Maintainer 1.11.0 includes');
            if (['deployment/index', 'deployment/deploy'].includes(guide.source)) {
                expect(text).toContain('source preview');
                expect(text).toContain('1.x branch after 1.11.0');
            } else {
                expect(text).not.toContain('previews available');
            }
        }
    });
    it('retains the PM2 process replacement order and isolation constraints', () => {
        const wrapper = render(guides.find(({ source }) => source === 'deployment/pm2'));
        expect(wrapper.findAll('ol li').map((item) => normalize(item.text()))).toEqual([
            'It identifies application processes and any enabled legacy processes by their validated PM2 IDs.',
            'It deletes each selected ID and immediately runs pm2 save --force.',
            'It starts the ecosystem with --namespace and --update-env from release_path.',
            'It runs pm2 save --force again.',
        ]);
        expect(normalize(wrapper.text())).toContain('The task never runs pm2 delete all.');
        expect(normalize(wrapper.text())).toContain(
            'PM2 modules marked with pm2_env.pmx_module = true are always preserved.',
        );
    });
    it('keeps repository tag examples scoped to arbitrary consuming projects', () => {
        const wrapper = render(
            guides.find(({ source }) => source === 'deployment/repository-tags'),
        );
        expect(wrapper.get('pre code').text()).toContain("set('branch', '2.x');");
        expect(wrapper.findAll('pre code').at(-1).text()).toBe(
            'vendor/bin/maintainer deploy production --tag=v2.1.0',
        );
    });
});
