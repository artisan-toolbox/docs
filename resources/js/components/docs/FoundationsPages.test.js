import { installationCommands, installationExample } from './installationFixture';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import CoreIndex from '../../pages/docs/core/Index.vue';
import ConditionalArrays from '../../pages/docs/core/ConditionalArrays.vue';
import MultiDomainInertia from '../../pages/docs/core/MultiDomainInertia.vue';
import TranslatedAttributes from '../../pages/docs/core/TranslatedAttributes.vue';
import DumpIndex from '../../pages/docs/dump-to-console/Index.vue';
import DumpUsage from '../../pages/docs/dump-to-console/Usage.vue';
import MosaicastIndex from '../../pages/docs/mosaicast/Index.vue';
import InertiaDelivery from '../../pages/docs/mosaicast/InertiaDelivery.vue';
import SessionChannels from '../../pages/docs/mosaicast/SessionChannels.vue';
import VuePlugin from '../../pages/docs/mosaicast/VuePlugin.vue';
import DeliveryGuarantees from '../../pages/docs/mosaicast/DeliveryGuarantees.vue';
import fixtures from './foundations-source-fixtures.json';
import { sourceNavigation } from './sourceNavigationFixture';
import { expectLegacyLinks } from './front-awesome/legacyParity';

const allowedExtraLinks = {
    core: [{ slug: 'core/installation', text: 'Install Core' }],
    'dump-to-console': [
        {
            slug: 'dump-to-console/installation',
            text: 'Install Dump to Console',
        },
    ],
    mosaicast: [
        { slug: 'mosaicast/installation', text: 'Install Mosaicast' },
        {
            href: 'https://viteplus.dev/guide/upgrade-project',
            text: 'Vite+ update guide',
        },
    ],
};
const packageDetails = {
    core: { title: 'Core', documentedVersion: '1.2' },
    'dump-to-console': {
        title: 'Dump to Console',
        documentedVersion: '1.1',
    },
    mosaicast: { title: 'Mosaicast', documentedVersion: '1.2' },
};

const components = [
    CoreIndex,
    ConditionalArrays,
    MultiDomainInertia,
    TranslatedAttributes,
    DumpIndex,
    DumpUsage,
    MosaicastIndex,
    InertiaDelivery,
    SessionChannels,
    VuePlugin,
    DeliveryGuarantees,
];
const normalize = (value) => value.replace(/\s+/g, ' ').trim();
function render(fixture, index) {
    return mount(components[index], {
        props: {
            page: {
                slug: fixture.slug,
                title: fixture.title,
                description: 'Package documentation.',
                requirements: fixture.requirements,
                package: {
                    id: fixture.package,
                    installationCommands: installationCommands(fixture.package),
                    ...packageDetails[fixture.package],
                    composerName: `artisan-toolbox/${fixture.package}`,
                    installedVersion: '1.x-dev',
                    installationStatus: 'installed',
                    installationSource: 'local-path',
                    stability: 'Stable',
                },
            },
            navigation: sourceNavigation(),
            ...(fixture.slug === 'mosaicast/inertia-delivery'
                ? {
                      mosaicastDemo: {
                          deliveryUrl: '/demo/mosaicast/delivery',
                          queueUrl: '/demo/mosaicast/queue',
                          queueAllowed: false,
                          queueConfigured: false,
                          broadcaster: 'null',
                          channelPrefix: 'mosaicast.sessions',
                      },
                  }
                : {}),
        },
    });
}

describe('Core, Dump to Console, and Mosaicast documentation', () => {
    fixtures.forEach((fixture, index) => {
        it(`preserves every ${fixture.slug} source heading, example, paragraph, requirement, table, and destination`, () => {
            const wrapper = render(fixture, index);
            const content = wrapper.get('[data-document-content]');
            const authored = (selector) =>
                content
                    .findAll(selector)
                    .filter((node) => !node.element.closest('[data-docs-outline-exclude]'));
            const demoHeading =
                fixture.slug === 'mosaicast/inertia-delivery'
                    ? [
                          {
                              level: 2,
                              id: 'try-inertia-delivery',
                              text: 'Try the delivery paths',
                          },
                      ]
                    : [];
            expect(wrapper.get('h1').text()).toBe(fixture.title);
            if (fixture.slug === fixture.package) {
                expect(wrapper.findAll('dl dd').map((value) => value.text())).toEqual([
                    `artisan-toolbox/${fixture.package}`,
                    '1.x-dev',
                    'Stable',
                ]);
            } else {
                expect(wrapper.find('dl').exists()).toBe(false);
                expect(wrapper.get('h1').find('.sr-only').exists()).toBe(false);
                expect(
                    wrapper
                        .get('[aria-label="Package details"]')
                        .findAll('wa-tag')
                        .map((value) => value.text()),
                ).toEqual([
                    packageDetails[fixture.package].title,
                    'Documented version 1.x-dev',
                    'Stable',
                ]);
            }
            const expectedHeadings = [...demoHeading, ...fixture.headings];
            if (fixture.slug === 'core/conditional-arrays') {
                expectedHeadings.splice(2, 0, {
                    level: 2,
                    id: 'try-conditional-arrays',
                    text: 'Try conditional arrays',
                });
            }
            if (fixture.slug === 'mosaicast') {
                expectedHeadings.splice(8, 0, {
                    level: 3,
                    id: 'build-the-package',
                    text: 'Build the package',
                });
            }
            expect(
                authored('h2, h3, h4, h5, h6').map((heading) => ({
                    level: Number(heading.element.tagName.slice(1)),
                    id: heading.attributes('id'),
                    text: heading.text(),
                })),
            ).toEqual(expectedHeadings);
            const expectedExamples = [...fixture.examples];
            if (fixture.slug === 'dump-to-console') {
                expectedExamples[2] = {
                    ...expectedExamples[2],
                    code: "dc('Hello from Laravel');\n\ndc(orderId: 42);",
                };
            }
            if (fixture.slug === 'core') {
                expectedExamples.push({
                    code: 'composer install\ncomposer test\ncomposer test:distribution',
                    language: 'bash',
                });
            }
            if (fixture.slug === 'mosaicast') {
                expectedExamples.push({
                    code: 'composer install\nnpm ci\ncomposer test\nnpm run check\nnpm test\nnpm run build',
                    language: 'bash',
                });
            }
            expect(authored('pre code').map((code) => code.text())).toEqual(
                expectedExamples.map((example) => installationExample(example, fixture.package)),
            );
            expect(
                authored('pre code').map((code) =>
                    code.classes().find((name) => name.startsWith('language-')),
                ),
            ).toEqual(expectedExamples.map((example) => `language-${example.language}`));
            const paragraphs = authored('p')
                .filter(
                    (paragraph) =>
                        !paragraph.attributes('role') && !paragraph.element.closest('figure'),
                )
                .map((paragraph) => normalize(paragraph.text()));
            const extraParagraphs = (allowedExtraLinks[fixture.slug] ?? [])
                .filter((link) => link.slug)
                .map(
                    (link) =>
                        `Follow ${link.text} for the complete setup and a first working example.`,
                );
            if (fixture.slug === 'core') {
                extraParagraphs.push(
                    'Run the checks from the Core checkout with PHP 8.5, Composer, and Git. The distribution check also needs the PHP Zip extension and access to the Composer dependency registry.',
                    "The commands below describe the Maintainer 1.14.3 integration on Core's 1.x branch.",
                    "composer test runs composer quality:check and type coverage. The quality check uses Maintainer's strict mode for PHPStan, Pint, and Pest. It fails if a required tool cannot run. Pest runs serially by default for this small suite. Set MAINTAINER_PEST_PARALLEL=true to try two workers on Unix.",
                    'Type coverage must report all PHP files in src/ and meet the 100% threshold. The distribution check installs a ZIP of the checked-out commit in a temporary Laravel 13 application. It verifies that Laravel discovers Core, Arr::sift() works, and the package contains the Boost skill.',
                    'GitHub Actions tests the lowest and stable Composer dependency resolutions on Ubuntu and Windows. The root artisan-toolbox/maintainer action sets up PHP and Composer, validates the manifest in strict mode, and installs dependencies with --no-scripts. It caches Composer downloads. Core runs Testbench discovery after installation, then runs composer quality:check in each matrix entry. Type coverage runs on Ubuntu, and the distribution check runs on Ubuntu with stable dependencies.',
                    'Maintainer requires a successful tests.yml push run for the exact release commit. Each pushed commit gets its own run. New commits on a pull request cancel its previous run. Use Run workflow on the Actions tab to start a manual run for debugging.',
                );
            }
            if (fixture.slug === 'dump-to-console') {
                extraParagraphs.push(
                    'Run composer test to check analysis, formatting, type coverage, and runtime behavior. Actions tests the lowest and stable resolutions of the declared dependencies on Ubuntu and Windows. The type coverage command requires a complete report for the files Pest can analyze.',
                );
            }
            if (fixture.slug === 'mosaicast') {
                extraParagraphs.push(
                    "For the current development toolchain on the package's 1.x branch, use PHP 8.5 and Node.js 24.11 or later within the Node.js 24 series, matching CI. From the package checkout, install Composer dependencies before npm dependencies, run the checks, and rebuild the distributed client:",
                    'Actions runs PHP on Ubuntu and Windows with the lowest and stable declared dependencies. Separate frontend jobs run the Node.js checks once on each operating system. The Ubuntu job also compares the rebuilt client with the committed files.',
                    'Successful checks exit without errors. The build writes the ESM client, IIFE bundle, and type declarations to dist/. Keep Vite+ 1.5.0, its Vite core alias at 1.5.0, and the bundled Vitest 5.1.0 aligned when refreshing dependencies. See the Vite+ update guide. These contributor requirements do not change how applications install the compiled Composer-delivered client.',
                );
            }
            if (fixture.slug === 'core/conditional-arrays') {
                extraParagraphs.push(
                    "Run the example with the fixed fictional profile Alex Example. Your click sends two options to this Laravel application, which executes Core's sift_when() and Arr::sift(). Changing an option or resetting the demo sends no request.",
                    'First run with both options off. The nested contact is omitted without evaluating its closure, while false, null, 0, and the empty string remain. Removing the middle item preserves numeric keys 0 and 2, so JSON represents those items as an object. Include the middle item to see a JSON array instead.',
                );
            }
            if (fixture.slug === 'dump-to-console/usage') {
                extraParagraphs.push(
                    'Select the fields you need, such as an order ID and an item count. Keep full request bodies, credentials, tokens, and sensitive model attributes out of dumps.',
                );
            }
            if (fixture.slug === 'mosaicast/inertia-delivery')
                extraParagraphs.push(
                    'These examples send real requests to this Laravel application. Each registers its own listeners before your click sends the request and removes them afterward. All use order 42, your message, the same session, and no artificial delay. Counts describe delivery, not performance.',
                );
            for (const paragraph of extraParagraphs) {
                expect(paragraphs.filter((text) => text === paragraph)).toHaveLength(1);
            }
            expect(paragraphs.filter((paragraph) => !extraParagraphs.includes(paragraph))).toEqual(
                fixture.paragraphs.map(normalize),
            );
            for (const requirement of fixture.requirements)
                expect(content.findAll('li').map((item) => normalize(item.text()))).toContain(
                    normalize(requirement),
                );
            expect(
                content
                    .findAll('table')
                    .map((table) =>
                        table
                            .findAll('tr')
                            .map((row) =>
                                row.findAll('th, td').map((cell) => normalize(cell.text())),
                            ),
                    ),
            ).toEqual(fixture.tables);
            expectLegacyLinks(content.findAll('a'), fixture.links, allowedExtraLinks[fixture.slug]);
            for (const anchor of fixture.anchors)
                expect(content.find(`[id="${String(anchor)}"]`).exists()).toBe(true);
        });

        it(`updates every ${fixture.slug} navigation destination from current route props`, async () => {
            const wrapper = render(fixture, index);
            await wrapper.setProps({
                navigation: sourceNavigation('/reference'),
            });
            expectLegacyLinks(
                wrapper.get('[data-document-content]').findAll('a'),
                fixture.links,
                allowedExtraLinks[fixture.slug],
                '/reference',
            );
            for (const link of wrapper.get('[data-document-content]').findAll('a')) {
                if (/^https?:\/\//.test(link.attributes('href'))) {
                    expect(link.attributes('target')).toBe('_blank');
                    expect(link.attributes('rel')).toBe('noopener noreferrer');
                }
            }
        });
    });

    it.each([0, 4, 6])(
        'updates the requirements list when overview %i receives new page metadata',
        async (index) => {
            const wrapper = render(fixtures[index], index);
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
        },
    );

    it('keeps published stable package overviews free of preview notices', () => {
        for (const index of [0, 4, 6]) {
            expect(render(fixtures[index], index).find('aside').exists()).toBe(false);
        }
    });
});
