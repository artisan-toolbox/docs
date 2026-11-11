import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import fixtures from './qztray/legacy-parity.json';
import { sourceNavigation } from './sourceNavigationFixture';
import Overview from '../../pages/docs/qztray/Index.vue';
import ZplPreviewDemo from '@/components/demo/qztray/preview/ZplPreviewDemo.vue';
import Installation from '../../pages/docs/qztray/Installation.vue';
import Security from '../../pages/docs/qztray/Security.vue';
import Connection from '../../pages/docs/qztray/Connection.vue';
import Printing from '../../pages/docs/qztray/Printing.vue';
import EscposWriter from '../../pages/docs/qztray/EscposWriter.vue';
import EscposPreviews from '../../pages/docs/qztray/EscposPreviews.vue';
import ZplPreviews from '../../pages/docs/qztray/ZplPreviews.vue';
import PdfPreviews from '../../pages/docs/qztray/PdfPreviews.vue';
import Compatibility from '../../pages/docs/qztray/Compatibility.vue';
import FrontendTooling from '../../pages/docs/qztray/FrontendTooling.vue';
import Development from '../../pages/docs/qztray/Development.vue';

const components = {
    qztray: Overview,
    'qztray/installation': Installation,
    'qztray/security': Security,
    'qztray/connection': Connection,
    'qztray/printing': Printing,
    'qztray/escpos-writer': EscposWriter,
    'qztray/escpos-previews': EscposPreviews,
    'qztray/zpl-previews': ZplPreviews,
    'qztray/pdf-previews': PdfPreviews,
    'qztray/compatibility': Compatibility,
    'qztray/frontend-tooling': FrontendTooling,
    'qztray/development': Development,
};
const normalize = (text) => text.replace(/\s+/g, ' ').trim();
const navigation = sourceNavigation;
const packageMetadata = {
    id: 'qztray',
    title: 'QZ Tray Connector',
    composerName: 'artisan-toolbox/qztray',
    installedVersion: '1.2.1',
    installationStatus: 'installed',
    installationSource: 'composer',
    stability: 'Stable',
    installationCommands: {
        composer: {
            code: 'composer require artisan-toolbox/qztray:^1.2.1 tightenco/ziggy:^2.6.5',
        },
        setup: {
            code: 'composer require artisan-toolbox/qztray:^1.2.1 tightenco/ziggy:^2.6.5\nnpm install ./vendor/artisan-toolbox/qztray\nphp artisan vendor:publish --tag=qztray-config',
        },
        security: {
            code: 'composer require tightenco/ziggy:^2.6.5\nnpm install ziggy-js@^2.6.5',
        },
    },
};
const render = (slug, prefix = '/docs') =>
    mount(components[slug], {
        props: {
            navigation: navigation(prefix),
            page: {
                slug,
                title: fixtures.find((fixture) => fixture.slug === slug)?.title ?? slug,
                description: 'QZ Tray package guide.',
                requirements: fixtures[1].requirements,
                package: packageMetadata,
            },
        },
    });
const renderGuides = () =>
    Object.fromEntries(Object.keys(components).map((slug) => [slug, render(slug)]));

// The introduction now starts with a complete preview before optional authenticated printing.
// These exact source paragraphs are replaced by the overview and ordered installation steps.
const revisedIntroduction = new Set([
    'This guide covers QZ Tray Connector 1.2. Start with the quickstart or check supported environments.',
    'This page describes compatibility and API boundaries for QZ Tray 1.x. The package guide contains installation instructions and the complete API reference.',
    'Install the Laravel and frontend packages in your application:',
    'After installation, configure your Laravel application and submit a test print from the browser.',
    "Set public_key and private_key in config/qztray.php to the matching PEM certificate and RSA private key using the credential configuration guide. Expose the two named routes with Ziggy, load the frontend from an authenticated Laravel page, and keep the XSRF-TOKEN cookie available for signing. Start QZ Tray on the user's computer.",
    'Preview ESC/POS receipts, ZPL labels, or PDF documents',
    'Build the frontend during local development',
]);

const updatedToolingParagraphs = [
    {
        prefix: 'Frontend tooling supports Node.js',
        slug: 'qztray/compatibility',
        fragments: [
            'Installing the compiled frontend supports Node.js 20.19+',
            'Building and testing package sources with Vite Plus 1.6 requires Node.js 22.18+',
            'PDF previews require canvas and module workers',
            'ZPL previews require WebAssembly',
            'Deploy all emitted renderer assets',
        ],
    },
    {
        prefix: 'The tooling requires Node.js',
        slug: 'qztray/frontend-tooling',
        fragments: [
            'Node.js 22.18+ within 22.x, 24.11+ within 24.x, or 26 and later',
            'retains the existing Node.js 20.19+ compatibility',
            'The declared package manager is npm 11.17.0',
        ],
    },
    {
        prefix: 'Vite Plus and the vite alias',
        slug: 'qztray/frontend-tooling',
        fragments: [
            '@voidzero-dev/vite-plus-core must use the same version',
            'Both are pinned to 1.6.0',
            'Vite Plus supplies the matching Vitest 5.1.0 packages',
            'Remove older Vitest overrides',
            'refresh the lockfile',
        ],
    },
    {
        prefix: 'An isolated PHP test loads the service',
        slug: 'qztray/development',
        fragments: [
            'using only root and declared production dependency autoloaders',
            "exercise the actual QZ SDK's signing error boundary",
            'PDF engine tests use the real legacy distribution for headless Node rendering',
            'browser builds retain the modern distribution',
            'Node 22.18 and 24.11 for Ubuntu and Windows',
            'compiled ESM and CommonJS connector entries on Node 20.19',
        ],
    },
];

describe('QZ Tray documentation learning journey', () => {
    it('preserves source coverage and checks revised tooling contracts in their owning guides', () => {
        const guides = renderGuides();
        const wrappers = Object.values(guides);
        const texts = wrappers.map((wrapper) => normalize(wrapper.text()));
        for (const fixture of fixtures) {
            for (const paragraph of fixture.paragraphs) {
                if (revisedIntroduction.has(paragraph)) continue;
                const updated = updatedToolingParagraphs.find(({ prefix }) =>
                    paragraph.startsWith(prefix),
                );
                if (updated) {
                    const text = normalize(guides[updated.slug].text());
                    for (const fragment of updated.fragments) expect(text).toContain(fragment);
                    continue;
                }
                expect(
                    texts.some((text) => text.includes(normalize(paragraph))),
                    paragraph,
                ).toBe(true);
            }
        }
        const examples = wrappers.flatMap((wrapper) =>
            wrapper.findAll('pre code').map((code) => code.element.textContent),
        );
        const replacedExamples = new Set([
            fixtures[1].examples[0].code,
            fixtures[1].examples[1].code,
            fixtures[1].examples.find((example) =>
                example.code.startsWith('composer require tightenco/ziggy:'),
            ).code,
        ]);
        for (const fixture of fixtures) {
            for (const example of fixture.examples) {
                if (replacedExamples.has(example.code)) continue;
                expect(examples, example.code).toContain(example.code);
            }
        }
        const tables = wrappers.flatMap((wrapper) =>
            wrapper
                .findAll('table')
                .map((table) =>
                    table
                        .findAll('tr')
                        .map((row) => row.findAll('th, td').map((cell) => normalize(cell.text()))),
                ),
        );
        for (const fixture of fixtures) {
            for (const table of fixture.tables)
                expect(tables).toContainEqual(table.map((row) => row.map(normalize)));
        }
        for (const wrapper of wrappers) wrapper.unmount();
    });

    it('keeps the overview concise and preserves each historical section as a guide destination', () => {
        const guides = renderGuides();
        const overview = guides.qztray;
        expect(
            overview
                .findAll('pre code')
                .filter((code) => !code.element.closest('[data-docs-outline-exclude]')),
        ).toHaveLength(2);
        expect(overview.text()).toContain('Preview label');
        expect(overview.text()).toContain('A PNG image containing Hello appears.');
        expect(overview.find('table').exists()).toBe(false);
        for (const heading of fixtures[1].headings) {
            const anchor = overview.findAll(`[id="${heading.id}"]`);
            expect(anchor, heading.id).toHaveLength(1);
            if (['requirements', 'installation', 'quickstart', 'guides'].includes(heading.id))
                continue;
            const href = anchor[0].element.closest('li').querySelector('a').getAttribute('href');
            const guide = guides[href.replace('/docs/', '')];
            expect(guide, href).toBeDefined();
            expect(guide.findAll(`[id="${heading.id}"]`), href + '#' + heading.id).toHaveLength(1);
        }
        for (const wrapper of Object.values(guides)) wrapper.unmount();
    });

    it('uses existing route metadata for every local guide link and resolves section targets', async () => {
        const guides = renderGuides();
        for (const wrapper of Object.values(guides)) {
            for (const link of wrapper.findAll('a')) {
                const href = link.attributes('href');
                if (href.startsWith('#')) {
                    expect(wrapper.findAll(`[id="${href.slice(1)}"]`), href).toHaveLength(1);
                } else if (href.startsWith('/docs/qztray')) {
                    const [path, hash] = href.replace('/docs/', '').split('#');
                    expect(guides[path], href).toBeDefined();
                    if (hash) expect(guides[path].findAll(`[id="${hash}"]`), href).toHaveLength(1);
                }
            }
            await wrapper.setProps({ navigation: navigation('/reference') });
            for (const link of wrapper.findAll('a'))
                expect(link.attributes('href')).not.toMatch(/^\/docs\/qztray/);
        }
        for (const wrapper of Object.values(guides)) wrapper.unmount();
    });

    it('includes a reader-triggered preview beside the static quickstart', () => {
        const overview = render('qztray');
        expect(overview.getComponent(ZplPreviewDemo).exists()).toBe(true);
        expect(overview.find('img[alt="Label containing Hello"]').exists()).toBe(false);
        overview.unmount();
    });

    it('keeps compatibility anchors and updates overview requirements from page metadata', async () => {
        const compatibility = render('qztray/compatibility');
        for (const heading of fixtures[0].headings) {
            expect(compatibility.findAll(`[id="${heading.id}"]`)).toHaveLength(1);
            expect(compatibility.get(`[id="${heading.id}"]`).text()).toBe(heading.text);
        }
        const overview = render('qztray');
        await overview.setProps({
            page: {
                ...overview.props('page'),
                requirements: ['PHP 8.5 with OpenSSL'],
            },
        });
        expect(
            overview
                .get('section[aria-labelledby="requirements"]')
                .findAll('li')
                .map((item) => item.text()),
        ).toEqual(['PHP 8.5 with OpenSSL']);
        compatibility.unmount();
        overview.unmount();
    });

    it('places credential prerequisites before connecting and keeps active work in reader actions', () => {
        const security = render('qztray/security');
        const ids = security.findAll('[id]').map((element) => element.attributes('id'));
        expect(ids.indexOf('configure-printing-credentials')).toBeLessThan(
            ids.indexOf('ziggy-route-configuration'),
        );
        const installation = render('qztray/installation');
        expect(
            installation
                .findAll('pre code')
                .map((code) => code.text())
                .join('\n'),
        ).toContain('@click="findPrinters"');
        expect(installation.text()).toContain('submission, not physical print completion');
        expect(
            installation
                .get('a[href="/docs/qztray/security#configure-printing-credentials"]')
                .text(),
        ).toBe('credential configuration');
        security.unmount();
        installation.unmount();
    });
});
