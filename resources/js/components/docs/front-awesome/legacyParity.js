import {
    installationCommands,
    installationExample,
} from '../installationFixture';
import { mount } from '@vue/test-utils';
import { expect, it } from 'vite-plus/test';

const normalize = (text) => text.replace(/\s+/g, ' ').trim();

export function expectLegacyLinks(
    links,
    legacyLinks,
    allowedExtraLinks = [],
    prefix = '/docs',
) {
    const destination = (link) =>
        link.slug ? `${prefix}/${link.slug}${link.hash ?? ''}` : link.href;

    for (const extra of allowedExtraLinks) {
        const matches = links.filter(
            (link) => link.attributes('href') === destination(extra),
        );
        expect(matches).toHaveLength(1);
        expect(matches[0].text()).toBe(extra.text);
    }

    expect(
        links
            .filter(
                (link) =>
                    !allowedExtraLinks.some(
                        (extra) =>
                            link.attributes('href') === destination(extra),
                    ),
            )
            .map((link) => link.attributes('href')),
    ).toEqual(legacyLinks.map(destination));
}

export function verifyLegacyPages({
    fixtures,
    components,
    packageTitle,
    version,
    stability,
    installation,
    allowedExtraLinks = {},
}) {
    const slugs = [
        ...new Set(
            fixtures.flatMap((guide) => [
                guide.slug,
                ...guide.links.map((link) => link.slug).filter(Boolean),
                ...(allowedExtraLinks[guide.slug] ?? []).map(
                    (link) => link.slug,
                ),
            ]),
        ),
    ];
    const navigation = (prefix = '/docs') =>
        slugs.map((slug) => ({
            slug,
            href: `${prefix}/${slug}`,
            children: [],
        }));

    function render(guide) {
        return mount(components[guide.slug], {
            props: {
                navigation: navigation(),
                page: {
                    slug: guide.slug,
                    title: guide.title,
                    description: guide.description,
                    requirements: guide.requirements ?? [],
                    package: {
                        id: guide.slug.split('/')[0],
                        installationCommands: installationCommands(
                            guide.slug.split('/')[0],
                        ),
                        title: packageTitle,
                        composerName: `artisan-toolbox/${guide.slug.split('/')[0]}`,
                        documentedVersion: version,
                        stability,
                        ...installation,
                    },
                },
            },
        });
    }

    for (const guide of fixtures) {
        it(`preserves all source prose, tables, headings, and examples in ${guide.slug}`, () => {
            const wrapper = render(guide);

            expect(wrapper.get('h1').text()).toBe(guide.title);
            if (guide.slug === guide.slug.split('/')[0]) {
                expect(
                    wrapper.findAll('dl dd').map((value) => value.text()),
                ).toEqual([
                    `artisan-toolbox/${guide.slug}`,
                    installation.installedVersion,
                    stability,
                ]);
            } else {
                expect(wrapper.find('dl').exists()).toBe(false);
                expect(wrapper.get('h1').find('.sr-only').exists()).toBe(false);
                expect(
                    wrapper
                        .get('[aria-label="Package details"]')
                        .findAll('span')
                        .map((value) => value.text()),
                ).toEqual([
                    packageTitle,
                    `Documented version ${installation.installedVersion}`,
                    stability,
                ]);
            }
            expect(
                wrapper.findAll('h2, h3, h4').map((heading) => ({
                    level: Number(heading.element.tagName.slice(1)),
                    id: heading.attributes('id'),
                    text: heading.text(),
                })),
            ).toEqual(guide.headings);
            expect(
                wrapper
                    .findAll('pre code')
                    .map((code) => code.element.textContent),
            ).toEqual(
                guide.examples.map((example) =>
                    installationExample(example, guide.slug.split('/')[0]),
                ),
            );
            expect(
                wrapper
                    .findAll('pre code')
                    .map((code) =>
                        code
                            .classes()
                            .find((name) => name.startsWith('language-')),
                    ),
            ).toEqual(
                guide.examples.map((example) => `language-${example.language}`),
            );
            expect(
                wrapper
                    .findAll('table')
                    .map((table) =>
                        table
                            .findAll('tr')
                            .map((row) =>
                                row
                                    .findAll('th, td')
                                    .map((cell) => normalize(cell.text())),
                            ),
                    ),
            ).toEqual(
                guide.tables.map((table) =>
                    table.map((row) => row.map(normalize)),
                ),
            );
            const visibleText = normalize(wrapper.text());
            let paragraphEnd = 0;
            for (const paragraph of guide.paragraphs) {
                const sourceParagraph = normalize(paragraph);
                const paragraphStart = visibleText.indexOf(
                    sourceParagraph,
                    paragraphEnd,
                );
                expect(
                    paragraphStart,
                    `Source paragraph in sequence in ${guide.slug}: ${sourceParagraph}`,
                ).toBeGreaterThanOrEqual(paragraphEnd);
                paragraphEnd = paragraphStart + sourceParagraph.length;
            }
            for (const id of guide.anchors) {
                expect(wrapper.findAll(`[id="${id}"]`)).toHaveLength(1);
            }
            expect(wrapper.findAll('button[aria-label^="Copy "]')).toHaveLength(
                guide.examples.length,
            );
            wrapper.unmount();
        });

        it(`preserves destinations and reactive route metadata in ${guide.slug}`, async () => {
            const wrapper = render(guide);
            expectLegacyLinks(
                wrapper.findAll('a'),
                guide.links,
                allowedExtraLinks[guide.slug],
            );
            for (const link of wrapper.findAll('a')) {
                if (/^https?:\/\//.test(link.attributes('href'))) {
                    expect(link.attributes('target')).toBe('_blank');
                    expect(link.attributes('rel')).toBe('noopener noreferrer');
                }
            }
            await wrapper.setProps({ navigation: navigation('/reference') });
            expectLegacyLinks(
                wrapper.findAll('a'),
                guide.links,
                allowedExtraLinks[guide.slug],
                '/reference',
            );
            wrapper.unmount();
        });
    }

    for (const guide of fixtures.filter((fixture) => fixture.requirements)) {
        it(`updates the ${guide.slug} requirements when page metadata changes`, async () => {
            const wrapper = render(guide);
            const requirements = ['PHP 8.5 with the documented extensions'];

            await wrapper.setProps({
                page: { ...wrapper.props('page'), requirements },
            });

            expect(
                wrapper
                    .get('section[aria-labelledby="requirements"]')
                    .findAll('li')
                    .map((item) => item.text()),
            ).toEqual(requirements);
            wrapper.unmount();
        });
    }

    return { render };
}
