import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { ZiggyVue, route } from 'ziggy-js';
import ziggy from '../../../tests/Fixtures/ziggy.json';

afterEach(() => {
    vi.unstubAllGlobals();
    delete globalThis.Ziggy;
    document.getElementById('ziggy-routes-json')?.remove();
});

function publishRoutes() {
    delete globalThis.Ziggy;
    const element = document.createElement('script');
    element.id = 'ziggy-routes-json';
    element.type = 'application/json';
    element.textContent = JSON.stringify(ziggy);
    document.head.append(element);
}

describe('Ziggy application integration', () => {
    it('lets direct package imports discover Laravel JSON before a Vue route helper runs', () => {
        publishRoutes();
        expect(route('qztray_connector.get_public_key', undefined, false)).toBe(
            '/qztray-connector/get-public-key',
        );
        expect(route('qztray_connector.sign_payload', undefined, false)).toBe(
            '/qztray-connector/sign-payload',
        );
        expect(globalThis.Ziggy).toEqual(ziggy);
    });

    it('uses the same JSON configuration for the Vue plugin and direct imports', () => {
        publishRoutes();
        const wrapper = mount(
            {
                template: '<a :href="route(\'docs.index\', undefined, false)">Documentation</a>',
            },
            {
                global: { plugins: [ZiggyVue] },
            },
        );
        expect(wrapper.get('a').attributes('href')).toBe('/docs');
        expect(route('docs.index', undefined, false)).toBe('/docs');
        wrapper.unmount();
    });

    it('resolves nested documentation slugs and query parameters through the installed public helper', () => {
        publishRoutes();
        expect(
            route(
                'docs.show',
                {
                    slug: 'maintainer/configuration/ssh-keys',
                    _query: { source: 'search' },
                },
                false,
            ),
        ).toBe('/docs/maintainer/configuration/ssh-keys?source=search');
    });
});
