import { describe, expect, it } from 'vite-plus/test';
import { dataViewSlug, navigationIcon } from './navigationIcons';
import { sourceNavigation } from '../components/docs/sourceNavigationFixture';

describe('documentation navigation icons', () => {
    it.each([
        ['', 'book-open'],
        ['getting-started/choose-a-package', 'boxes-stacked'],
        ['maintainer/configuration/ssh-keys', 'key'],
        ['maintainer/versioning/html-diffs', 'code-compare'],
        ['maintainer/deployment/pm2', 'layer-group'],
        ['core/translated-attributes', 'language'],
        ['mosaicast/session-channels', 'satellite-dish'],
        ['front-awesome/toasts/vue', 'message'],
        ['front-awesome/setup', 'plug'],
        ['front-awesome/styling', 'palette'],
        ['front-awesome/scrollbar', 'arrows-up-down'],
        ['front-awesome/toasts', 'bell'],
        ['front-awesome/web-awesome/components', 'shapes'],
        ['front-awesome/web-awesome/components/actions', 'hand-pointer'],
        ['front-awesome/web-awesome/components/forms', 'rectangle-list'],
        ['front-awesome/web-awesome/components/layout', 'table-columns'],
        ['front-awesome/web-awesome/components/navigation', 'compass'],
        ['front-awesome/web-awesome/components/feedback', 'comment-dots'],
        ['front-awesome/web-awesome/components/media', 'photo-film'],
        ['front-awesome/web-awesome/components/data-viz', 'chart-column'],
        ['front-awesome/web-awesome/components/helpers', 'toolbox'],
        ['qztray/zpl-previews', 'barcode'],
        ['qztray/security', 'shield-halved'],
        ['filoquent/rename-owners', 'file-pen'],
        ['front-awesome/preferences/language', 'language'],
        ['mosaicast/inertia-delivery', 'paper-plane'],
        ['mosaicast/roadmap', 'list-check'],
        ['dapter/vue-navigation', 'link'],
        ['dapter/comparison-capabilities', 'scale-balanced'],
        ['dapter/research/pagination-consistency', 'layer-group'],
    ])('gives %s a relevant Font Awesome icon at any nesting depth', (slug, icon) => {
        expect(navigationIcon(slug)).toEqual({
            name: icon,
            family: 'classic',
        });
    });

    it.each([
        ['sources', 'database'],
        ['listing', 'table-list'],
        ['vue-controls', 'sliders'],
        ['field-search', 'magnifying-glass'],
        ['global-search', 'binoculars'],
        ['multi-order', 'arrow-down-wide-short'],
        ['action-outcomes', 'clipboard-check'],
        ['field-filters', 'filter'],
        ['field-order', 'arrow-down-a-z'],
        ['actions', 'pen-to-square'],
        ['resources', 'right-left'],
        ['live-updates', 'arrows-rotate'],
        ['authority', 'book-open'],
        ['development', 'screwdriver-wrench'],
        ['cursor-paging', 'forward-step'],
        ['cursor-recovery', 'arrow-rotate-left'],
        ['polling', 'clock'],
        ['live-authorization', 'shield-halved'],
    ])('gives Dapter %s the symbol for its reader task', (slug, icon) => {
        expect(navigationIcon(`dapter/${slug}`)).toEqual({ name: icon, family: 'classic' });
    });

    it('gives every registered page an intentional icon', () => {
        const pending = sourceNavigation();
        while (pending.length) {
            const item = pending.pop();
            expect(navigationIcon(item.slug).name, item.slug).not.toBe('file-lines');
            pending.push(...item.children);
        }
    });

    it('gives all DataView guides distinct task icons', () => {
        const frontAwesome = sourceNavigation().find((item) => item.slug === 'front-awesome');
        const dataView = frontAwesome.children.find((item) => item.slug === dataViewSlug);
        const icons = [dataView, ...dataView.children].map(({ slug }) => navigationIcon(slug).name);
        expect(icons).toEqual([
            'table-list',
            'table-columns',
            'filter',
            'arrow-down-a-z',
            'list-check',
            'forward-step',
            'pen-to-square',
            'clock-rotate-left',
            'arrows-rotate',
            'file-code',
        ]);
    });

    it('keeps newly registered guides visible with a document icon before visual refinement', () => {
        expect(navigationIcon('core/new-guide')).toEqual({
            name: 'file-lines',
            family: 'classic',
        });
    });

    it.each([
        'core',
        'dapter',
        'dump-to-console',
        'front-awesome',
        'maintainer',
        'mosaicast',
        'permit',
        'qztray',
        'filoquent',
    ])('uses the uploaded duotone identity for %s', (id) => {
        expect(navigationIcon(id)).toEqual({
            name: `atb-${id}`,
            family: 'kit-duotone',
        });
    });
});
