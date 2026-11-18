import { describe, expect, it } from 'vite-plus/test';
import { navigationIcon } from './navigationIcons';
import { sourceNavigation } from '../components/docs/sourceNavigationFixture';

describe('documentation navigation icons', () => {
    it.each([
        ['', 'book-open'],
        ['getting-started/choose-a-package', 'boxes-stacked'],
        ['maintainer/configuration/ssh-keys', 'key'],
        ['maintainer/versioning/html-diffs', 'code-compare'],
        ['maintainer/deployment/pm2', 'diagram-project'],
        ['core/translated-attributes', 'language'],
        ['mosaicast/session-channels', 'satellite-dish'],
        ['front-awesome/toasts/vue', 'comments'],
        ['front-awesome/setup', 'plug'],
        ['front-awesome/styling', 'palette'],
        ['front-awesome/toasts', 'comments'],
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
        ['field-filters', 'filter'],
        ['field-order', 'arrow-down-wide-short'],
        ['actions', 'pen-to-square'],
        ['resources', 'file-export'],
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

    it('gives every registered Dapter guide an intentional icon', () => {
        const dapter = sourceNavigation().find((item) => item.slug === 'dapter');
        const pending = [dapter];
        const slugs = [];
        while (pending.length) {
            const item = pending.pop();
            slugs.push(item.slug);
            expect(navigationIcon(item.slug).name, item.slug).not.toBe('file-lines');
            pending.push(...item.children);
        }
        expect(slugs).toHaveLength(63);
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
        'qztray',
        'filoquent',
    ])('uses the uploaded duotone identity for %s', (id) => {
        expect(navigationIcon(id)).toEqual({
            name: `atb-${id}`,
            family: 'kit-duotone',
        });
    });
});
