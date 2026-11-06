import { mount } from '@vue/test-utils';
import { expect, it } from 'vite-plus/test';
import SiteIcon from '@/components/site/SiteIcon.vue';
import PackageGuideHeader from './PackageGuideHeader.vue';

const packageDetails = {
    id: 'maintainer',
    title: 'Maintainer',
    composerName: 'artisan-toolbox/maintainer',
    documentedVersion: '1.10',
    installedVersion: '1.x-dev',
    installationStatus: 'installed',
    installationSource: 'local-path',
    stability: 'Stable',
    repositoryUrl: 'https://github.com/artisan-toolbox/maintainer',
    artwork: { light: '/logo-light.svg', dark: '/logo-dark.svg' },
};

function render(slug, packageOverrides = {}) {
    return mount(PackageGuideHeader, {
        props: {
            page: {
                slug,
                title: slug === 'maintainer' ? 'Maintainer' : 'SSH Keys',
                description:
                    'Generate, display, and consume the encrypted identity.',
                package: { ...packageDetails, ...packageOverrides },
            },
        },
    });
}

it('keeps the package overview artwork and full package specifications', () => {
    const wrapper = render('maintainer');

    expect(wrapper.get('h1').text()).toBe('Maintainer');
    expect(wrapper.get('h1').findAll('img')).toHaveLength(2);
    expect(wrapper.find('[aria-label="Package details"]').exists()).toBe(false);
    expect(wrapper.findAll('dl dt').map((item) => item.text())).toEqual([
        'Package',
        'Documented version',
        'Stability',
        'Repository',
    ]);
    expect(wrapper.findAll('dl dd').map((item) => item.text())).toEqual([
        'artisan-toolbox/maintainer',
        '1.x-dev',
        'Stable',
        'GitHub',
    ]);
});

it.each(['maintainer', 'maintainer/configuration/ssh-keys'])(
    'links to the package repository with an accessible label and decorative icon on %s',
    (slug) => {
        const wrapper = render(slug);
        const link = wrapper.get(
            'a[href="https://github.com/artisan-toolbox/maintainer"]',
        );

        expect(link.text()).toBe('GitHub');
        expect(link.attributes()).toMatchObject({
            'aria-label': 'Maintainer repository on GitHub',
            target: '_blank',
            rel: 'noopener noreferrer',
        });
        expect(link.findComponent(SiteIcon).props()).toMatchObject({
            name: 'github',
            family: 'brands',
            label: '',
        });
    },
);

it.each(['maintainer', 'maintainer/configuration/ssh-keys'])(
    'omits a repository link when metadata provides no destination on %s',
    (slug) => {
        const wrapper = render(slug, { repositoryUrl: null });

        expect(wrapper.find('a').exists()).toBe(false);
        expect(wrapper.text()).not.toContain('Repository');
    },
);

it('shows a visible guide title and compact package, documented version, and stability tags', () => {
    const wrapper = render('maintainer/configuration/ssh-keys');

    expect(wrapper.get('h1').text()).toBe('SSH Keys');
    expect(wrapper.get('h1').find('.sr-only').exists()).toBe(false);
    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.find('dl').exists()).toBe(false);
    expect(
        wrapper
            .get('[aria-label="Package details"]')
            .findAll('span')
            .map((item) => item.text()),
    ).toEqual(['Maintainer', 'Documented version 1.x-dev', 'Stable']);
    expect(wrapper.text()).toContain(
        'Generate, display, and consume the encrypted identity.',
    );
});

it('does not present a documented version as installed when a package is missing', () => {
    for (const slug of ['maintainer', 'maintainer/configuration/ssh-keys']) {
        const wrapper = render(slug, {
            installedVersion: null,
            installationStatus: 'not-installed',
            installationSource: null,
        });
        expect(wrapper.text()).toContain('Not installed');
        expect(wrapper.text()).not.toContain('1.10');
        expect(wrapper.text()).not.toContain('1.x-dev');
    }
});

it('labels the installed version as the documented version without a second version tag', () => {
    const wrapper = render('maintainer/commands', {
        installedVersion: '1.10',
        installationSource: 'composer',
    });

    expect(wrapper.text()).toContain('Documented version 1.10');
    expect(wrapper.findAll('[aria-label="Package details"] span')).toHaveLength(
        3,
    );
});

it('keeps an installed package with unavailable version distinct from a missing package', () => {
    const wrapper = render('maintainer/commands', {
        installedVersion: null,
        installationStatus: 'version-unavailable',
        installationSource: null,
    });

    expect(wrapper.text()).toContain('Documented version Version unavailable');
    expect(wrapper.text()).not.toContain('Not installed');
});
