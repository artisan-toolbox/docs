import { describe, expect, it } from 'vite-plus/test';
import { navigationIcon } from './navigationIcons';

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

    it('keeps newly registered guides visible with a document icon before visual refinement', () => {
        expect(navigationIcon('core/new-guide')).toEqual({
            name: 'file-lines',
            family: 'classic',
        });
    });

    it.each([
        'core',
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
